import asyncio
from datetime import datetime, timezone, date
from decimal import Decimal
import redis.asyncio as aioredis
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import engine, async_session_maker, Base
from app.models import Game, StorePrice, HistoricalLow


async def seed_database_and_redis():
    print("[*] Creating database schema tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    print("[*] Seeding sample games, store prices, and historical lows...")
    async with async_session_maker() as session:
        # 1. Baldur's Gate 3
        bg3 = Game(
            slug="baldurs-gate-3",
            title="Baldur's Gate 3",
            base_msrp=Decimal("59.99"),
            historical_baseline_msrp=Decimal("59.99"),
            release_date=date(2023, 8, 3),
        )
        session.add(bg3)
        await session.flush()

        bg3_prices = [
            StorePrice(
                game_id=bg3.id,
                store_slug="gog",
                store_name="GOG.com",
                current_price=Decimal("34.99"),
                original_msrp=Decimal("59.99"),
                discount_pct=42,
                is_authorized_store=True,
                developer_cut_pct=Decimal("70.00"),
            ),
            StorePrice(
                game_id=bg3.id,
                store_slug="steam",
                store_name="Steam",
                current_price=Decimal("47.99"),
                original_msrp=Decimal("59.99"),
                discount_pct=20,
                is_authorized_store=True,
                developer_cut_pct=Decimal("70.00"),
            ),
            StorePrice(
                game_id=bg3.id,
                store_slug="g2a",
                store_name="G2A Marketplace",
                current_price=Decimal("29.90"),
                original_msrp=Decimal("59.99"),
                discount_pct=50,
                is_authorized_store=False,  # Unauthorized grey market
                developer_cut_pct=Decimal("0.00"),
            ),
        ]
        session.add_all(bg3_prices)

        bg3_atl = HistoricalLow(
            game_id=bg3.id,
            lowest_price=Decimal("34.99"),
            previous_lowest_price=Decimal("39.99"),
            recorded_store_slug="gog",
            recorded_store_name="GOG.com",
            recorded_at=datetime.now(timezone.utc),
            is_active_all_time_low=True,
        )
        session.add(bg3_atl)

        # 2. Cyberpunk 2077
        cp = Game(
            slug="cyberpunk-2077",
            title="Cyberpunk 2077",
            base_msrp=Decimal("59.99"),
            historical_baseline_msrp=Decimal("59.99"),
            release_date=date(2020, 12, 10),
        )
        session.add(cp)
        await session.flush()

        cp_prices = [
            StorePrice(
                game_id=cp.id,
                store_slug="steam",
                store_name="Steam",
                current_price=Decimal("29.99"),
                original_msrp=Decimal("59.99"),
                discount_pct=50,
                is_authorized_store=True,
                developer_cut_pct=Decimal("70.00"),
            ),
            StorePrice(
                game_id=cp.id,
                store_slug="epic_games",
                store_name="Epic Games Store",
                current_price=Decimal("29.99"),
                original_msrp=Decimal("59.99"),
                discount_pct=50,
                is_authorized_store=True,
                developer_cut_pct=Decimal("88.00"),  # Epic 88% split!
            ),
        ]
        session.add_all(cp_prices)

        cp_atl = HistoricalLow(
            game_id=cp.id,
            lowest_price=Decimal("23.99"),
            previous_lowest_price=Decimal("29.99"),
            recorded_store_slug="steam",
            recorded_store_name="Steam",
            recorded_at=datetime.now(timezone.utc),
            is_active_all_time_low=True,
        )
        session.add(cp_atl)

        # 3. Elden Ring
        er = Game(
            slug="elden-ring",
            title="Elden Ring",
            base_msrp=Decimal("59.99"),
            historical_baseline_msrp=Decimal("59.99"),
            release_date=date(2022, 2, 25),
        )
        session.add(er)
        await session.flush()

        er_prices = [
            StorePrice(
                game_id=er.id,
                store_slug="humble_store",
                store_name="Humble Store",
                current_price=Decimal("35.99"),
                original_msrp=Decimal("59.99"),
                discount_pct=40,
                is_authorized_store=True,
                developer_cut_pct=Decimal("70.00"),
            ),
        ]
        session.add_all(er_prices)

        er_atl = HistoricalLow(
            game_id=er.id,
            lowest_price=Decimal("34.79"),
            previous_lowest_price=Decimal("39.99"),
            recorded_store_slug="bandai_store",
            recorded_store_name="Bandai Namco Direct",
            recorded_at=datetime.now(timezone.utc),
            is_active_all_time_low=True,
        )
        session.add(er_atl)

        await session.commit()
        print("[✓] PostgreSQL database populated successfully.")

    # Seed Redis Active Keys & Tiers
    print("[*] Seeding Redis active API keys and rate limits...")
    redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    try:
        # Add keys to active_keys set
        await redis.sadd(
            settings.REDIS_ACTIVE_KEYS_SET,
            "pk_hobby_user123",
            "pk_comm_enterprise99",
            "pk_hobby_demo",
        )

        # Configure tiers
        await redis.set(f"{settings.REDIS_KEY_TIER_HASH_PREFIX}pk_hobby_user123", "hobby")
        await redis.set(f"{settings.REDIS_KEY_TIER_HASH_PREFIX}pk_comm_enterprise99", "commercial")
        await redis.set(f"{settings.REDIS_KEY_TIER_HASH_PREFIX}pk_hobby_demo", "hobby")

        print("[✓] Redis active_keys set and tier mappings configured.")
    finally:
        await redis.aclose()


if __name__ == "__main__":
    asyncio.run(seed_database_and_redis())
