import json
from typing import Optional, Any
from decimal import Decimal
from datetime import datetime, date
import redis.asyncio as aioredis
from app.config import settings

# Shared Async Redis Connection Pool
redis_pool: Optional[aioredis.ConnectionPool] = None


class DecimalDateTimeEncoder(json.JSONEncoder):
    """Custom JSON encoder for Decimal, datetime, and date objects."""
    def default(self, obj: Any) -> Any:
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)


async def init_redis_pool() -> aioredis.ConnectionPool:
    """Initialize Redis connection pool on startup."""
    global redis_pool
    if redis_pool is None:
        redis_pool = aioredis.ConnectionPool.from_url(
            settings.REDIS_URL,
            max_connections=50,
            decode_responses=True,
            socket_timeout=2.0,
            socket_connect_timeout=2.0,
        )
    return redis_pool


async def close_redis_pool() -> None:
    """Gracefully close Redis pool on shutdown."""
    global redis_pool
    if redis_pool is not None:
        await redis_pool.disconnect()
        redis_pool = None


async def get_redis() -> aioredis.Redis:
    """Fast dependency/helper to acquire an async Redis client from pool."""
    global redis_pool
    if redis_pool is None:
        await init_redis_pool()
    return aioredis.Redis(connection_pool=redis_pool)


# Key Generation Utilities
def make_lowest_price_cache_key(slug: str) -> str:
    return f"cache:lowest_price:{slug.lower().strip()}"


def make_atl_feed_cache_key(limit: int) -> str:
    return f"cache:deals:all_time_lows:{limit}"


async def get_cached_json(key: str) -> Optional[dict]:
    """Retrieves and deserializes JSON from Redis in <2ms."""
    redis = await get_redis()
    raw = await redis.get(key)
    if raw:
        try:
            return json.loads(raw)
        except Exception:
            return None
    return None


async def set_cached_json(key: str, data: dict, ttl_seconds: int) -> bool:
    """Serializes and saves JSON to Redis with exact TTL expiry."""
    redis = await get_redis()
    serialized = json.dumps(data, cls=DecimalDateTimeEncoder)
    return await redis.set(key, serialized, ex=ttl_seconds)


async def invalidate_game_cache(slug: str) -> None:
    """Invalidates the lowest price cache for a given game."""
    redis = await get_redis()
    await redis.delete(make_lowest_price_cache_key(slug))
