import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import settings
from app.cache import init_redis_pool, close_redis_pool, get_redis
from app.database import engine
from app.middleware import ApiKeyMeteringMiddleware
from app.routers import games, deals


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.
    Initializes async Redis pool and tests PostgreSQL connectivity on startup;
    gracefully drains connections on shutdown.
    """
    # 1. Initialize Redis connection pool
    await init_redis_pool()

    # 2. Warm up Database connection
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception as e:
        # Log warning during startup in development if DB is warming up
        print(f"[Warning] PostgreSQL ping failed on startup: {e}")

    yield

    # 3. Shutdown hooks: close Redis pool and engine
    await close_redis_pool()
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "High-performance B2B Game Deal API with sub-5ms Redis caching, "
        "SQLAlchemy 2.0 async ORM, and tiered API-key metering."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware (configure for commercial clients)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Cache", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Tier", "Retry-After"],
)

# Core API-Key Verification & Rate-Limiting Metering Middleware
app.add_middleware(ApiKeyMeteringMiddleware)

# Include API Routers
app.include_router(games.router)
app.include_router(deals.router)


@app.get("/health", tags=["Health"], summary="Health check and service telemetry")
async def health_check() -> JSONResponse:
    """
    Public health check endpoint.
    Verifies Redis ping latency and database connectivity.
    Does not require X-API-Key.
    """
    redis_status = "unhealthy"
    redis_latency_ms = None
    db_status = "unhealthy"

    # Check Redis
    try:
        t0 = time.perf_counter()
        redis = await get_redis()
        pong = await redis.ping()
        if pong:
            redis_latency_ms = round((time.perf_counter() - t0) * 1000, 2)
            redis_status = "healthy"
    except Exception as e:
        redis_status = f"error: {str(e)}"

    # Check Database
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"

    overall_healthy = (redis_status == "healthy") and (db_status == "healthy")

    return JSONResponse(
        status_code=status.HTTP_200_OK if overall_healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "status": "pass" if overall_healthy else "fail",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "components": {
                "redis_cache": {
                    "status": redis_status,
                    "ping_latency_ms": redis_latency_ms,
                },
                "postgres_database": {
                    "status": db_status,
                },
            },
        },
    )


@app.get("/", tags=["Root"], include_in_schema=False)
async def root_redirect():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
    }
