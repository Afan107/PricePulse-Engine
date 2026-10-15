import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  TrendingDown,
  Calendar,
  Clock,
  Sparkles,
  Scale,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { HistoricalPricingTrendAnalysis, HistoricalSaleEvent } from '../types/historicalPricing';

interface HistoricalPriceTrendChartProps {
  trendAnalysis: HistoricalPricingTrendAnalysis;
  showSaleEventsTable?: boolean;
}

export const HistoricalPriceTrendChart: React.FC<HistoricalPriceTrendChartProps> = ({
  trendAnalysis,
  showSaleEventsTable = true,
}) => {
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [activeMetricTab, setActiveMetricTab] = useState<'chart' | 'events' | 'omnibus'>('chart');

  const {
    gameTitle,
    currency,
    allTimeLowPrice,
    allTimeLowDate,
    allTimeLowStore,
    currentPrice,
    currentMsrp,
    stableBaselineMsrp,
    highestRecordedMsrp,
    totalSalesPastYear,
    averageSaleDiscountPct,
    maxHistoricalDiscountPct,
    averageDaysBetweenSales,
    daysSinceLastSale,
    omnibusCompliance,
    isDeceptiveDiscount,
    deceptiveExplanation,
    predictiveSignals,
    saleEvents,
    timeline,
  } = trendAnalysis;

  // Format currency
  const fmt = (val: number) => `$${val.toFixed(2)}`;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-700/80 p-3 rounded-xl shadow-2xl font-mono text-xs max-w-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">{data.displayDate}</span>
            <span className="text-[10px] text-slate-400">{data.date}</span>
          </div>

          {data.saleEventName && (
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>{data.saleEventName}</span>
            </div>
          )}

          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Effective Price:</span>
              <span className="text-emerald-300 font-bold text-sm">
                ${Number(data.actualPrice).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Recorded MSRP:</span>
              <span
                className={`${
                  data.isDeceptiveMSRPHike ? 'text-red-400 font-bold' : 'text-slate-300'
                }`}
              >
                ${Number(data.regularPrice).toFixed(2)}
              </span>
            </div>
            {data.discountPercentage > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Discount:</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
                  -{data.discountPercentage}%
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
              <span>Store:</span>
              <span className="text-slate-200">{data.store}</span>
            </div>
          </div>

          {data.isAtl && (
            <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-amber-300 font-bold flex items-center gap-1">
              <span>★ Recorded Historical Low</span>
            </div>
          )}

          {data.isDeceptiveMSRPHike && (
            <div className="pt-1 border-t border-red-900/60 text-[10px] text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>⚠️ Artificially Elevated MSRP</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              1-Year Pricing Trend (14 Months Ingested)
            </span>

            {isDeceptiveDiscount ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertTriangle className="w-3 h-3" />
                EU Omnibus 98/6 Violation: Inflated Baseline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                EU Omnibus 98/6 Compliant (Stable Baseline)
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>{gameTitle}</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              [365+ Day Historical Audit]
            </span>
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono self-start md:self-auto">
          <button
            onClick={() => setActiveMetricTab('chart')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeMetricTab === 'chart'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Price Curve & Chart
          </button>
          <button
            onClick={() => setActiveMetricTab('events')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeMetricTab === 'events'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sale Log ({totalSalesPastYear})
          </button>
          <button
            onClick={() => setActiveMetricTab('omnibus')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeMetricTab === 'omnibus'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Omnibus Audit
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards across 1-Year History */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* All-Time Low Record */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>1-Year Record Floor</span>
            <span className="text-amber-400 text-[10px] font-bold">ATL RECORD</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {fmt(allTimeLowPrice)}
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            {allTimeLowStore} • {allTimeLowDate}
          </div>
        </div>

        {/* 1-Year MSRP Range & Baseline */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Stable Base MSRP</span>
            <span
              className={`text-[10px] font-bold ${
                isDeceptiveDiscount ? 'text-red-400' : 'text-slate-400'
              }`}
            >
              {isDeceptiveDiscount ? 'SPIKED' : 'VERIFIED'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
            {fmt(stableBaselineMsrp)}
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            {isDeceptiveDiscount
              ? `Spiked to ${fmt(highestRecordedMsrp)} before promo`
              : `Constant over 365 days`}
          </div>
        </div>

        {/* Average Discount Depth */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Average Discount</span>
            <span className="text-emerald-400 text-[10px] font-bold">
              MAX -{maxHistoricalDiscountPct}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
            -{averageSaleDiscountPct}%
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            Across {totalSalesPastYear} recorded promotions
          </div>
        </div>

        {/* Promotional Cadence */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Promotion Cadence</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">
            ~{averageDaysBetweenSales} Days
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            Last ended {daysSinceLastSale}d ago
          </div>
        </div>
      </div>

      {/* Main Content Area based on active tab */}
      {activeMetricTab === 'chart' && (
        <div className="space-y-4">
          {/* Chart Header & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                <span className="text-slate-200">Effective Purchase Price</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-3 h-1 inline-block ${
                    isDeceptiveDiscount ? 'bg-red-400' : 'bg-slate-500'
                  }`}
                />
                <span className={isDeceptiveDiscount ? 'text-red-400' : 'text-slate-400'}>
                  {isDeceptiveDiscount ? 'Inflated Raw MSRP' : 'Catalog Base MSRP'}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-amber-400 inline-block" />
                <span className="text-amber-300">1-Year Floor ATL (${allTimeLowPrice.toFixed(2)})</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500">
              Interactive Tooltip: Hover data points
            </span>
          </div>

          {/* Recharts Area & Line Chart */}
          <div className="h-64 sm:h-72 w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 pt-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeline}
                margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

                <XAxis
                  dataKey="displayDate"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(val) => `$${val}`}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Reference line at All-Time Low */}
                <ReferenceLine
                  y={allTimeLowPrice}
                  stroke="#fbbf24"
                  strokeDasharray="4 4"
                  label={{
                    value: `ATL $${allTimeLowPrice.toFixed(2)}`,
                    fill: '#fbbf24',
                    fontSize: 9,
                    position: 'insideBottomRight',
                  }}
                />

                {/* MSRP Curve */}
                <Line
                  type="stepAfter"
                  dataKey="regularPrice"
                  stroke={isDeceptiveDiscount ? '#ef4444' : '#64748b'}
                  strokeWidth={2}
                  strokeDasharray={isDeceptiveDiscount ? '4 2' : undefined}
                  dot={false}
                  name="MSRP"
                />

                {/* Effective Sale Price Curve */}
                <Area
                  type="monotone"
                  dataKey="actualPrice"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  name="Purchase Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sale Events Log Table Tab */}
      {activeMetricTab === 'events' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Recorded Promotional Windows across 12+ Months ({saleEvents.length} events)
            </span>
            <span className="text-[11px] text-emerald-400">Chronological Archive</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Event Name</th>
                  <th className="py-2.5 px-3">Dates & Duration</th>
                  <th className="py-2.5 px-3">Store</th>
                  <th className="py-2.5 px-3">MSRP</th>
                  <th className="py-2.5 px-3">Sale Price</th>
                  <th className="py-2.5 px-3">Discount</th>
                  <th className="py-2.5 px-3 text-right">Integrity Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {saleEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    className={`hover:bg-slate-900/40 ${
                      ev.status === 'ACTIVE'
                        ? 'bg-emerald-500/5'
                        : ev.isMsrpElevated
                        ? 'bg-red-500/5'
                        : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{ev.eventName}</span>
                        {ev.status === 'ACTIVE' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            CURRENT
                          </span>
                        )}
                      </div>
                      {ev.notes && (
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5 max-w-xs">
                          {ev.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-slate-300">
                      <div>
                        {ev.startDate} → {ev.endDate}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {ev.durationDays} days duration
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-400">{ev.store}</td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`${
                          ev.isMsrpElevated ? 'text-red-400 font-bold line-through' : 'text-slate-400'
                        }`}
                      >
                        {fmt(ev.msrp)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {fmt(ev.salePrice)}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300">
                        -{ev.discountPercentage}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {ev.isMsrpElevated ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          ⚠️ Inflated MSRP
                        </span>
                      ) : ev.isAllTimeLowAtTime ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ★ Record Low
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                          Legit Promo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Omnibus Audit Tab */}
      {activeMetricTab === 'omnibus' && (
        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>EU Omnibus Directive 98/6/EC Article 6a Formal Audit</span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            European Union consumer protection regulations mandate that any price reduction announcement must indicate the prior price applied for a period of not less than 30 days prior to the application of the price reduction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">30-Day Window Examined</span>
              <span className="text-slate-200 font-bold">
                {omnibusCompliance.prior30DayWindowStart} → {omnibusCompliance.prior30DayWindowEnd}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Prior 30-Day Lowest Price</span>
              <span className="text-emerald-400 font-bold text-base">
                {fmt(omnibusCompliance.lowestPricePrior30Days)}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Claimed Base MSRP</span>
              <span
                className={`font-bold text-base ${
                  omnibusCompliance.isDeceptiveInflation ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {fmt(omnibusCompliance.currentClaimedMsrp)}
              </span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border mt-3 ${
              omnibusCompliance.isCompliantDirective986
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/30 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {omnibusCompliance.isCompliantDirective986 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold block">
                  {omnibusCompliance.isCompliantDirective986
                    ? 'PASSED: Compliant with Article 6a of Directive 98/6/EC'
                    : 'FAILED: Violation of Article 6a of Directive 98/6/EC'}
                </span>
                <p className="text-xs opacity-90 leading-relaxed">
                  {omnibusCompliance.directiveAuditExplanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictive Sale Signal & Recommendation Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-mono font-bold text-slate-100">
              Informed Predictive Sale Signals (1-Year Cadence Model)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Confidence Score:</span>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg font-mono text-xs">
              <span className="text-emerald-400 font-bold">
                {predictiveSignals.confidenceScore}%
              </span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${predictiveSignals.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Recommendation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono tracking-wider ${
                  predictiveSignals.recommendation === 'BUY_NOW'
                    ? 'bg-emerald-500 text-slate-950'
                    : predictiveSignals.recommendation === 'WAIT'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {predictiveSignals.recommendation}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {predictiveSignals.cadenceDescription}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed pt-1">
              {predictiveSignals.primaryReason}
            </p>
          </div>

          {/* Next Expected Sale Window Countdown Box */}
          <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-w-[220px] font-mono text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Next Expected Sale</span>
              <span className="text-cyan-400 font-bold">
                in {predictiveSignals.daysUntilNextSale} days
              </span>
            </div>
            <div className="font-bold text-white text-sm truncate">
              {predictiveSignals.nextExpectedEvent}
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1 text-slate-400">
              <span>Target Discount:</span>
              <span className="text-emerald-400 font-bold">
                ~{predictiveSignals.projectedDiscountPct}% ({fmt(predictiveSignals.projectedPrice)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
