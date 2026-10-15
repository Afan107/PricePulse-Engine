import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  AlertCircle,
  FileCode,
  Flame
} from 'lucide-react';

interface SimulatedResponse {
  status: number;
  statusText: string;
  latencyMs: number;
  cacheHeader: 'HIT' | 'MISS';
  rateLimitHeaders: {
    limit: number;
    remaining: number;
    tier: string;
    retryAfter?: number;
  };
  body: unknown;
}

const PYTHON_SNIPPETS = {
  models: `# app/models.py - SQLAlchemy 2.0 Async Models
from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional
import uuid
from sqlalchemy import String, Numeric, Integer, Boolean, DateTime, Date, ForeignKey, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Game(Base):
    __tablename__ = "games"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    base_msrp: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    historical_baseline_msrp: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    release_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    store_prices: Mapped[List["StorePrice"]] = relationship("StorePrice", back_populates="game", cascade="all, delete-orphan", lazy="selectin")
    historical_low: Mapped[Optional["HistoricalLow"]] = relationship("HistoricalLow", back_populates="game", uselist=False, cascade="all, delete-orphan", lazy="joined")

class StorePrice(Base):
    __tablename__ = "store_prices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), nullable=False, index=True)
    store_slug: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    store_name: Mapped[str] = mapped_column(String(100), nullable=False)
    current_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, index=True)
    original_msrp: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount_pct: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_authorized_store: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    developer_cut_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=Decimal("70.00"))
    voucher_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    affiliate_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    last_scraped_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    game: Mapped["Game"] = relationship("Game", back_populates="store_prices")
    __table_args__ = (Index("ix_store_prices_game_auth_price", "game_id", "is_authorized_store", "current_price"),)

class HistoricalLow(Base):
    __tablename__ = "historical_lows"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    lowest_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, index=True)
    previous_lowest_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    recorded_store_slug: Mapped[str] = mapped_column(String(50), nullable=False)
    recorded_store_name: Mapped[str] = mapped_column(String(100), nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    is_active_all_time_low: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    game: Mapped["Game"] = relationship("Game", back_populates="historical_low")`,

  middleware: `# app/middleware.py - ApiKeyMeteringMiddleware
from datetime import datetime, timezone
import calendar
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from app.cache import get_redis
from app.config import settings

class ApiKeyMeteringMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.url.path in {"/health", "/docs", "/redoc", "/openapi.json"}:
            return await call_next(request)

        api_key = request.headers.get("x-api-key")
        if not api_key:
            return JSONResponse(status_code=401, content={"error": "Missing required 'X-API-Key' header"})

        redis = await get_redis()
        is_active = await redis.sismember(settings.REDIS_ACTIVE_KEYS_SET, api_key.strip())
        if not is_active:
            return JSONResponse(status_code=401, content={"error": "Invalid or revoked API key"})

        tier = await redis.get(f"{settings.REDIS_KEY_TIER_HASH_PREFIX}{api_key}") or "hobby"
        monthly_limit = settings.RATE_LIMIT_COMMERCIAL_MONTHLY if tier == "commercial" else settings.RATE_LIMIT_HOBBY_MONTHLY

        now = datetime.now(timezone.utc)
        meter_key = f"{settings.REDIS_METER_KEY_PREFIX}{api_key}:{now.strftime('%Y-%m')}"
        current_usage = await redis.incr(meter_key)
        
        if current_usage == 1:
            last_day = calendar.monthrange(now.year, now.month)[1]
            end_of_month = datetime(now.year, now.month, last_day, 23, 59, 59, tzinfo=timezone.utc)
            await redis.expire(meter_key, int((end_of_month - now).total_seconds()) + 432000)

        remaining = max(0, monthly_limit - current_usage)
        if current_usage > monthly_limit:
            return JSONResponse(
                status_code=429,
                content={"error": "TOO_MANY_REQUESTS", "detail": f"Monthly limit of {monthly_limit:,} exceeded for {tier}"},
                headers={"Retry-After": "1814400", "X-RateLimit-Limit": str(monthly_limit), "X-RateLimit-Remaining": "0", "X-RateLimit-Tier": tier}
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(monthly_limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Tier"] = tier
        return response`,

  endpoint: `# app/routers/games.py - Lowest Price with 15-min Redis Cache
@router.get("/{slug}/lowest-price", response_model=LowestPriceResponse)
async def get_game_lowest_price(slug: str, response: Response, db: AsyncSession = Depends(get_db)):
    cache_key = f"cache:lowest_price:{slug.lower().strip()}"
    
    # 1. Sub-5ms Redis Cache Lookup
    cached_payload = await get_cached_json(cache_key)
    if cached_payload:
        response.headers["X-Cache"] = "HIT"
        response.headers["Cache-Control"] = "public, max-age=900"
        cached_payload["cache_status"] = "HIT"
        return LowestPriceResponse.model_validate(cached_payload)

    # 2. Cache Miss: Query PostgreSQL
    stmt = (
        select(Game)
        .where(Game.slug == slug.lower().strip())
        .options(selectinload(Game.store_prices), selectinload(Game.historical_low))
    )
    result = await db.execute(stmt)
    game = result.scalar_one_or_none()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Filter to authorized retailers (exclude grey market)
    authorized = [p for p in game.store_prices if p.is_authorized_store]
    best_price = min(authorized, key=lambda p: p.current_price)

    # Build validated schema & prime Redis for 15 minutes (900 seconds)
    response_data = build_response(game, best_price)
    await set_cached_json(cache_key, response_data.model_dump(mode="json"), ttl_seconds=900)

    response.headers["X-Cache"] = "MISS"
    response.headers["Cache-Control"] = "public, max-age=900"
    return response_data`,
};

