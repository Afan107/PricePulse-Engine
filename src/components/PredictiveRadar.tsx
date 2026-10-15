import React, { useState } from 'react';
import { SEASONAL_SALE_CALENDAR } from '../services/normalizer';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingDown,
  HelpCircle,
  BarChart3,
  Scale,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { analyzeHistoricalPricingTrends, getPresetHistoricalGames } from '../services/historicalPriceService';
import { HistoricalPriceTrendChart } from './HistoricalPriceTrendChart';

export const PredictiveRadar: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('elden-ring');
  const [testDiscount, setTestDiscount] = useState<number>(20);
  const [testIsAtl, setTestIsAtl] = useState<boolean>(false);
  const [testDaysToSale, setTestDaysToSale] = useState<number>(18);
  const [testAuthorized, setTestAuthorized] = useState<boolean>(true);

  const presetGames = getPresetHistoricalGames();

  // Load trend analysis for selected game
  const trendAnalysis = analyzeHistoricalPricingTrends(selectedGameId);

  // Live simulation of predictive engine decision
  let computedSignal: 'BUY_NOW' | 'WAIT' | 'FAIR_VALUE' = 'FAIR_VALUE';
  let computedReason = '';

  if (!testAuthorized) {
    computedSignal = 'WAIT';
    computedReason = 'UNAUTHORIZED GREY-MARKET RETAILER: Zero developer royalty and high revocation hazard. Excluded from best-deal index.';
  } else if (testIsAtl) {
    computedSignal = 'BUY_NOW';
    computedReason = 'MATCHES OR BREAKS ALL-TIME LOW: Current price touches or breaks the 1-year historical price floor. Immediate buy signal.';
  } else if (testDiscount >= 50) {
    computedSignal = 'BUY_NOW';
    computedReason = `DEEP DISCOUNT THRESHOLD: True discount is ${testDiscount}%, crossing the 50% critical buy threshold.`;
  } else if (testDaysToSale <= 30 && testDiscount < 30) {
    computedSignal = 'WAIT';
    computedReason = `SEASONAL SALE WITHIN ${testDaysToSale} DAYS: Major seasonal storefront event is imminent (<30 days), and current discount (${testDiscount}%) is sub-optimal (<30%). Wait for seasonal festival.`;
  } else {
    computedSignal = 'FAIR_VALUE';
    computedReason = `FAIR MARKET VALUE: Current ${testDiscount}% discount reflects normal promotional cadence. No imminent seasonal drop expected to significantly beat this rate.`;
  }

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-mono font-semibold text-slate-100">
            Predictive Sale Signals & 1-Year Historical Pricing Trend Radar
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          The engine stores and analyzes 12+ months of historical price data, sale windows (start/end dates), discount depths, and base MSRP stability to accurately flag deceptive markups and trigger deterministic signals: <strong className="text-emerald-300">BUY_NOW</strong>, <strong className="text-amber-300">WAIT</strong>, or <strong className="text-blue-300">FAIR_VALUE</strong>.
        </p>
      </div>

      {/* 1-Year Historical Pricing Trend Analysis Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-200">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Select Game for 1-Year Pricing Trend & Cadence Analysis:</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Current Dataset: 14 Months Continuous Telemetry
          </span>
        </div>

        {/* Game Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {presetGames.map((game) => {
            const isSelected = selectedGameId === game.id;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md shadow-emerald-950'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>{game.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border ${
                    isSelected
                      ? 'bg-emerald-900/40 text-emerald-200 border-emerald-400/40'
                      : game.badgeColor
                  }`}
                >
                  {game.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 1-Year Historical Price Trend Chart for Selected Game */}
        <HistoricalPriceTrendChart trendAnalysis={trendAnalysis} showSaleEventsTable={true} />
      </div>

      {/* Seasonal Sale Calendar Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Storefront Seasonal Event Cadence (Oct–Dec 2026)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Reference Clock: 2026-10-15
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SEASONAL_SALE_CALENDAR.map((sale) => {
            const isImminent = sale.days_until_start <= 30;
            return (
              <div
                key={sale.event_name}
                className={`p-3.5 rounded-lg border font-mono text-xs flex flex-col justify-between ${
                  isImminent
                    ? 'bg-amber-950/20 border-amber-800/80 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400">
                      {sale.platform}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isImminent
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {sale.days_until_start} DAYS OUT
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm mb-1">
                    {sale.event_name}
                  </h3>

                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Start:</span>
                      <span className="text-slate-300">{sale.expected_start_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Known Countdown:</span>
                      <span className="text-cyan-400 font-mono">{sale.known_seconds_until_start.toLocaleString()} sec</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hist. Avg Discount:</span>
                      <strong className="text-emerald-400">{sale.historical_avg_discount}%</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px]">
                  {isImminent ? (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Triggers &quot;WAIT&quot; if discount &lt; 30%
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Window &gt; 30 days (Non-blocking)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Rules Matrix Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Predictive Decision Tree Playground</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Test custom signal parameters
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>True Discount Percentage:</span>
                <strong className="text-emerald-400 text-sm">{testDiscount}%</strong>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={testDiscount}
                onChange={(e) => setTestDiscount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0%</span>
                <span>30% (Threshold)</span>
                <span>50% (Auto-Buy)</span>
                <span>90%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Days Until Next Major Storefront Sale:</span>
                <strong className="text-cyan-400 text-sm">{testDaysToSale} days</strong>
              </div>
              <input
                type="range"
                min={1}
                max={90}
                step={1}
                value={testDaysToSale}
                onChange={(e) => setTestDaysToSale(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>1 day</span>
                <span>30 days (Rule cutoff)</span>
                <span>90 days</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testIsAtl}
                  onChange={(e) => setTestIsAtl(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300 text-xs">Matches or Beats Historical All-Time Low (ATL)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testAuthorized}
                  onChange={(e) => setTestAuthorized(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300 text-xs">Authorized Distributor (Not Grey Market)</span>
              </label>
            </div>
          </div>

          {/* Decision Outcome */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                Pipeline Decision Output
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded uppercase tracking-wider ${
                    computedSignal === 'BUY_NOW'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : computedSignal === 'WAIT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {computedSignal}
                </span>
                <span className="text-[11px] text-slate-400">
                  Confidence Score: 0.94
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300 text-xs leading-relaxed">
                {computedReason}
              </div>
            </div>

            {/* Pipeline Rule Checklist */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${testAuthorized ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>Authorized Store Verified (Rule 2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${testIsAtl ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>ATL Floor Matched or Broken (Rule 3)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${testDaysToSale > 30 || testDiscount >= 30 ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>Upcoming Sale Window Safe or Discount &ge; 30% (Rule 4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
