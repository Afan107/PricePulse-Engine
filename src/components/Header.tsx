import React from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Code2, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Server, 
  Bell, 
  Scale,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Sparkles,
  Settings,
  Layers,
  Zap,
  Monitor
} from 'lucide-react';

interface HeaderProps {
  isRunning: boolean;
  onToggleRun: () => void;
  speedMs: number;
  onChangeSpeed: (ms: number) => void;
  onStepOnce: () => void;
  onReset: () => void;
  onOpenApiDocs: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount?: number;
  viewMode: 'simple' | 'pro';
  onToggleViewMode: (mode: 'simple' | 'pro') => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  onToggleRun,
  speedMs,
  onChangeSpeed,
  onStepOnce,
  onReset,
  onOpenApiDocs,
  activeTab,
  setActiveTab,
  alertCount = 0,
  viewMode,
  onToggleViewMode,
  onOpenSettings,
}) => {
  // Simple view tabs (3 Clean Tabs)
  const simpleTabs = [
    { id: 'simple_deals', label: 'Live Game Deals', icon: ShoppingBag, badge: 'Official Stores' },
    { id: 'simple_scam_checker', label: 'Fake Discount & Scam Checker', icon: AlertTriangle },
    { id: 'simple_software_sales', label: 'Buy Software & Pro Access ($99)', icon: Sparkles, highlight: true },
  ];

  // Pro Terminal tabs
  const proTabs = [
    { id: 'live_stream', label: 'Realtime Pipeline Feed', icon: Activity },
    { id: 'commercial_portal', label: 'Monetization Hub & Revenue', icon: DollarSign },
    { id: 'regulatory_filings', label: 'Regulatory Filings (SEC EDGAR)', icon: Scale },
    { id: 'alerts', label: 'Milestone Alerts', icon: Bell, badge: alertCount ? String(alertCount) : undefined },
    { id: 'fastapi_service', label: 'FastAPI & Redis B2B API', icon: Server },
    { id: 'playground', label: 'Ingestion Lab & Fraud Tester', icon: Terminal },
    { id: 'dev_margins', label: 'Developer Revenue Simulator', icon: ShieldCheck },
    { id: 'predictive_radar', label: 'Sale Cadence & ATL Radar', icon: Cpu },
  ];

  const currentTabs = viewMode === 'simple' ? simpleTabs : proTabs;

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-mono">
                PricePulse Engine
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                v2026.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {viewMode === 'simple'
                ? 'Verified PC Game Deals, Anti-Scam Audit & Commercial Software Storefront'
                : 'High-Throughput Gaming Market Normalization & B2B Telemetry Pipeline'}
            </p>
          </div>
        </div>

        {/* Central/Right Controls: View Mode Switcher + Tools */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-end">
          {/* View Mode Toggle: [ Simple View | Pro Terminal View ] */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-700/80 rounded-xl shadow-inner text-xs font-mono">
            <button
              onClick={() => onToggleViewMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'simple'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simple View</span>
            </button>
            <button
              onClick={() => onToggleViewMode('pro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'pro'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Pro Terminal View</span>
            </button>
          </div>

          {/* Pro Mode Stream Telemetry Controls (visible in Pro mode) */}
          {viewMode === 'pro' && (
            <div className="flex items-center gap-1.5">
              {/* Speed Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
                <span className="text-slate-500 text-[10px] font-mono">Rate:</span>
                <select
                  value={speedMs}
                  onChange={(e) => onChangeSpeed(Number(e.target.value))}
                  className="bg-transparent border-0 text-xs font-mono font-medium text-emerald-400 focus:outline-none cursor-pointer"
                >
                  <option value={300} className="bg-slate-900 text-slate-200">High (3.3 ev/s)</option>
                  <option value={1000} className="bg-slate-900 text-slate-200">Normal (1 ev/s)</option>
                  <option value={2500} className="bg-slate-900 text-slate-200">Slow (0.4 ev/s)</option>
                </select>
              </div>

              {/* Step Once */}
              <button
                onClick={onStepOnce}
                title="Ingest single scrape event"
                className="flex items-center gap-1 px-2 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <FastForward className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">1x</span>
              </button>

              {/* Toggle Run/Pause */}
              <button
                onClick={onToggleRun}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                  isRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isRunning ? 'Pause' : 'Run'}</span>
              </button>

              {/* Reset */}
              <button
                onClick={onReset}
                title="Reset telemetry"
                className="p-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* B2B API Specs */}
              <button
                onClick={onOpenApiDocs}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              >
                <Code2 className="w-3 h-3 text-cyan-400" />
                <span>API Specs</span>
              </button>
            </div>
          )}

          {/* Settings Modal Button (Gear Icon) */}
          <button
            onClick={onOpenSettings}
            title="Configure affiliate links & checkout URLs"
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-1.5">
        {currentTabs.map((tab: any) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-tight transition-all whitespace-nowrap rounded-lg ${
                isActive
                  ? tab.highlight
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-950 border border-emerald-400/40'
                    : 'bg-slate-800 text-white font-bold border border-slate-700 shadow-inner'
                  : tab.highlight
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
