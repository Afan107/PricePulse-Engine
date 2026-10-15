from datetime import datetime, timezone
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.models import HistoricalLow, Game
from app.schemas import AllTimeLowsResponse, AllTimeLowRecord
from app.cache import (
    get_cached_json,
    set_cached_json,
    make_atl_feed_cache_key,
)
from app.config import settings

router = APIRouter(prefix="/v1/deals", tags=["Deals"])


@router.get(
    "/all-time-lows",
    response_model=AllTimeLowsResponse,
    summary="Get real-time All-Time Low (ATL) deals feed",
    description=(
        "Returns a stream of newly broken or active all-time low price events across storefronts. "
        "Cached for 60 seconds in Redis for high throughput. Accepts an optional 'limit' query parameter (max 100)."
    ),
)
async def get_all_time_lows(
    response: Response,
    limit: int = Query(default=20, ge=1, le=100, description="Max number of ATL deals to return"),
    db: AsyncSession = Depends(get_db),
) -> AllTimeLowsResponse:
    cache_key = make_atl_feed_cache_key(limit)

    # 1. Check Redis Cache
    cached_payload = await get_cached_json(cache_key)
    if cached_payload:
        response.headers["X-Cache"] = "HIT"
        response.headers["Cache-Control"] = f"public, max-age={settings.ATL_FEED_CACHE_TTL_SECONDS}"
        return AllTimeLowsResponse.model_validate(cached_payload)

    # 2. Cache Miss: Query Database
    stmt = (
        select(HistoricalLow)
        .where(HistoricalLow.is_active_all_time_low == True)  # noqa: E712
        .options(joinedload(HistoricalLow.game))
        .order_by(HistoricalLow.recorded_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    historical_lows = result.scalars().all()

    deals: List[AllTimeLowRecord] = []
    for hl in historical_lows:
        prev = hl.previous_lowest_price
        savings = Decimal("0.00")
        if prev and prev > hl.lowest_price:
            savings = prev - hl.lowest_price

        deals.append(
            AllTimeLowRecord(
                game_id=str(hl.game.id),
                game_slug=hl.game.slug,
                title=hl.game.title,
                lowest_price=hl.lowest_price,
                previous_lowest_price=prev,
                savings_vs_previous_atl=savings,
                recorded_store_name=hl.recorded_store_name,
                recorded_store_slug=hl.recorded_store_slug,
                recorded_at=hl.recorded_at,
                is_active=hl.is_active_all_time_low,
            )
        )

    feed_response = AllTimeLowsResponse(
        count=len(deals),
        timestamp=datetime.now(timezone.utc),
        deals=deals,
    )

    # 3. Cache in Redis with 60-second TTL
    await set_cached_json(
        cache_key,
        feed_response.model_dump(mode="json"),
        ttl_seconds=settings.ATL_FEED_CACHE_TTL_SECONDS,
    )

    response.headers["X-Cache"] = "MISS"
    response.headers["Cache-Control"] = f"public, max-age={settings.ATL_FEED_CACHE_TTL_SECONDS}"
    return feed_response
