from datetime import datetime, timezone
import calendar
from typing import Tuple
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from app.cache import get_redis
from app.config import settings

# Paths that bypass API-key verification and metering
PUBLIC_PATHS = {
    "/",
    "/health",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/favicon.ico",
}


def get_current_month_key_suffix() -> Tuple[str, int]:
    """
    Returns (year_month_str, seconds_until_end_of_month).
    e.g. ('2026-10', 1814400)
    """
    now = datetime.now(timezone.utc)
    year_month = now.strftime("%Y-%m")
    
    # Calculate seconds until the exact end of the current month
    last_day = calendar.monthrange(now.year, now.month)[1]
    end_of_month = datetime(now.year, now.month, last_day, 23, 59, 59, tzinfo=timezone.utc)
    seconds_remaining = max(1, int((end_of_month - now).total_seconds()))
    
    return year_month, seconds_remaining


class ApiKeyMeteringMiddleware(BaseHTTPMiddleware):
    """
    Production-grade ASGI middleware that:
    1. Authenticates incoming requests against the Redis 'active_keys' set.
    2. Retrieves the tenant's plan tier (Hobby: 25k/mo, Commercial: 250k/mo).
    3. Meter monthly consumption atomically using Redis INCR.
    4. Throttles with HTTP 429 when monthly quota is exhausted.
    5. Injects standard rate-limiting headers.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # 1. Allow public health & docs endpoints
        path = request.url.path
        if path in PUBLIC_PATHS or path.startswith(("/docs", "/redoc", "/static")):
            return await call_next(request)

        # 2. Extract X-API-Key header
        api_key = request.headers.get("x-api-key")
        if not api_key:
            return JSONResponse(
                status_code=401,
                content={
                    "error": "UNAUTHORIZED",
                    "detail": "Missing required 'X-API-Key' header in request.",
                    "code": "MISSING_API_KEY",
                },
                headers={"WWW-Authenticate": "ApiKey"},
            )

        api_key = api_key.strip()
        redis = await get_redis()

        # 3. Check membership in Redis set 'active_keys' (< 1ms lookup)
        is_active = await redis.sismember(settings.REDIS_ACTIVE_KEYS_SET, api_key)
        if not is_active:
            return JSONResponse(
                status_code=401,
                content={
                    "error": "UNAUTHORIZED",
                    "detail": "Invalid, expired, or revoked API key provided.",
                    "code": "INVALID_API_KEY",
                },
                headers={"WWW-Authenticate": "ApiKey"},
            )

        # 4. Resolve Plan Tier (Redis hash or key convention fallback)
        tier_key = f"{settings.REDIS_KEY_TIER_HASH_PREFIX}{api_key}"
        tier = await redis.get(tier_key)
        
        if not tier:
            # Fallback based on key prefix convention or default to Hobby
            if api_key.startswith(("comm_", "pk_comm_", "sk_commercial_")):
                tier = "commercial"
            else:
                tier = "hobby"
        else:
            tier = tier.lower().strip()

        # Determine monthly quota
        if tier == "commercial":
            monthly_limit = settings.RATE_LIMIT_COMMERCIAL_MONTHLY
        else:
            tier = "hobby"
            monthly_limit = settings.RATE_LIMIT_HOBBY_MONTHLY

        # 5. Atomic Metering: increment monthly usage counter in Redis
        year_month, seconds_until_month_end = get_current_month_key_suffix()
        meter_key = f"{settings.REDIS_METER_KEY_PREFIX}{api_key}:{year_month}"

        # Increment atomically
        current_usage = await redis.incr(meter_key)
        if current_usage == 1:
            # First request in this billing month: set TTL to expire after month end + 5-day safety buffer
            await redis.expire(meter_key, seconds_until_month_end + (5 * 86400))

        remaining = max(0, monthly_limit - current_usage)

        # 6. Enforce Rate Limit Threshold
        if current_usage > monthly_limit:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "TOO_MANY_REQUESTS",
                    "detail": f"Monthly quota of {monthly_limit:,} requests for tier '{tier}' has been exceeded.",
                    "code": "MONTHLY_QUOTA_EXCEEDED",
                    "tier": tier,
                    "monthly_limit": monthly_limit,
                    "current_usage": current_usage,
                    "retry_after_seconds": seconds_until_month_end,
                },
                headers={
                    "Retry-After": str(seconds_until_month_end),
                    "X-RateLimit-Limit": str(monthly_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Tier": tier,
                },
            )

        # Attach tenant metadata to request state for downstream handlers
        request.state.api_key = api_key
        request.state.tier = tier
        request.state.current_usage = current_usage
        request.state.monthly_limit = monthly_limit

        # 7. Execute handler and inject telemetry response headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(monthly_limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Tier"] = tier
        return response
