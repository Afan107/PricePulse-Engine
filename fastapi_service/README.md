# PricePulse B2B Game Deal API Microservice

A production-grade, high-throughput Python FastAPI microservice with async Redis caching and tiered API-key metering for commercial gaming platforms.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   Client Request (HTTP/2)   |
                      |   Header: X-API-Key: ...    |
                      +--------------+--------------+
                                     |
                                     v
                 +---------------------------------------+
                 |       ApiKeyMeteringMiddleware        |
                 |  - SISMEMBER active_keys              |
                 |  - INCR meter:{key}:{YYYY-MM}         |
                 |  - Check Hobby (25k) vs Comm (250k)   |
                 +-------------------+-------------------+
                                     | (200 OK or 429 Throttle)
                                     v
                       +---------------------------+
                       |      FastAPI Router       |
                       +-------------+-------------+
                                     |
                         Check Cache (Sub-2ms)
                                     |
                     +---------------+---------------+
            [Cache HIT]                              [Cache MISS]
                     |                                     |
                     v                                     v
          +---------------------+              +----------------------+
          | Return from Redis   |              | Query PostgreSQL via |
          | X-Cache: HIT        |              | SQLAlchemy 2.0 Async |
          +---------------------+              +-----------+----------+
                                                           |
                                                Prime Cache (EX 900s)
                                                           |
                                                           v
                                               +----------------------+
                                               | Return Response      |
                                               | X-Cache: MISS        |
                                               +----------------------+
```

---

## Endpoints

### 1. `GET /v1/games/{slug}/lowest-price`
- **Cache Strategy**: Looked up in Redis key `cache:lowest_price:{slug}`.
- **Cache Miss**: Queries PostgreSQL `store_prices` table filtered by `is_authorized_store = True` and ordered by lowest price. Quarantines grey-market resellers. Prime cache with 15-minute TTL (`ex=900`).
- **Response Headers**:
  - `X-Cache`: `HIT` | `MISS`
  - `Cache-Control`: `public, max-age=900`
  - `X-RateLimit-Limit`: `25000` (Hobby) or `250000` (Commercial)
  - `X-RateLimit-Remaining`: e.g. `24982`
  - `X-RateLimit-Tier`: `hobby` | `commercial`

### 2. `GET /v1/deals/all-time-lows?limit=20`
- **Description**: Real-time stream of all-time low price records.
- **Parameters**: `limit` (int, default=20, max=100).
- **Cache Strategy**: Caches feed in Redis for 60 seconds.

### 3. `GET /health`
- **Description**: Verifies Redis PING latency and database connectivity. Unauthenticated.

---

## Metering & Rate-Limiting Rules

| Plan Tier | Monthly Quota | Redis Key Format | On Exceeded |
|---|---|---|---|
| **Hobby** | 25,000 requests/mo | `meter:{api_key}:{YYYY-MM}` | HTTP 429 with `Retry-After` |
| **Commercial** | 250,000 requests/mo | `meter:{api_key}:{YYYY-MM}` | HTTP 429 with `Retry-After` |

### Throttled Response (HTTP 429):
```json
{
  "error": "TOO_MANY_REQUESTS",
  "detail": "Monthly quota of 25,000 requests for tier 'hobby' has been exceeded.",
  "code": "MONTHLY_QUOTA_EXCEEDED",
  "tier": "hobby",
  "monthly_limit": 25000,
  "current_usage": 25001,
  "retry_after_seconds": 1814400
}
```

---

## Quick Start (Docker)

```bash
cd fastapi_service
docker compose up --build -d

# Run seeds
docker compose exec api python -m app.seed
```

Test with curl:
```bash
# Valid Hobby Key
curl -i -H "x-api-key: pk_hobby_user123" http://localhost:8000/v1/games/baldurs-gate-3/lowest-price

# Valid Commercial Key
curl -i -H "x-api-key: pk_comm_enterprise99" http://localhost:8000/v1/deals/all-time-lows?limit=10

# Unauthorized Key (HTTP 401)
curl -i -H "x-api-key: invalid_key" http://localhost:8000/v1/games/baldurs-gate-3/lowest-price
```
