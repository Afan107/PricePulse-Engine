import React from 'react';
import { 
  ArrowRight, 
  FileCode, 
  DollarSign, 
  ShieldAlert, 
  Building2, 
  TrendingDown, 
  Sparkles 
} from 'lucide-react';

interface PipelineFlowProps {
  activeStage?: number;
  onSelectStage?: (stage: number) => void;
}

export const PipelineFlow: React.FC<PipelineFlowProps> = ({ activeStage = 0 }) => {
  const stages = [
    {
      num: 1,
      title: 'Raw Scrape Ingestion',
      subtitle: 'Multi-store unstandardized payloads',
      icon: FileCode,
      color: 'border-slate-700 bg-slate-900/60 text-slate-300',
    },
    {
      num: 2,
      title: 'Currency Normalization',
      subtitle: 'Standard 2-decimal float float & symbol parser',
      icon: DollarSign,
      color: 'border-blue-900/40 bg-blue-950/20 text-blue-300',
    },
    {
      num: 3,
      title: 'MSRP Fraud & 1-Yr Trend',
      subtitle: '365-day baseline audit & EU Omnibus 98/6 check',
      icon: ShieldAlert,
      color: 'border-rose-900/40 bg-rose-950/20 text-rose-300',
    },
    {
      num: 4,
      title: 'Known Sec & Store Integrity',
      subtitle: 'Threat audit & dev cut (Epic 88%, Steam 70%, Grey 0%)',
      icon: Building2,
      color: 'border-purple-900/40 bg-purple-950/20 text-purple-300',
    },
    {
      num: 5,
      title: '1-Year ATL Radar & Cadence',
      subtitle: '365-day historical floor & ~52d promotional interval',
      icon: TrendingDown,
      color: 'border-emerald-900/40 bg-emerald-950/20 text-emerald-300',
    },
    {
      num: 6,
      title: 'Predictive Signals & Timing',
      subtitle: 'BUY_NOW · WAIT · Known Seconds Countdown',
      icon: Sparkles,
      color: 'border-amber-900/40 bg-amber-950/20 text-amber-300',
    },
  ];

  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
          PricePulse Operational Pipeline Architecture
        </span>
        <span className="text-[11px] font-mono text-emerald-400">
          Deterministic Rule Engine · Sub-Millisecond Dispatch
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStage === stage.num;
          return (
            <div
              key={stage.num}
              className={`p-2.5 rounded-md border transition-all relative ${stage.color} ${
                isSelected ? 'ring-1 ring-emerald-500 shadow-md' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                  STAGE 0{stage.num}
                </span>
                <Icon className="w-3.5 h-3.5 opacity-80" />
              </div>
              <div className="text-xs font-semibold text-slate-100 leading-tight">
                {stage.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                {stage.subtitle}
              </div>
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
