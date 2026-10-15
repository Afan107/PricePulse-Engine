import React, { useState } from 'react';
import { RawScrapePayload, NormalizedProductionPayload } from '../types/pipeline';
import { normalizePriceScrape } from '../services/normalizer';
import { PRESET_TEST_CASES, PresetTestCase } from '../services/mockFeed';
import { 
  Play, 
  Terminal, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Sparkles,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface ManualPlaygroundProps {
  onOutputGenerated?: (output: NormalizedProductionPayload) => void;
}

export const ManualPlayground: React.FC<ManualPlaygroundProps> = ({ onOutputGenerated }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_TEST_CASES[0].id);
  const [rawJsonText, setRawJsonText] = useState<string>(
    JSON.stringify(PRESET_TEST_CASES[0].payload, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [pipelineOutput, setPipelineOutput] = useState<NormalizedProductionPayload | null>(() => {
    return normalizePriceScrape(PRESET_TEST_CASES[0].payload);
  });

  const handleSelectPreset = (preset: PresetTestCase) => {
    setSelectedPresetId(preset.id);
    const text = JSON.stringify(preset.payload, null, 2);
    setRawJsonText(text);
    setJsonError(null);
    const result = normalizePriceScrape(preset.payload);
    setPipelineOutput(result);
    if (onOutputGenerated) onOutputGenerated(result);
  };

  const handleRunPipeline = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(rawJsonText) as RawScrapePayload;
      if (!parsed.game_title || parsed.raw_price === undefined) {
        throw new Error('Raw payload must have at least "game_title" and "raw_price" fields.');
      }
      const result = normalizePriceScrape(parsed);
      setPipelineOutput(result);
      if (onOutputGenerated) onOutputGenerated(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid JSON payload structure';
      setJsonError(message);
    }
  };

  const handleResetToCurrentPreset = () => {
    const found = PRESET_TEST_CASES.find((p) => p.id === selectedPresetId);
    if (found) {
      setRawJsonText(JSON.stringify(found.payload, null, 2));
      setJsonError(null);
      const result = normalizePriceScrape(found.payload);
      setPipelineOutput(result);
      if (onOutputGenerated) onOutputGenerated(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-mono font-semibold text-slate-100">
            Pipeline Playground & Ingestion Test Bench
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Inject raw, unstandardized store scrapes with currency symbols, deceptive MSRP markups, grey-market sellers, or all-time low price drops to audit PricePulse engine normalization in real time.
        </p>

        {/* Preset Selector Badges */}
        <div className="mt-3">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Curated Industry Test Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_TEST_CASES.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded text-left border transition-all text-xs font-mono flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/80 text-white shadow'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200 mb-0.5 line-clamp-1">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    {preset.scenario}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor & Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Raw Payload Editor */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-semibold text-slate-200">
                Raw Scrape Payload Editor (JSON)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToCurrentPreset}
                title="Reset to preset"
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 text-xs font-mono"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={handleRunPipeline}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Execute Engine</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 flex-1 flex flex-col">
            <textarea
              value={rawJsonText}
              onChange={(e) => setRawJsonText(e.target.value)}
              rows={16}
              className="w-full flex-1 p-2.5 font-mono text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500 font-normal leading-relaxed resize-none"
              placeholder="Paste raw scrape JSON..."
            />
            {jsonError && (
              <div className="mt-2 p-2 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
                Error: {jsonError}
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Payload Fields: raw_price, raw_msrp, historical_baseline_msrp, store</span>
            <span className="text-emerald-400">Valid JSON required</span>
          </div>
        </div>

        {/* Right: Step-by-Step Execution Trace */}
        {pipelineOutput && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pipeline Audit Execution Results</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                ⚡ {pipelineOutput.pipeline_latency_ms.toFixed(3)} ms
              </span>
            </div>

            <div className="p-4 space-y-3.5 overflow-y-auto max-h-[520px]">
              {/* Step 1: Currency & Price Normalization */}
              <div className="p-3 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-slate-300 font-semibold">1. Price Normalization</span>
                  <span className="text-[10px] text-emerald-400">PASSED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 mt-2">
                  <div>
                    <span className="text-slate-500 text-[10px]">CURRENT PRICE:</span>
                    <div className="text-sm font-bold text-slate-100">
                      ${pipelineOutput.pricing.normalized_current_price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">NORMALIZED MSRP:</span>
                    <div className="text-sm font-bold text-slate-300">
                      ${pipelineOutput.pricing.normalized_msrp.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: MSRP Fraud & Deceptive Discount Audit */}
              <div className={`p-3 rounded-md border text-xs font-mono ${
                pipelineOutput.pricing.is_deceptive_discount
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    {pipelineOutput.pricing.is_deceptive_discount ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>2. MSRP Fraud Verification</span>
                  </span>
                  <span className={`text-[10px] font-bold ${
                    pipelineOutput.pricing.is_deceptive_discount ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {pipelineOutput.pricing.is_deceptive_discount ? 'FRAUD DETECTED' : 'CLEAN'}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div>Claimed Discount: <strong>{pipelineOutput.pricing.claimed_discount_percentage}%</strong></div>
                  <div>True Calibrated Discount: <strong className="text-emerald-400">{pipelineOutput.pricing.true_discount_percentage}%</strong></div>
                  {pipelineOutput.pricing.is_deceptive_discount && (
                    <div className="text-rose-400 text-[11px] mt-1 pt-1 border-t border-rose-900/60 leading-normal">
                      ⚠ Baseline MSRP of ${pipelineOutput.pricing.historical_baseline_msrp.toFixed(2)} was artificially elevated to ${pipelineOutput.pricing.normalized_msrp.toFixed(2)} (+${pipelineOutput.pricing.msrp_elevation_delta.toFixed(2)} inflation).
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Store Integrity & Developer Royalty */}
              <div className={`p-3 rounded-md border text-xs font-mono ${
                !pipelineOutput.store_integrity.is_authorized_store
                  ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3. Store Integrity & Developer Margin</span>
                  </span>
                  <span className="text-[10px] font-bold text-cyan-400">
                    {pipelineOutput.store_integrity.store_slug.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 text-[10px]">AUTHORIZED STORE:</span>
                    <div className="font-semibold text-slate-200">
                      {pipelineOutput.store_integrity.is_authorized_store ? 'Yes (Verified Channel)' : 'No (Grey Market Quarantined)'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">DEVELOPER PAYOUT:</span>
                    <div className="font-bold text-cyan-300">
                      ${pipelineOutput.store_integrity.developer_net_payout.toFixed(2)} ({pipelineOutput.store_integrity.developer_cut_percentage}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: All-Time Low Status & Predictive Recommendation */}
              <div className="p-3 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>4. Predictive Recommendation Signal</span>
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    pipelineOutput.predictive_analytics.recommendation === 'BUY_NOW'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : pipelineOutput.predictive_analytics.recommendation === 'WAIT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {pipelineOutput.predictive_analytics.recommendation}
                  </span>
                </div>
                <p className="text-slate-400 mt-2 text-[11px] leading-relaxed">
                  {pipelineOutput.predictive_analytics.primary_reason}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  Best Deal Eligible: {pipelineOutput.market_intelligence.eligible_for_best_deal ? '✅ TRUE' : '❌ FALSE (Excluded)'}
                </div>
              </div>

              {/* Step 5: Known Sec & Threat Intelligence Audit */}
              {pipelineOutput.known_security && (
                <div className={`p-3 rounded-md border text-xs font-mono ${
                  pipelineOutput.known_security.threat_level === 'CRITICAL'
                    ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                    : pipelineOutput.known_security.threat_level === 'MEDIUM'
                    ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>5. Known Sec &amp; Threat Audit</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      pipelineOutput.known_security.threat_level === 'CRITICAL'
                        ? 'bg-rose-900 text-rose-100'
                        : pipelineOutput.known_security.threat_level === 'MEDIUM'
                        ? 'bg-amber-900 text-amber-100'
                        : 'bg-emerald-900/60 text-emerald-200'
                    }`}>
                      THREAT SCORE: {pipelineOutput.known_security.threat_score}/100
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 text-slate-300">
                    {pipelineOutput.known_security.security_advisory}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {pipelineOutput.known_security.detected_threat_signatures.map((sig) => (
                      <span key={sig} className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] border border-slate-700 text-slate-300">
                        {sig}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                    <span>Quarantined: {pipelineOutput.known_security.is_quarantined ? '🚨 YES' : 'CLEAN'}</span>
                    <span>Known Countdown: {pipelineOutput.predictive_analytics.next_sale_window.known_seconds_until_start.toLocaleString()} sec</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
