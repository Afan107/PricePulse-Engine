import React, { useState } from 'react';
import { X, Copy, Check, Code2, Terminal, BookOpen } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeLang, setActiveLang] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const curlSnippet = `curl -X POST https://api.pricepulse.io/v1/normalize \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_COMMERCIAL_API_KEY" \\
  -d '{
    "game_title": "Baldurs Gate 3",
    "store": "GOG.com",
    "raw_price": "34.99 EUR",
    "raw_msrp": "59.99",
    "historical_baseline_msrp": 59.99,
    "lowest_recorded_history": 39.99
  }'`;

  const tsSnippet = `import axios from 'axios';

interface NormalizedResponse {
  schema_version: string;
  record_id: string;
  pricing: {
    normalized_msrp: number;
    normalized_current_price: number;
    true_discount_percentage: number;
    is_deceptive_discount: boolean;
  };
  store_integrity: {
    is_authorized_store: boolean;
    developer_cut_percentage: number;
    developer_net_payout: number;
  };
  all_time_low: {
    is_all_time_low: boolean;
    margin_below_previous_atl: number;
  };
  predictive_analytics: {
    recommendation: 'BUY_NOW' | 'WAIT' | 'FAIR_VALUE';
    primary_reason: string;
  };
}

const { data } = await axios.post<NormalizedResponse>(
  'https://api.pricepulse.io/v1/normalize',
  {
    game_title: "Cyberpunk 2077: Phantom Liberty",
    store: "Steam",
    raw_price: "$29.99 USD",
    raw_msrp: "$49.99",
    historical_baseline_msrp: 49.99,
    lowest_recorded_history: 29.99
  },
  {
    headers: { Authorization: 'Bearer YOUR_COMMERCIAL_API_KEY' }
  }
);

console.log('Recommendation:', data.predictive_analytics.recommendation);
console.log('Dev Royalty:', data.store_integrity.developer_net_payout);`;

  const pySnippet = `import requests

payload = {
    "game_title": "Hades II",
    "store": "Epic Games Store",
    "raw_price": "$39.99",
    "raw_msrp": "$39.99",
    "historical_baseline_msrp": 39.99,
    "lowest_recorded_history": 39.99
}

headers = {
    "Authorization": "Bearer YOUR_COMMERCIAL_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post("https://api.pricepulse.io/v1/normalize", json=payload, headers=headers)
data = response.json()

print(f"Signal: {data['predictive_analytics']['recommendation']}")
print(f"Dev Cut: {data['store_integrity']['developer_cut_percentage']}%")`;

  const getActiveCode = () => {
    if (activeLang === 'curl') return curlSnippet;
    if (activeLang === 'typescript') return tsSnippet;
    return pySnippet;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-100">
              PricePulse Commercial B2B API Specification (v2026.4)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs font-mono text-slate-300">
          {/* Endpoints */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Primary Endpoints
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                    POST
                  </span>
                  <span className="text-slate-100">/v1/normalize</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    · Ingest & normalize single unstandardized scrape payload
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">&lt; 0.5 ms SLA</span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                    POST
                  </span>
                  <span className="text-slate-100">/v1/normalize/batch</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    · High-throughput batch array ingestion (up to 5,000 scrapes/call)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Stream Buffer</span>
              </div>
            </div>
          </div>

          {/* Operational Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-200 font-semibold mb-1 text-[11px] text-emerald-400">
                1. Currency & MSRP Fraud Rules
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Normalizes prices to 2-decimal floats. Computes true discount percentage = round(((original_msrp - current_price) / original_msrp) * 100). If original_msrp was artificially elevated compared to historical baseline MSRP, automatically flags is_deceptive_discount = true.
              </p>
            </div>

            <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-200 font-semibold mb-1 text-[11px] text-cyan-400">
                2. Store Integrity & Dev Share
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Enforces developer share terms: Epic (88%), Humble Direct (85-90%), Steam/GOG/Xbox (70%), Fanatical (70% net). Unauthorized grey-market resellers (G2A/Kinguin) are set to is_authorized_store = false and excluded from best_deal recommendations.
              </p>
            </div>
          </div>

          {/* Code Integration Explorer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Client Integration Snippets
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5">
                <button
                  onClick={() => setActiveLang('curl')}
                  className={`px-2 py-0.5 rounded text-[11px] ${activeLang === 'curl' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveLang('typescript')}
                  className={`px-2 py-0.5 rounded text-[11px] ${activeLang === 'typescript' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setActiveLang('python')}
                  className={`px-2 py-0.5 rounded text-[11px] ${activeLang === 'python' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  Python
                </button>
              </div>
            </div>

            <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-3 overflow-x-auto">
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono border border-slate-700 transition-colors"
              >
                {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="text-slate-200 text-[11px] leading-relaxed pt-2">
                {getActiveCode()}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Enterprise SLA: 99.999% uptime · Zero latency cold-start</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
