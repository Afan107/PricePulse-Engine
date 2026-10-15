from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class StoreDealSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    store_slug: str
    store_name: str
    current_price: Decimal
    original_msrp: Decimal
    discount_pct: int
    is_authorized_store: bool
    developer_cut_pct: Decimal
    developer_net_payout: Decimal
    voucher_code: Optional[str] = None
    affiliate_url: Optional[str] = None
    last_scraped_at: datetime


class HistoricalLowInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    historical_lowest_price: Decimal
    is_all_time_low: bool
    matches_all_time_low: bool
    margin_below_previous_atl: Decimal
    recorded_store_name: Optional[str] = None
    recorded_at: Optional[datetime] = None


class MarketAnalysisInfo(BaseModel):
    is_deceptive_discount: bool
    msrp_elevation_delta: Decimal
    true_discount_percentage: int
    purchase_recommendation: str  # "BUY_NOW" | "WAIT" | "FAIR_VALUE"
    recommendation_reason: str


class LowestPriceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    game_id: str
    game_slug: str
    title: str
    currency: str = "USD"
    canonical_msrp: Decimal
    best_authorized_deal: StoreDealSchema
    historical_low_telemetry: HistoricalLowInfo
    market_analysis: MarketAnalysisInfo
    cached_at: datetime
    cache_status: str = Field(default="MISS", description="'HIT' or 'MISS'")


class AllTimeLowRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    game_id: str
    game_slug: str
    title: str
    lowest_price: Decimal
    previous_lowest_price: Optional[Decimal] = None
    savings_vs_previous_atl: Decimal
    recorded_store_name: str
    recorded_store_slug: str
    recorded_at: datetime
    is_active: bool


class AllTimeLowsResponse(BaseModel):
    count: int
    timestamp: datetime
    deals: List[AllTimeLowRecord]


class RateLimitExceededResponse(BaseModel):
    detail: str = "Rate limit exceeded"
    tier: str
    monthly_limit: int
    current_usage: int
    retry_after_seconds: int
    reset_at: datetime