export const FastApiExplorer: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('pk_hobby_user123');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/v1/games/baldurs-gate-3/lowest-price');
  const [codeTab, setCodeTab] = useState<'endpoint' | 'middleware' | 'models'>('endpoint');
  const [copied, setCopied] = useState<boolean>(false);

  // Simulated Redis cache state for games
  const [redisCache, setRedisCache] = useState<Record<string, { data: unknown; expiresAt: number }>>({});
  // Simulated monthly usage counters in Redis
  const [usageCounters, setUsageCounters] = useState<Record<string, number>>({
    pk_hobby_user123: 1420,
    pk_comm_enterprise99: 89400,
  });

  const [simResponse, setSimResponse] = useState<SimulatedResponse | null>(null);

  const getTier = (key: string) => (key.includes('comm') ? 'commercial' : 'hobby');
  const getLimit = (tier: string) => (tier === 'commercial' ? 250000 : 25000);

  const handleExecuteRequest = () => {
    const key = selectedKey.trim();
    const activeKeys = ['pk_hobby_user123', 'pk_comm_enterprise99', 'pk_hobby_demo'];

    // 1. Check API Key validity in Redis set 'active_keys'
    if (!key) {
      setSimResponse({
        status: 401,
        statusText: 'Unauthorized',
        latencyMs: 0.42,
        cacheHeader: 'MISS',
        rateLimitHeaders: { limit: 0, remaining: 0, tier: 'unknown' },
        body: { error: 'UNAUTHORIZED', detail: "Missing required 'X-API-Key' header in request." },
      });
      return;
    }

    if (!activeKeys.includes(key)) {
      setSimResponse({
        status: 401,
        statusText: 'Unauthorized',
        latencyMs: 0.65,
        cacheHeader: 'MISS',
        rateLimitHeaders: { limit: 0, remaining: 0, tier: 'unknown' },
        body: { error: 'UNAUTHORIZED', detail: 'Invalid, expired, or revoked API key provided.' },
      });
      return;
    }

    // 2. Check Metering / Rate-Limit
    const tier = getTier(key);
    const limit = getLimit(tier);
    const currentUsage = (usageCounters[key] || 0) + 1;

    setUsageCounters((prev) => ({
      ...prev,
      [key]: currentUsage,
    }));

    if (currentUsage > limit) {
      setSimResponse({
        status: 429,
        statusText: 'Too Many Requests',
        latencyMs: 1.15,
        cacheHeader: 'MISS',
        rateLimitHeaders: {
          limit,
          remaining: 0,
          tier,
          retryAfter: 1814400,
        },
        body: {
          error: 'TOO_MANY_REQUESTS',
          detail: `Monthly quota of ${limit.toLocaleString()} requests for tier '${tier}' has been exceeded.`,
          code: 'MONTHLY_QUOTA_EXCEEDED',
          tier,
          monthly_limit: limit,
          current_usage: currentUsage,
          retry_after_seconds: 1814400,
        },
      });
      return;
    }

    // 3. Check Cache
    const cacheKey = `cache:${selectedEndpoint}`;
    const cachedItem = redisCache[cacheKey];
    const isCacheHit = cachedItem && cachedItem.expiresAt > Date.now();

    if (isCacheHit) {
      // Sub-2ms Redis cache hit!
      setSimResponse({
        status: 200,
        statusText: 'OK',
        latencyMs: 0.85,
        cacheHeader: 'HIT',
        rateLimitHeaders: {
          limit,
          remaining: limit - currentUsage,
          tier,
        },
        body: {
          ...((cachedItem.data as Record<string, unknown>) || {}),
          cache_status: 'HIT',
          cached_at: new Date().toISOString(),
        },
      });
      return;
    }

    // 4. Cache Miss: Execute DB Query Simulation (latency ~14.2ms)
    let generatedData: unknown = null;
    if (selectedEndpoint.includes('baldurs-gate-3')) {
      generatedData = {
        game_id: 'a89f92e1-4b11-4822-b519-79308191cb20',
        game_slug: 'baldurs-gate-3',
        title: "Baldur's Gate 3",
        currency: 'USD',
        canonical_msrp: 59.99,
        best_authorized_deal: {
          store_slug: 'gog',
          store_name: 'GOG.com',
          current_price: 34.99,
          original_msrp: 59.99,
          discount_pct: 42,
          is_authorized_store: true,
          developer_cut_pct: 70.0,
          developer_net_payout: 24.49,
          voucher_code: null,
          last_scraped_at: new Date().toISOString(),
        },
        historical_low_telemetry: {
          historical_lowest_price: 34.99,
          is_all_time_low: false,
          matches_all_time_low: true,
          margin_below_previous_atl: 0.0,
          recorded_store_name: 'GOG.com',
        },
        market_analysis: {
          is_deceptive_discount: false,
          true_discount_percentage: 42,
          purchase_recommendation: 'BUY_NOW',
          recommendation_reason: 'Matches Historical Record Floor: At parity with all-time low of $34.99.',
        },
        cached_at: new Date().toISOString(),
        cache_status: 'MISS',
      };
    } else if (selectedEndpoint.includes('cyberpunk-2077')) {
      generatedData = {
        game_id: 'c22d1109-7711-4fa2-8b01-0940182811a4',
        game_slug: 'cyberpunk-2077',
        title: 'Cyberpunk 2077',
        currency: 'USD',
        canonical_msrp: 59.99,
        best_authorized_deal: {
          store_slug: 'epic_games',
          store_name: 'Epic Games Store',
          current_price: 29.99,
          original_msrp: 59.99,
          discount_pct: 50,
          is_authorized_store: true,
          developer_cut_pct: 88.0,
          developer_net_payout: 26.39,
          voucher_code: 'EPIC_FALL',
          last_scraped_at: new Date().toISOString(),
        },
        historical_low_telemetry: {
          historical_lowest_price: 23.99,
          is_all_time_low: false,
          matches_all_time_low: false,
          margin_below_previous_atl: 0.0,
          recorded_store_name: 'Steam',
        },
        market_analysis: {
          is_deceptive_discount: false,
          true_discount_percentage: 50,
          purchase_recommendation: 'BUY_NOW',
          recommendation_reason: 'Deep promotional discount of 50% on verified storefront with 88% dev royalty.',
        },
        cached_at: new Date().toISOString(),
        cache_status: 'MISS',
      };
    } else {
      // ATL Feed
      generatedData = {
        count: 3,
        timestamp: new Date().toISOString(),
        deals: [
          {
            game_id: 'a89f92e1-4b11-4822-b519-79308191cb20',
            game_slug: 'baldurs-gate-3',
            title: "Baldur's Gate 3",
            lowest_price: 34.99,
            previous_lowest_price: 39.99,
            savings_vs_previous_atl: 5.0,
            recorded_store_name: 'GOG.com',
            recorded_store_slug: 'gog',
            recorded_at: new Date().toISOString(),
            is_active: true,
          },
          {
            game_id: 'c22d1109-7711-4fa2-8b01-0940182811a4',
            game_slug: 'cyberpunk-2077',
            title: 'Cyberpunk 2077',
            lowest_price: 23.99,
            previous_lowest_price: 29.99,
            savings_vs_previous_atl: 6.0,
            recorded_store_name: 'Steam',
            recorded_store_slug: 'steam',
            recorded_at: new Date().toISOString(),
            is_active: true,
          },
        ],
      };
    }

    // Save in simulated Redis cache for 15 minutes (900,000 ms)
    setRedisCache((prev) => ({
      ...prev,
      [cacheKey]: {
        data: generatedData,
        expiresAt: Date.now() + 900000,
      },
    }));

    setSimResponse({
      status: 200,
      statusText: 'OK',
      latencyMs: 14.8,
      cacheHeader: 'MISS',
      rateLimitHeaders: {
        limit,
        remaining: limit - currentUsage,
        tier,
      },
      body: generatedData,
    });
  };

  const handleSimulateQuotaExceeded = () => {
    const key = selectedKey.trim();
    const tier = getTier(key);
    const limit = getLimit(tier);
    setUsageCounters((prev) => ({
      ...prev,
      [key]: limit + 1,
    }));
    handleExecuteRequest();
  };

  const handleClearCache = () => {
    setRedisCache({});
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PYTHON_SNIPPETS[codeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Server className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-mono font-semibold text-slate-100">
            FastAPI Microservice, Redis Cache &amp; Metering Simulator
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          This microservice implements <strong className="text-slate-200">async Redis sub-5ms caching (15-min TTL)</strong>, <strong className="text-slate-200">API-key authentication against active_keys set</strong>, and <strong className="text-slate-200">monthly rate limiting (Hobby 25k, Commercial 250k)</strong> with automatic HTTP 429 throttling.
        </p>

        {/* System Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">Redis Cache (&lt; 2ms)</div>
              <div className="text-[11px] text-slate-400">Key: <code className="text-emerald-400">cache:lowest_price:&#123;slug&#125;</code> (TTL: 900s)</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">API Key Middleware</div>
              <div className="text-[11px] text-slate-400"><code className="text-cyan-400">SISMEMBER active_keys</code> &amp; tiered quotas</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">SQLAlchemy 2.0 Async</div>
              <div className="text-[11px] text-slate-400">Games, StorePrices, HistoricalLows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive API Test Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request Configurator */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive API Request Builder</span>
            </span>
            <button
              onClick={handleClearCache}
              title="Flush simulated Redis cache"
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 p-1 bg-slate-950 rounded border border-slate-800"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Flush Cache</span>
            </button>
          </div>

          {/* Endpoint Selector */}
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Target Endpoint:</label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="/v1/games/baldurs-gate-3/lowest-price">
                GET /v1/games/baldurs-gate-3/lowest-price (Cached 15m)
              </option>
              <option value="/v1/games/cyberpunk-2077/lowest-price">
                GET /v1/games/cyberpunk-2077/lowest-price (Cached 15m)
              </option>
              <option value="/v1/deals/all-time-lows?limit=20">
                GET /v1/deals/all-time-lows?limit=20 (Real-time feed)
              </option>
            </select>
          </div>

          {/* X-API-Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 text-[11px]">Header: x-api-key</label>
              <span className="text-[10px] text-cyan-400">
                Tier: {getTier(selectedKey).toUpperCase()} ({getLimit(getTier(selectedKey)).toLocaleString()} req/mo)
              </span>
            </div>
            <input
              type="text"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. pk_hobby_user123"
            />
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
              <span>Presets:</span>
              <button
                onClick={() => setSelectedKey('pk_hobby_user123')}
                className="underline hover:text-emerald-400"
              >
                Hobby Key (25k)
              </button>
              <span>·</span>
              <button
                onClick={() => setSelectedKey('pk_comm_enterprise99')}
                className="underline hover:text-cyan-400"
              >
                Commercial Key (250k)
              </button>
              <span>·</span>
              <button
                onClick={() => setSelectedKey('revoked_invalid_999')}
                className="underline hover:text-rose-400"
              >
                Invalid Key (401)
              </button>
            </div>
          </div>

          {/* Current Rate-Limit Meter Bar */}
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Monthly Meter Counter (Redis INCR):</span>
              <strong className="text-slate-200">
                {(usageCounters[selectedKey] || 0).toLocaleString()} / {getLimit(getTier(selectedKey)).toLocaleString()}
              </strong>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  (usageCounters[selectedKey] || 0) > getLimit(getTier(selectedKey))
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(100, (((usageCounters[selectedKey] || 0) / getLimit(getTier(selectedKey))) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleExecuteRequest}
              className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Send Request (Execute)</span>
            </button>

            <button
              onClick={handleSimulateQuotaExceeded}
              className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/40 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Rate Limit Exceeded (HTTP 429)</span>
            </button>
          </div>
        </div>

        {/* Right: Response Telemetry & JSON */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col font-mono text-xs">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-slate-200">FastAPI HTTP Response Telemetry</span>
            {simResponse && (
              <div className="flex items-center gap-2 text-[10px]">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    simResponse.status === 200
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : simResponse.status === 429
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  HTTP {simResponse.status} {simResponse.statusText}
                </span>

                <span
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    simResponse.cacheHeader === 'HIT'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  X-Cache: {simResponse.cacheHeader}
                </span>

                <span className="text-yellow-400 font-bold">
                  ⚡ {simResponse.latencyMs} ms
                </span>
              </div>
            )}
          </div>

          {/* Response Headers Strip */}
          {simResponse && (
            <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400">
              <div>
                <span>X-RateLimit-Limit:</span>{' '}
                <strong className="text-slate-200">{simResponse.rateLimitHeaders.limit}</strong>
              </div>
              <div>
                <span>X-RateLimit-Remaining:</span>{' '}
                <strong className="text-slate-200">{simResponse.rateLimitHeaders.remaining}</strong>
              </div>
              <div>
                <span>X-RateLimit-Tier:</span>{' '}
                <strong className="text-cyan-400">{simResponse.rateLimitHeaders.tier}</strong>
              </div>
              <div>
                <span>Cache-Control:</span>{' '}
                <strong className="text-slate-300">max-age=900</strong>
              </div>
            </div>
          )}

          {/* JSON Body */}
          <div className="p-3 bg-slate-950 flex-1 overflow-x-auto min-h-[280px] max-h-[360px]">
            {simResponse ? (
              <pre className="text-slate-200 text-[11px] leading-relaxed">
                {JSON.stringify(simResponse.body, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                <Clock className="w-8 h-8 text-slate-700 mb-2" />
                <span>Click &quot;Send Request&quot; to test the microservice</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Python Code Viewer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Production Code Files (/fastapi_service)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5 text-xs">
              <button
                onClick={() => setCodeTab('endpoint')}
                className={`px-2.5 py-1 rounded ${codeTab === 'endpoint' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                app/routers/games.py
              </button>
              <button
                onClick={() => setCodeTab('middleware')}
                className={`px-2.5 py-1 rounded ${codeTab === 'middleware' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                app/middleware.py
              </button>
              <button
                onClick={() => setCodeTab('models')}
                className={`px-2.5 py-1 rounded ${codeTab === 'models' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                app/models.py
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 overflow-x-auto max-h-[420px]">
          <pre className="text-slate-300 text-[11px] leading-relaxed">
            {PYTHON_SNIPPETS[codeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
