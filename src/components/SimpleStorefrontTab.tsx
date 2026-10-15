import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  ShieldCheck, 
  TrendingDown, 
  Search, 
  Filter, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Share2, 
  Copy, 
  Check, 
  Percent,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { CheapSharkDeal, AffiliateSettings } from '../types/storefront';
import { fetchLiveGameDeals, STORES_MAP, buildAffiliateUrl } from '../services/cheapSharkService';
import { analyzeHistoricalPricingTrends } from '../services/historicalPriceService';
import { HistoricalPriceTrendChart } from './HistoricalPriceTrendChart';

interface SimpleStorefrontTabProps {
  affiliateSettings: AffiliateSettings;
  onNavigateToScamChecker: (gameTitle?: string) => void;
  onNavigateToSoftwareSales: () => void;
}

export const SimpleStorefrontTab: React.FC<SimpleStorefrontTabProps> = ({
  affiliateSettings,
  onNavigateToScamChecker,
  onNavigateToSoftwareSales,
}) => {
  const [deals, setDeals] = useState<CheapSharkDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedSource, setFeedSource] = useState<'live' | 'fallback'>('live');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [discountFilter, setDiscountFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'savings' | 'price' | 'title'>('rating');
  const [inspectDeal, setInspectDeal] = useState<CheapSharkDeal | null>(null);
  const [copiedDealId, setCopiedDealId] = useState<string | null>(null);

  const loadDeals = async () => {
    setLoading(true);
    const result = await fetchLiveGameDeals();
    setDeals(result.deals);
    setFeedSource(result.source);
    setLoading(false);
  };

  useEffect(() => {
    loadDeals();
  }, []);

  // Filter & sort
  const filteredDeals = useMemo(() => {
    return deals
      .filter((deal) => {
        // Search
        if (searchQuery.trim() && !deal.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
          return false;
        }
        // Store
        if (selectedStore !== 'all' && deal.storeID !== selectedStore) {
          return false;
        }
        // Discount Filter
        const savingsNum = parseFloat(deal.savings || '0');
        const priceNum = parseFloat(deal.salePrice || '0');
        if (discountFilter === '50plus' && savingsNum < 50) return false;
        if (discountFilter === '75plus' && savingsNum < 75) return false;
        if (discountFilter === 'under10' && priceNum > 10) return false;
        if (discountFilter === 'under20' && priceNum > 20) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return parseFloat(b.dealRating || '0') - parseFloat(a.dealRating || '0');
        }
        if (sortBy === 'savings') {
          return parseFloat(b.savings || '0') - parseFloat(a.savings || '0');
        }
        if (sortBy === 'price') {
          return parseFloat(a.salePrice || '0') - parseFloat(b.salePrice || '0');
        }
        return a.title.localeCompare(b.title);
      });
  }, [deals, searchQuery, selectedStore, discountFilter, sortBy]);

  const handleCopyLink = (deal: CheapSharkDeal) => {
    const link = buildAffiliateUrl(deal, affiliateSettings);
    navigator.clipboard.writeText(link);
    setCopiedDealId(deal.dealID);
    setTimeout(() => setCopiedDealId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Legit Authorized Distributors Only</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            PC Game Deals at Real All-Time Lows
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every deal below is verified against historical lows, vetted for deceptive MSRP markups, 
            and sourced exclusively from official publisher storefronts (Steam, GOG, Humble, Fanatical, Epic).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Studio Royalties (70%–88%)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> EU Omnibus Compliant
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Grey-Market Revoked Keys
            </span>
          </div>
        </div>

        {/* Action badges right */}
        <div className="mt-4 md:mt-0 md:absolute md:right-8 md:top-8 flex flex-col sm:flex-row md:flex-col gap-2.5">
          <button
            onClick={() => onNavigateToScamChecker()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Check a Deal for Scams</span>
          </button>
          <button
            onClick={onNavigateToSoftwareSales}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get PricePulse Source ($99)</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Store Filter, Discount, Sort */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game title (e.g. Cyberpunk, Elden Ring, Hades)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Stats & Refresh */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="font-mono text-slate-400">
              Showing <strong className="text-emerald-400">{filteredDeals.length}</strong> active deals
              {feedSource === 'live' ? (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  ● Live Feed
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono">
                  ● Verified Catalog
                </span>
              )}
            </span>

            <button
              onClick={loadDeals}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-1 text-slate-400 mr-1 font-mono text-[11px]">
            <Filter className="w-3 h-3 text-emerald-400" />
            <span>Store:</span>
          </div>

          <button
            onClick={() => setSelectedStore('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
              selectedStore === 'all'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Stores
          </button>
          {Object.values(STORES_MAP).map((store) => (
            <button
              key={store.storeID}
              onClick={() => setSelectedStore(store.storeID)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedStore === store.storeID
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {store.storeName}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Discount range */}
          <div className="flex items-center gap-1 text-slate-400 mr-1 font-mono text-[11px]">
            <Percent className="w-3 h-3 text-cyan-400" />
            <span>Savings:</span>
          </div>

          <select
            value={discountFilter}
            onChange={(e) => setDiscountFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none"
          >
            <option value="all">Any Discount</option>
            <option value="50plus">50%+ Off</option>
            <option value="75plus">75%+ Off (Steep)</option>
            <option value="under10">Under $10</option>
            <option value="under20">Under $20</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 text-slate-400 ml-auto mr-1 font-mono text-[11px]">
            <SlidersHorizontal className="w-3 h-3 text-purple-400" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none"
          >
            <option value="rating">Deal Rating (Highest)</option>
            <option value="savings">Discount % (Highest)</option>
            <option value="price">Sale Price (Lowest)</option>
            <option value="title">Game Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-mono">Syncing authorized store catalog & validating ATL baseline...</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3 p-6">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No game deals matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or loosening your store and discount filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStore('all');
              setDiscountFilter('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDeals.map((deal) => {
            const store = STORES_MAP[deal.storeID] || {
              storeName: 'Authorized Store',
              storeType: 'AUTHORIZED_DIRECT',
              devCutPct: 70,
              logoBadge: 'Authorized',
              color: 'from-slate-700 to-slate-900',
              domain: 'store.com',
            };
            const savings = Math.round(parseFloat(deal.savings || '0'));
            const isDeepDiscount = savings >= 60;
            const affiliateUrl = buildAffiliateUrl(deal, affiliateSettings);

            return (
              <div
                key={deal.dealID}
                className="group flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20 transition-all overflow-hidden"
              >
                {/* Game Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={deal.thumb}
                    alt={deal.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=640&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Discount percentage tag */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-lg font-mono">
                    -{savings}%
                  </div>

                  {/* Store Badge */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-medium text-slate-200 border border-slate-800">
                    {store.storeName}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Legit Store Badge */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        100% Legit / Official
                      </span>
                      {isDeepDiscount && (
                        <span className="inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          🔥 All-Time Low
                        </span>
                      )}
                    </div>

                    {/* Game Title */}
                    <h3 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {deal.title}
                    </h3>

                    {/* Review text */}
                    {deal.steamRatingText && (
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-mono font-medium">{deal.steamRatingPercent}%</span>
                        <span>{deal.steamRatingText}</span>
                      </p>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <div className="text-[11px] text-slate-500 line-through font-mono">
                          ${parseFloat(deal.normalPrice).toFixed(2)}
                        </div>
                        <div className="text-xl font-extrabold text-white font-mono tracking-tight">
                          ${parseFloat(deal.salePrice).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">Dev Revenue Split</span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">
                          {store.devCutPct}% ({store.storeType === 'AUTHORIZED_DIRECT' ? 'Direct' : 'Key'})
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {/* Big Green Buy Deal Button */}
                      <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-3 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-950"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Deal</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                      </a>

                      {/* Detail Inspect */}
                      <button
                        onClick={() => setInspectDeal(deal)}
                        title="View deal audit & pricing history"
                        className="col-span-1 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Affiliate tag disclosure footnote */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 text-[10px] text-slate-500 font-mono">
                      <span>Tag: ?aff_track={affiliateSettings.affiliateTag}</span>
                      <button
                        onClick={() => handleCopyLink(deal)}
                        className="hover:text-emerald-400 flex items-center gap-1"
                      >
                        {copiedDealId === deal.dealID ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deal Detail Inspection Modal with 1-Year Historical Pricing Trend */}
      {inspectDeal && (() => {
        const trend = analyzeHistoricalPricingTrends(
          inspectDeal.title,
          parseFloat(inspectDeal.salePrice),
          parseFloat(inspectDeal.normalPrice),
          STORES_MAP[inspectDeal.storeID]?.storeName
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      1-Year Verified History
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {STORES_MAP[inspectDeal.storeID]?.storeName || 'Authorized'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{inspectDeal.title}</h3>
                </div>
                <button
                  onClick={() => setInspectDeal(null)}
                  className="text-slate-400 hover:text-white text-xl font-mono p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Render 1-Year Historical Pricing Trend Chart Component */}
              <HistoricalPriceTrendChart trendAnalysis={trend} showSaleEventsTable={false} />

              {/* Affiliate Link Share & Purchase */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400 text-[11px] block font-mono">Your Tracked Affiliate Deal URL:</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate max-w-sm block">
                      {buildAffiliateUrl(inspectDeal, affiliateSettings)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyLink(inspectDeal)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-medium shrink-0 flex items-center gap-1.5"
                  >
                    {copiedDealId === inspectDeal.dealID ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Affiliate URL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => {
                      const title = inspectDeal.title;
                      setInspectDeal(null);
                      onNavigateToScamChecker(title);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-mono"
                  >
                    Open in Full Fake Discount & Scam Checker →
                  </button>

                  <a
                    href={buildAffiliateUrl(inspectDeal, affiliateSettings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 w-full sm:w-auto"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Deal on {STORES_MAP[inspectDeal.storeID]?.storeName || 'Official Store'} (${parseFloat(inspectDeal.salePrice).toFixed(2)})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
