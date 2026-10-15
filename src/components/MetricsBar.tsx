import React, { useState } from 'react';
import { PipelineMetrics, NormalizedProductionPayload } from '../types/pipeline';
import { 
  ShieldAlert, 
  TrendingDown, 
  Ban, 
  Coins, 
  Zap,
  Layers,
  Download,
  Check,
  FileSpreadsheet
} from 'lucide-react';

interface MetricsBarProps {
  metrics: PipelineMetrics;
  streamRateStr: string;
  events?: NormalizedProductionPayload[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ 
  metrics, 
  streamRateStr,
  events = []
}) => {
  const [exported, setExported] = useState(false);

  const handleExportCsv = () => {
    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const now = new Date();
    const timestampStr = now.toISOString();

    const lines: string[] = [];

    // 1. METRICS SUMMARY SECTION
    lines.push('=== PRICEPULSE ENGINE - METRICS SUMMARY ===');
    lines.push(['Metric Name', 'Metric Value', 'Unit / Notes'].map(escapeCsv).join(','));
    lines.push(['Export Timestamp', timestampStr, 'ISO 8601 UTC'].map(escapeCsv).join(','));
    lines.push(['Total Scrapes Ingested', metrics.total_ingested, 'events'].map(escapeCsv).join(','));
    lines.push(['Total Successfully Normalized', metrics.total_normalized, 'events'].map(escapeCsv).join(','));
    lines.push(['Deceptive MSRP Frauds Flagged', metrics.deceptive_discounts_flagged, 'spikes detected'].map(escapeCsv).join(','));
    lines.push(['All-Time Low Records Discovered', metrics.all_time_lows_detected, 'record floors'].map(escapeCsv).join(','));
    lines.push(['Grey Market Resellers Quarantined', metrics.grey_market_blocked, 'stores blocked'].map(escapeCsv).join(','));
    lines.push(['Total Dev Revenue Protected (USD)', metrics.total_dev_revenue_protected_usd.toFixed(2), 'USD'].map(escapeCsv).join(','));
    lines.push(['Mean Pipeline Latency (ms)', metrics.avg_latency_ms.toFixed(3), 'milliseconds'].map(escapeCsv).join(','));
    lines.push(['Current Ingestion Rate', streamRateStr, 'events/sec'].map(escapeCsv).join(','));
    lines.push(''); // Blank separator

    // 2. RECENT EVENT LOGS TABLE
    lines.push('=== RECENT NORMALIZED EVENT LOGS ===');
    const headers = [
      'Record ID',
      'Processed At',
      'Game Title',
      'SKU',
      'Store Name',
      'Store Slug',
      'Store Category',
      'Is Authorized Store',
      'Original MSRP ($)',
      'Current Price ($)',
      'Currency',
      'Claimed Discount (%)',
      'True Discount (%)',
      'Is Deceptive Discount',
      'Historical Baseline MSRP ($)',
      'MSRP Elevation Delta ($)',
      'Developer Cut (%)',
      'Developer Net Payout ($)',
      'Is All-Time Low',
      'Matches All-Time Low',
      'Historical Lowest Price ($)',
      'Margin Below Previous ATL ($)',
      'Known Sec Status',
      'Known Sec Threat Score (0-100)',
      'Known Seconds Until Next Sale',
      'Predictive Recommendation',
      'Recommendation Reason',
      'Eligible For Best Deal',
      'Pipeline Latency (ms)'
    ];
    lines.push(headers.map(escapeCsv).join(','));

    // Populate rows
    events.forEach((ev) => {
      const row = [
        ev.record_id,
        ev.processed_at,
        ev.game_metadata.canonical_title,
        ev.game_metadata.normalized_sku,
        ev.store_integrity.store_name,
        ev.store_integrity.store_slug,
        ev.store_integrity.retailer_category,
        ev.store_integrity.is_authorized_store,
        ev.pricing.normalized_msrp.toFixed(2),
        ev.pricing.normalized_current_price.toFixed(2),
        ev.pricing.currency,
        ev.pricing.claimed_discount_percentage,
        ev.pricing.true_discount_percentage,
        ev.pricing.is_deceptive_discount,
        ev.pricing.historical_baseline_msrp.toFixed(2),
        ev.pricing.msrp_elevation_delta.toFixed(2),
        ev.store_integrity.developer_cut_percentage,
        ev.store_integrity.developer_net_payout.toFixed(2),
        ev.all_time_low.is_all_time_low,
        ev.all_time_low.matches_all_time_low,
        ev.all_time_low.lowest_recorded_history.toFixed(2),
        ev.all_time_low.margin_below_previous_atl.toFixed(2),
        ev.known_security?.security_status || 'PASSED',
        ev.known_security?.threat_score ?? 0,
        ev.predictive_analytics.next_sale_window.known_seconds_until_start,
        ev.predictive_analytics.recommendation,
        ev.predictive_analytics.primary_reason,
        ev.market_intelligence.eligible_for_best_deal,
        ev.pipeline_latency_ms.toFixed(3)
      ];
      lines.push(row.map(escapeCsv).join(','));
    });

    // Generate CSV Blob & Download Trigger
    const csvContent = lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateFormatted = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.setAttribute('download', `pricepulse_metrics_events_${dateFormatted}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="mb-6 space-y-2">
      {/* Top Action Header with Export CSV Button */}
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">
            Pipeline Telemetry &amp; Performance KPIs
          </span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Active Buffer: {events.length} event records loaded
          </span>
        </div>

        <button
          onClick={handleExportCsv}
          title="Export current metrics and recent event logs to CSV"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 hover:border-emerald-500/80 hover:bg-slate-800 text-slate-200 hover:text-emerald-300 transition-all shadow-sm group"
        >
          {exported ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">CSV Exported</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-bounce" />
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className="font-semibold">Export Metrics to CSV</span>
            </>
          )}
        </button>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Scrapes Ingested */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Ingested</span>
            <Layers className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {metrics.total_ingested.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400/90 mt-1 flex items-center gap-1">
            <span>{streamRateStr}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">100% normalized</span>
          </div>
        </div>

        {/* 2. Deceptive Discounts Flagged */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400">MSRP Fraud Flagged</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-mono font-bold text-rose-400">
            {metrics.deceptive_discounts_flagged.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Fake discount spike prevented
          </div>
        </div>

        {/* 3. All-Time Lows (ATL) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">ATL Discovered</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            {metrics.all_time_lows_detected.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Beats historical price floor
          </div>
        </div>

        {/* 4. Grey Market Blocked */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">Grey Market Blocked</span>
            <Ban className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-bold text-amber-400">
            {metrics.grey_market_blocked.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Excluded from best_deal
          </div>
        </div>

        {/* 5. Developer Revenue Net */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">Dev Royalty Volume</span>
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-mono font-bold text-cyan-400">
            ${metrics.total_dev_revenue_protected_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Calculated at 70%–90% cuts
          </div>
        </div>

        {/* 6. Pipeline Latency */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">Mean Latency</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-xl font-mono font-bold text-yellow-300">
            {metrics.avg_latency_ms.toFixed(2)} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Zero-allocation fast path
          </div>
        </div>
      </div>
    </div>
  );
};
