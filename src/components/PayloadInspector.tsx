import React, { useState } from 'react';
import { NormalizedProductionPayload } from '../types/pipeline';
import { 
  Check, 
  Copy, 
  ShieldAlert, 
  TrendingDown, 
  Ban, 
  CheckCircle2, 
  Terminal, 
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

interface PayloadInspectorProps {
  payload: NormalizedProductionPayload | null;
  onClose?: () => void;
}

export const PayloadInspector: React.FC<PayloadInspectorProps> = ({ payload }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'both' | 'normalized_json' | 'raw_json'>('both');

  if (!payload) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
        <Terminal className="w-10 h-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-mono font-semibold text-slate-300">
          No Ingested Payload Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select any real-time scrape event from the feed or execute a test from the playground to inspect the raw vs normalized JSON schema.
        </p>
      </div>
    );
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawSample = {
    raw_ingestion_id: payload.raw_audit_trace.raw_ingestion_id,
    game_title: payload.game_metadata.canonical_title,
    storefront_scraped: payload.raw_audit_trace.ingested_store,
    raw_price_string: payload.raw_audit_trace.original_raw_price,
    raw_msrp_string: payload.raw_audit_trace.original_raw_msrp,
    historical_baseline_msrp: payload.pricing.historical_baseline_msrp,
    lowest_recorded_history: payload.all_time_low.lowest_recorded_history,
    scrape_timestamp: payload.processed_at,
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            Pipeline Payload Inspector
          </span>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            ID: {payload.record_id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2 py-0.5 rounded ${viewMode === 'both' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('normalized_json')}
              className={`px-2 py-0.5 rounded ${viewMode === 'normalized_json' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Normalized JSON
            </button>
            <button
              onClick={() => setViewMode('raw_json')}
              className={`px-2 py-0.5 rounded ${viewMode === 'raw_json' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Raw Input
            </button>
          </div>

          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* Summary Audit Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-3 bg-slate-950/60 border-b border-slate-800/80 text-xs">
        {/* Pricing & Fraud Card */}
        <div className={`p-2 rounded border ${
          payload.pricing.is_deceptive_discount 
            ? 'bg-rose-950/30 border-rose-900/60 text-rose-300' 
            : 'bg-slate-900/40 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="font-semibold">Pricing Integrity</span>
            {payload.pricing.is_deceptive_discount ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <div className="text-sm font-mono font-bold">
            ${payload.pricing.normalized_current_price.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">
              (True {payload.pricing.true_discount_percentage}% OFF)
            </span>
          </div>
          <div className="text-[10px] mt-1 text-slate-400 leading-tight">
            {payload.pricing.is_deceptive_discount ? (
              <span className="text-rose-400 font-semibold">
                MSRP inflated by +${payload.pricing.msrp_elevation_delta.toFixed(2)}
              </span>
            ) : (
              <span>MSRP matches baseline ${payload.pricing.historical_baseline_msrp.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Store & Developer Economics */}
        <div className={`p-2 rounded border ${
          !payload.store_integrity.is_authorized_store
            ? 'bg-amber-950/30 border-amber-900/60 text-amber-300'
            : 'bg-slate-900/40 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="font-semibold">Store & Royalty</span>
            {!payload.store_integrity.is_authorized_store ? (
              <Ban className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <div className="text-sm font-mono font-bold text-cyan-400">
            ${payload.store_integrity.developer_net_payout.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({payload.store_integrity.developer_cut_percentage}% dev cut)
            </span>
          </div>
          <div className="text-[10px] mt-1 text-slate-400 leading-tight">
            {payload.store_integrity.is_authorized_store ? (
              <span>Verified: {payload.store_integrity.store_name}</span>
            ) : (
              <span className="text-amber-400 font-semibold">Grey market: $0 developer revenue</span>
            )}
          </div>
        </div>

        {/* All-Time Low Status */}
        <div className={`p-2 rounded border ${
          payload.all_time_low.is_all_time_low
            ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
            : 'bg-slate-900/40 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="font-semibold">ATL Analysis</span>
            <TrendingDown className={`w-3.5 h-3.5 ${payload.all_time_low.is_all_time_low ? 'text-emerald-400' : 'text-slate-500'}`} />
          </div>
          <div className="text-sm font-mono font-bold">
            {payload.all_time_low.is_all_time_low ? (
              <span className="text-emerald-400 font-bold">NEW RECORD LOW</span>
            ) : payload.all_time_low.matches_all_time_low ? (
              <span className="text-emerald-300">MATCHES ATL</span>
            ) : (
              <span className="text-slate-300">Above ATL (${payload.all_time_low.lowest_recorded_history.toFixed(2)})</span>
            )}
          </div>
          <div className="text-[10px] mt-1 text-slate-400 leading-tight">
            {payload.all_time_low.is_all_time_low ? (
              <span>-${payload.all_time_low.margin_below_previous_atl.toFixed(2)} under previous record</span>
            ) : (
              <span>Floor: ${payload.all_time_low.lowest_recorded_history.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Predictive Recommendation */}
        <div className="p-2 rounded border bg-slate-900/40 border-slate-800 text-slate-300">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="font-semibold">Recommendation</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold">
            <span className={`px-1.5 py-0.5 rounded text-xs uppercase ${
              payload.predictive_analytics.recommendation === 'BUY_NOW'
                ? 'bg-emerald-500/20 text-emerald-300'
                : payload.predictive_analytics.recommendation === 'WAIT'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-blue-500/20 text-blue-300'
            }`}>
              {payload.predictive_analytics.recommendation}
            </span>
          </div>
          <div className="text-[10px] mt-1 text-slate-400 truncate">
            {payload.predictive_analytics.primary_reason}
          </div>
        </div>
      </div>

      {/* Code Viewer Viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 max-h-[500px] overflow-y-auto">
        {/* Raw Ingestion Payload */}
        {(viewMode === 'both' || viewMode === 'raw_json') && (
          <div className="p-3 bg-slate-950 font-mono text-[11px] overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1 border-b border-slate-800 text-xs">
              <span className="font-semibold text-slate-300">Raw Scrape Ingested</span>
              <span className="text-[10px] text-amber-400">UNSTANDARDIZED</span>
            </div>
            <pre className="text-slate-300 leading-relaxed">
              {JSON.stringify(rawSample, null, 2)}
            </pre>
          </div>
        )}

        {/* Normalized Production JSON */}
        {(viewMode === 'both' || viewMode === 'normalized_json') && (
          <div className="p-3 bg-slate-950 font-mono text-[11px] overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1 border-b border-slate-800 text-xs">
              <span className="font-semibold text-emerald-400">Production-Grade Normalized Output</span>
              <span className="text-[10px] text-emerald-400">RFC VALIDATED (B2B API)</span>
            </div>
            <pre className="text-emerald-200/90 leading-relaxed">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Audit Detail Strip */}
      {payload.pricing.fraud_explanation && (
        <div className="p-2.5 bg-rose-950/40 border-t border-rose-900/60 text-xs font-mono text-rose-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>{payload.pricing.fraud_explanation}</div>
        </div>
      )}

      {/* Known Sec Audit & Threat Matrix Strip */}
      {payload.known_security && (
        <div className={`p-2.5 border-t text-xs font-mono flex items-start gap-2.5 ${
          payload.known_security.threat_level === 'CRITICAL'
            ? 'bg-rose-950/60 border-rose-900/80 text-rose-200'
            : payload.known_security.threat_level === 'MEDIUM'
            ? 'bg-amber-950/60 border-amber-900/80 text-amber-200'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${
            payload.known_security.threat_level === 'CRITICAL'
              ? 'text-rose-400'
              : payload.known_security.threat_level === 'MEDIUM'
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`} />
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">
                KNOWN SEC AUDIT: {payload.known_security.security_status}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                payload.known_security.threat_score >= 70
                  ? 'bg-rose-900 text-rose-100'
                  : payload.known_security.threat_score >= 35
                  ? 'bg-amber-900 text-amber-100'
                  : 'bg-emerald-900/60 text-emerald-200'
              }`}>
                THREAT SCORE: {payload.known_security.threat_score}/100
              </span>
              {payload.known_security.detected_threat_signatures.map((sig) => (
                <span key={sig} className="px-1.5 py-0.2 rounded bg-black/50 text-[10px] text-slate-300 border border-slate-700">
                  {sig}
                </span>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {payload.known_security.security_advisory}
            </p>
            <div className="text-[10px] text-slate-400 pt-0.5 flex flex-wrap items-center gap-2">
              <span>Known Countdown: <strong className="text-cyan-400">{payload.predictive_analytics.next_sale_window.known_seconds_until_start.toLocaleString()} sec</strong> ({payload.predictive_analytics.next_sale_window.days_until_start} days)</span>
              <span>·</span>
              <span>SSL Fingerprint: {payload.known_security.ssl_fingerprint_verified ? '✅ Verified' : '❌ Unverified'}</span>
              <span>·</span>
              <span>Dev Royalty Secured: {payload.known_security.developer_rev_secured ? '✅ Yes' : '❌ No'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 1-Year Historical Pricing Trend Telemetry Strip */}
      {payload.historical_trend && (
        <div className="p-2.5 border-t border-slate-800 bg-slate-950 text-xs font-mono flex items-start gap-2.5 text-slate-300">
          <TrendingDown className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-200">
                1-YEAR HISTORICAL PRICING TELEMETRY (14 MONTHS ARCHIVE)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-900/60 text-cyan-200 border border-cyan-700/50">
                FLOOR ATL: ${payload.historical_trend.allTimeLowPrice.toFixed(2)}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                STABLE MSRP: ${payload.historical_trend.stableBaselineMsrp.toFixed(2)}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                PROMOTIONS: {payload.historical_trend.totalSalesPastYear} recorded
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                payload.historical_trend.isDeceptiveDiscount
                  ? 'bg-red-950 text-red-300 border border-red-700'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              }`}>
                {payload.historical_trend.isDeceptiveDiscount ? '⚠️ EU OMNIBUS VIOLATION' : '✅ EU OMNIBUS COMPLIANT'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Promotional Cadence: ~{payload.historical_trend.averageDaysBetweenSales} days between sales. 
              Next predicted window: <strong className="text-white">{payload.historical_trend.predictiveSignals.nextExpectedEvent}</strong> in {payload.historical_trend.predictiveSignals.daysUntilNextSale} days 
              (Projected: -{payload.historical_trend.predictiveSignals.projectedDiscountPct}% off @ ${payload.historical_trend.predictiveSignals.projectedPrice.toFixed(2)}).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
