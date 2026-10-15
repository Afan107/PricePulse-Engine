from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "PricePulse B2B Game Deal API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False

    # PostgreSQL Database URL (asyncpg)
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/pricepulse_db",
        description="Async PostgreSQL connection string"
    )

    # Redis Connection URL
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URI"
    )

    # Cache TTL Configuration
    LOWEST_PRICE_CACHE_TTL_SECONDS: int = 900  # 15 minutes
    ATL_FEED_CACHE_TTL_SECONDS: int = 60       # 1 minute real-time feed buffer

    # Monthly Metering Limits per Plan Tier
    RATE_LIMIT_HOBBY_MONTHLY: int = 25_000
    RATE_LIMIT_COMMERCIAL_MONTHLY: int = 250_000

    # Redis Key Namespaces
    REDIS_ACTIVE_KEYS_SET: str = "active_keys"
    REDIS_KEY_TIER_HASH_PREFIX: str = "api_key_tier:"
    REDIS_METER_KEY_PREFIX: str = "meter:"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
