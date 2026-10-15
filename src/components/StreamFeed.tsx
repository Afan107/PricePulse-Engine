import React, { useState } from 'react';
import { NormalizedProductionPayload } from '../types/pipeline';
import { 
  ShieldAlert, 
  TrendingDown, 
  Ban, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Layers,
  ShieldCheck
} from 'lucide-react';

interface StreamFeedProps {
  events: NormalizedProductionPayload[];
  onSelectEvent: (event: NormalizedProductionPayload) => void;
  selectedEventId?: string;
}

export const StreamFeed: React.FC<StreamFeedProps> = ({
  events,
  onSelectEvent,
  selectedEventId,
}) => {
  const [filter, setFilter] = useState<'all' | 'fraud' | 'atl' | 'grey' | 'known_sec' | 'buy_now'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((ev) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.game_metadata.canonical_title.toLowerCase().includes(q);
      const matchStore = ev.store_integrity.store_name.toLowerCase().includes(q);
      if (!matchTitle && !matchStore) return false;
    }

    if (filter === 'fraud') return ev.pricing.is_deceptive_discount;
    if (filter === 'atl') return ev.all_time_low.is_all_time_low || ev.all_time_low.matches_all_time_low;
    if (filter === 'grey') return !ev.store_integrity.is_authorized_store;
    if (filter === 'known_sec') return ev.known_security?.threat_level !== 'NONE';
    if (filter === 'buy_now') return ev.predictive_analytics.recommendation === 'BUY_NOW';
    return true;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[740px]">
      {/* Stream Controls Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            Realtime Normalized Pipeline Feed
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ({filteredEvents.length} records shown)
          </span>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Ingested
          </button>
          <button
            onClick={() => setFilter('fraud')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              filter === 'fraud'
                ? 'bg-rose-950/80 text-rose-300 font-medium border border-rose-800'
                : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>MSRP Fraud</span>
          </button>
          <button
            onClick={() => setFilter('atl')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              filter === 'atl'
                ? 'bg-emerald-950/80 text-emerald-300 font-medium border border-emerald-800'
                : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            <TrendingDown className="w-3 h-3" />
            <span>All-Time Lows</span>
          </button>
          <button
            onClick={() => setFilter('grey')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              filter === 'grey'
                ? 'bg-amber-950/80 text-amber-300 font-medium border border-amber-800'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Ban className="w-3 h-3" />
            <span>Grey Market Block</span>
          </button>
          <button
            onClick={() => setFilter('known_sec')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              filter === 'known_sec'
                ? 'bg-purple-950/80 text-purple-300 font-medium border border-purple-800'
                : 'text-purple-400/80 hover:text-purple-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Known Sec</span>
          </button>
          <button
            onClick={() => setFilter('buy_now')}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              filter === 'buy_now'
                ? 'bg-cyan-950/80 text-cyan-300 font-medium border border-cyan-800'
                : 'text-cyan-400/80 hover:text-cyan-300'
            }`}
          >
            BUY_NOW Signals
          </button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter title or store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Stream Table */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            No events match the current filter. Ingesting new live scrape packets...
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isSelected = ev.record_id === selectedEventId;
            const rec = ev.predictive_analytics.recommendation;

            return (
              <div
                key={ev.record_id}
                onClick={() => onSelectEvent(ev)}
                className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelected ? 'bg-slate-800/90 border-l-4 border-l-emerald-500' : ''
                }`}
              >
                {/* Left: Game Title, Storefront & Flags */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-100 truncate text-sm">
                      {ev.game_metadata.canonical_title}
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      {ev.game_metadata.normalized_sku}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                    {/* Store status */}
                    <span className="font-medium text-slate-300">
                      {ev.store_integrity.store_name}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>

                    {ev.store_integrity.is_authorized_store ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 inline" /> Authorized Distributor
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium flex items-center gap-0.5">
                        <Ban className="w-3 h-3 inline" /> Unauthorized Grey Market (Excluded)
                      </span>
                    )}

                    <span aria-hidden="true" className="text-slate-600">·</span>

                    {/* Developer share */}
                    <span className="text-slate-300 font-mono">
                      Dev Cut: <strong className="text-cyan-400">{ev.store_integrity.developer_cut_percentage}%</strong> (${ev.store_integrity.developer_net_payout.toFixed(2)})
                    </span>
                  </div>

                  {/* Audit Flags */}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {ev.pricing.is_deceptive_discount && (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-900/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        DECEPTIVE MSRP (+${ev.pricing.msrp_elevation_delta.toFixed(2)})
                      </span>
                    )}

                    {ev.all_time_low.is_all_time_low && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        NEW RECORD ATL (-${ev.all_time_low.margin_below_previous_atl.toFixed(2)})
                      </span>
                    )}

                    {ev.all_time_low.matches_all_time_low && (
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                        MATCHES ATL RECORD
                      </span>
                    )}

                    {ev.known_security && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                        ev.known_security.threat_level === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800 font-bold'
                          : ev.known_security.threat_level === 'MEDIUM'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800 font-medium'
                          : 'bg-slate-900 text-emerald-400 border-emerald-900/60'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>SEC: {ev.known_security.security_status} [{ev.known_security.threat_score}/100]</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-slate-500">
                      Processed in {ev.pipeline_latency_ms.toFixed(2)}ms
                    </span>
                  </div>
                </div>

                {/* Right: Normalized Price, Discount & Recommendation */}
                <div className="flex items-center gap-4 sm:text-right shrink-0">
                  <div>
                    <div className="flex items-baseline gap-1.5 sm:justify-end">
                      {ev.pricing.normalized_msrp > ev.pricing.normalized_current_price && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ${ev.pricing.normalized_msrp.toFixed(2)}
                        </span>
                      )}
                      <span className="text-base font-bold font-mono text-slate-100">
                        ${ev.pricing.normalized_current_price.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono">
                      {ev.pricing.true_discount_percentage > 0 ? (
                        <span className="text-emerald-400 font-semibold">
                          -{ev.pricing.true_discount_percentage}% true off
                        </span>
                      ) : (
                        <span className="text-slate-500">Standard Price</span>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Signal */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        rec === 'BUY_NOW'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : rec === 'WAIT'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {rec}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-0.5"
                    >
                      <span>JSON</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stream Footer Telemetry */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Realtime Ingestion Buffer: Max 200 items in memory</span>
        </div>
        <div className="text-slate-400">
          Click any record to inspect normalized B2B JSON payload
        </div>
      </div>
    </div>
  );
};
