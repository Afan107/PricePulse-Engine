import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  ExternalLink,
  Code,
  Copy,
  Check,
  TrendingDown,
  Info,
  Calendar,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ScamCheckResult, AffiliateSettings } from '../types/storefront';
import { analyzeGameDeal, PRESET_SCAM_TESTS } from '../services/cheapSharkService';
import { analyzeHistoricalPricingTrends, getPresetHistoricalGames } from '../services/historicalPriceService';
import { HistoricalPriceTrendChart } from './HistoricalPriceTrendChart';

interface ScamCheckerTabProps {
  initialQuery?: string;
  affiliateSettings: AffiliateSettings;
  onNavigateToDeals: () => void;
}

export const ScamCheckerTab: React.FC<ScamCheckerTabProps> = ({
  initialQuery = '',
  affiliateSettings,
  onNavigateToDeals,
}) => {
  const [query, setQuery] = useState<string>(initialQuery || 'ELDEN RING');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ScamCheckResult>(() => {
    const res = analyzeGameDeal(initialQuery || 'ELDEN RING');
    if (!res.historical_pricing) {
      res.historical_pricing = analyzeHistoricalPricingTrends(
        res.title,
        res.best_deal.current_price,
        res.original_msrp,
        res.best_deal.store
      );
    }
    return res;
  });
  const [activeSubTab, setActiveSubTab] = useState<'trends' | 'quotes' | 'json'>('trends');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const handleScan = (titleToScan?: string) => {
    const target = titleToScan || query;
    if (!target.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeGameDeal(target);
      if (!res.historical_pricing) {
        res.historical_pricing = analyzeHistoricalPricingTrends(
          res.title,
          res.best_deal.current_price,
          res.original_msrp,
          res.best_deal.store
        );
      }
      setResult(res);
      setAnalyzing(false);
    }, 250);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const isDeceptive = result.market_analysis.is_deceptive_discount;
  const recommendation = result.market_analysis.purchase_recommendation;

  const trendData = result.historical_pricing || analyzeHistoricalPricingTrends(
    result.title,
    result.best_deal.current_price,
    result.original_msrp,
    result.best_deal.store
  );

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>1-Year Historical Pricing & EU Omnibus 98/6/EC Audit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Fake Discount & Scam Checker
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Paste any PC game title, Steam link, or store URL. PricePulse stores and inspects 12+ months of historical price data, sale windows, and base MSRP stability to detect artificial markups and predict upcoming sale windows.
        </p>
      </div>

      {/* 1-Click Search & URL Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste game title or URL (e.g. Elden Ring, Dead Space, https://store.steampowered.com/app/1245620)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Auditing 1-Year History...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Audit 1-Year Price History</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Benchmark Test Cases */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-400">1-Click Historical Test Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery('ELDEN RING');
                handleScan('ELDEN RING');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono transition-colors"
            >
              ✓ Verified ATL: Elden Ring (-40%)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('Dark Tactics (Fake Discount)');
                handleScan('fake tactic');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-mono transition-colors"
            >
              ⚠️ Fake Discount Scam (+66% Markup)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('Dead Space (Remake)');
                handleScan('dead space');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono transition-colors"
            >
              ⏳ Seasonal Wait: Dead Space (13d to Scream Fest)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery("Baldur's Gate 3");
                handleScan("baldur's gate 3");
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono transition-colors"
            >
              🏆 Tied Record Floor: Baldur's Gate 3
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('Cyberpunk 2077: Phantom Liberty');
                handleScan('cyberpunk');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono transition-colors"
            >
              ℹ️ Fair Value: Cyberpunk (-20%)
            </button>
          </div>
        </div>
      </div>

      {/* Main Integrity & Recommendation Banner */}
      <div
        className={`rounded-2xl border p-6 shadow-xl transition-all ${
          isDeceptive
            ? 'bg-red-950/40 border-red-500/50 text-red-200'
            : recommendation === 'BUY_NOW'
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : recommendation === 'WAIT'
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            : 'bg-blue-950/40 border-blue-500/50 text-blue-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl border ${
                isDeceptive
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : recommendation === 'BUY_NOW'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : recommendation === 'WAIT'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
              }`}
            >
              {isDeceptive ? (
                <AlertTriangle className="w-8 h-8" />
              ) : recommendation === 'BUY_NOW' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : recommendation === 'WAIT' ? (
                <TrendingDown className="w-8 h-8" />
              ) : (
                <Info className="w-8 h-8" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                1-Year Historical Audit Verdict:
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {isDeceptive
                  ? '⚠️ DECEPTIVE DISCOUNT ALERT — ARTIFICIALLY INFLATED MSRP'
                  : recommendation === 'BUY_NOW'
                  ? '✅ 100% LEGITIMATE ALL-TIME LOW — SAFE TO BUY'
                  : recommendation === 'WAIT'
                  ? '⏳ PREDICTIVE SALE SIGNAL: WAIT FOR IMMINENT SEASONAL DROP'
                  : 'ℹ️ FAIR VALUE DISCOUNT — VERIFIED AUTHORIZED STORE'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {result.market_analysis.recommendation_reason}
              </p>
            </div>
          </div>

          {/* Recommendation Badge */}
          <div className="text-right sm:self-center shrink-0">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Recommendation
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-lg text-sm font-black font-mono tracking-wider ${
                recommendation === 'BUY_NOW'
                  ? 'bg-emerald-500 text-slate-950'
                  : recommendation === 'WAIT'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {recommendation}
            </span>
          </div>
        </div>

        {/* Warning Callout for Omnibus */}
        {result.market_analysis.omnibus_warning && (
          <div className="mt-4 p-3 rounded-xl bg-red-900/40 border border-red-700/50 flex items-start gap-2.5 text-xs text-red-300">
            <Scale className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div>
              <strong className="font-semibold block">Regulatory Non-Compliance Alert:</strong>
              {result.market_analysis.omnibus_warning}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs: [ 1-Year Price Trend Chart | All Store Quotes | JSON Schema ] */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeSubTab === 'trends'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>1-Year Historical Trend & Chart</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quotes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeSubTab === 'quotes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>All Store Quotes ({result.all_store_quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeSubTab === 'json'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Standardized B2B JSON</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Audit Model: v2026.4
        </span>
      </div>

      {/* Sub-Tab 1: 1-Year Historical Price Trend Chart & Cadence */}
      {activeSubTab === 'trends' && (
        <HistoricalPriceTrendChart trendAnalysis={trendData} showSaleEventsTable={true} />
      )}

      {/* Sub-Tab 2: All Store Quotes & Developer Cut */}
      {activeSubTab === 'quotes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-slate-100">
                All Store Quotes & Developer Royalty Breakdown
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Best Deal: {result.best_deal.store} (${result.best_deal.current_price.toFixed(2)})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Storefront</th>
                  <th className="py-2.5 px-4">Quoted Price</th>
                  <th className="py-2.5 px-4">Developer Royalty</th>
                  <th className="py-2.5 px-4">Legitimacy Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {result.all_store_quotes.map((quote, idx) => {
                  const isGrey = quote.cut_to_dev_pct === 0;
                  const isLowest = quote.price === result.best_deal.current_price;

                  return (
                    <tr
                      key={idx}
                      className={isLowest ? 'bg-emerald-500/5' : 'hover:bg-slate-800/40'}
                    >
                      <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                        {quote.store}
                        {isLowest && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Best
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-emerald-300 font-bold">
                        ${quote.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            quote.cut_to_dev_pct > 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {quote.cut_to_dev_pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isGrey ? (
                          <span className="text-red-400 flex items-center gap-1 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Unauthorized Grey Reseller
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Authorized Distributor
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={onNavigateToDeals}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                        >
                          View Deals
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Standardized B2B JSON Schema */}
      {activeSubTab === 'json' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Normalized JSON Payload (Strict B2B Schema with 1-Year Historical Pricing):
            </span>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-mono"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/80 p-3 rounded-lg overflow-x-auto border border-slate-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
