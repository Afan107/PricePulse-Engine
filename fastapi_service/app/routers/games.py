from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Game, StorePrice, HistoricalLow
from app.schemas import (
    LowestPriceResponse,
    StoreDealSchema,
    HistoricalLowInfo,
    MarketAnalysisInfo,
)
from app.cache import (
    get_cached_json,
    set_cached_json,
    make_lowest_price_cache_key,
)
from app.config import settings

router = APIRouter(prefix="/v1/games", tags=["Games"])


@router.get(
    "/{slug}/lowest-price",
    response_model=LowestPriceResponse,
    summary="Get lowest authorized price for a game (15-min Redis Cache)",
    description=(
        "Retrieves the best current price across authorized retailers for a given game. "
        "Returns cached result in sub-5ms from Redis. On cache miss, queries database, "
        "evaluates store integrity, calculates developer revenue share, checks for deceptive discounts, "
        "and primes the Redis cache for 15 minutes."
    ),
)
async def get_game_lowest_price(
    slug: str,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> LowestPriceResponse:
    normalized_slug = slug.lower().strip()
    cache_key = make_lowest_price_cache_key(normalized_slug)

    # 1. Check Redis Cache (< 2ms lookup)
    cached_payload = await get_cached_json(cache_key)
    if cached_payload:
        response.headers["X-Cache"] = "HIT"
        response.headers["Cache-Control"] = f"public, max-age={settings.LOWEST_PRICE_CACHE_TTL_SECONDS}"
        cached_payload["cache_status"] = "HIT"
        return LowestPriceResponse.model_validate(cached_payload)

    # 2. Cache Miss: Query Database with async session
    stmt = (
        select(Game)
        .where(Game.slug == normalized_slug)
        .options(
            selectinload(Game.store_prices),
            selectinload(Game.historical_low),
        )
    )
    result = await db.execute(stmt)
    game = result.scalar_one_or_none()

    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game with slug '{slug}' not found in catalog.",
        )

    # Filter to authorized distributors only (quarantine grey-market resellers)
    authorized_prices = [p for p in game.store_prices if p.is_authorized_store]

    if not authorized_prices:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No authorized pricing available for game '{game.title}'.",
        )

    # Find the best authorized deal (lowest current_price)
    best_price = min(authorized_prices, key=lambda p: p.current_price)

    # Calculate developer net payout
    dev_cut_pct = best_price.developer_cut_pct or Decimal("70.00")
    dev_net_payout = (best_price.current_price * (dev_cut_pct / Decimal("100.00"))).quantize(Decimal("0.01"))

    # Historical Low Telemetry
    hist_low = game.historical_low
    lowest_recorded = hist_low.lowest_price if hist_low else best_price.current_price
    is_atl = best_price.current_price < lowest_recorded
    matches_atl = best_price.current_price == lowest_recorded
    margin_below = max(Decimal("0.00"), lowest_recorded - best_price.current_price)

    # Deceptive Discount / MSRP Inflation Detection
    baseline_msrp = game.historical_baseline_msrp
    msrp_elevation = max(Decimal("0.00"), best_price.original_msrp - baseline_msrp)
    is_deceptive = msrp_elevation > (baseline_msrp * Decimal("0.05"))

    # True discount calibrated against baseline
    if baseline_msrp > 0:
        true_discount_pct = max(0, int(((baseline_msrp - best_price.current_price) / baseline_msrp) * 100))
    else:
        true_discount_pct = best_price.discount_pct

    # Predictive Recommendation Signal
    if is_atl:
        recommendation = "BUY_NOW"
        rec_reason = f"New Record All-Time Low: Beats historical floor of ${lowest_recorded} by ${margin_below}."
    elif matches_atl:
        recommendation = "BUY_NOW"
        rec_reason = f"Matches Historical Record Floor: At parity with all-time low of ${lowest_recorded}."
    elif true_discount_pct >= 50:
        recommendation = "BUY_NOW"
        rec_reason = f"Deep promotional discount of {true_discount_pct}% on verified storefront."
    else:
        recommendation = "FAIR_VALUE"
        rec_reason = f"Standard promotional pricing ({true_discount_pct}% off). Steady-state market value."

    # Construct schema object
    response_data = LowestPriceResponse(
        game_id=str(game.id),
        game_slug=game.slug,
        title=game.title,
        currency="USD",
        canonical_msrp=game.base_msrp,
        best_authorized_deal=StoreDealSchema(
            store_slug=best_price.store_slug,
            store_name=best_price.store_name,
            current_price=best_price.current_price,
            original_msrp=best_price.original_msrp,
            discount_pct=best_price.discount_pct,
            is_authorized_store=best_price.is_authorized_store,
            developer_cut_pct=dev_cut_pct,
            developer_net_payout=dev_net_payout,
            voucher_code=best_price.voucher_code,
            affiliate_url=best_price.affiliate_url,
            last_scraped_at=best_price.last_scraped_at,
        ),
        historical_low_telemetry=HistoricalLowInfo(
            historical_lowest_price=lowest_recorded,
            is_all_time_low=is_atl,
            matches_all_time_low=matches_atl,
            margin_below_previous_atl=margin_below,
            recorded_store_name=hist_low.recorded_store_name if hist_low else best_price.store_name,
            recorded_at=hist_low.recorded_at if hist_low else best_price.last_scraped_at,
        ),
        market_analysis=MarketAnalysisInfo(
            is_deceptive_discount=is_deceptive,
            msrp_elevation_delta=msrp_elevation,
            true_discount_percentage=true_discount_pct,
            purchase_recommendation=recommendation,
            recommendation_reason=rec_reason,
        ),
        cached_at=datetime.now(timezone.utc),
        cache_status="MISS",
    )

    # 3. Prime Redis Cache for 15 minutes (900 seconds)
    dict_to_cache = response_data.model_dump(mode="json")
    await set_cached_json(
        cache_key,
        dict_to_cache,
        ttl_seconds=settings.LOWEST_PRICE_CACHE_TTL_SECONDS,
    )

    response.headers["X-Cache"] = "MISS"
    response.headers["Cache-Control"] = f"public, max-age={settings.LOWEST_PRICE_CACHE_TTL_SECONDS}"
    return response
