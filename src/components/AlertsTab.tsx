import React, { useState } from 'react';
import { RevenueMilestone, AlertNotification } from '../types/alerts';
import { 
  Bell, 
  Trophy, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  RotateCcw,
  Sliders,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface AlertsTabProps {
  currentRevenueProtected: number;
  milestones: RevenueMilestone[];
  onAddMilestone: (threshold: number, label: string) => void;
  onRemoveMilestone: (id: string) => void;
  onResetMilestones: () => void;
  onTriggerTestAlert: (threshold: number, label: string) => void;
  notifications: AlertNotification[];
  onClearNotifications: () => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  currentRevenueProtected,
  milestones,
  onAddMilestone,
  onRemoveMilestone,
  onResetMilestones,
  onTriggerTestAlert,
  notifications,
  onClearNotifications,
}) => {
  const [newThresholdInput, setNewThresholdInput] = useState<string>('');
  const [newLabelInput, setNewLabelInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sortedMilestones = [...milestones].sort((a, b) => a.threshold_usd - b.threshold_usd);
  const unlockedCount = milestones.filter((m) => currentRevenueProtected >= m.threshold_usd).length;

  // Next upcoming milestone
  const nextMilestone = sortedMilestones.find((m) => currentRevenueProtected < m.threshold_usd);
  const nextDistance = nextMilestone ? nextMilestone.threshold_usd - currentRevenueProtected : 0;
  const nextPct = nextMilestone 
    ? Math.min(100, Math.round((currentRevenueProtected / nextMilestone.threshold_usd) * 100))
    : 100;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsed = parseFloat(newThresholdInput);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMsg('Please enter a valid positive dollar amount.');
      return;
    }
    if (milestones.some((m) => m.threshold_usd === parsed)) {
      setErrorMsg(`A milestone threshold for $${parsed.toLocaleString()} already exists.`);
      return;
    }

    const label = newLabelInput.trim() || `$${parsed.toLocaleString()} Revenue Milestone`;
    onAddMilestone(parsed, label);
    setNewThresholdInput('');
    setNewLabelInput('');
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Intro & Telemetry Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Developer Revenue Milestone Alert System
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Watches total_dev_revenue_protected_usd against an array of threshold milestones to trigger automated visual alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetMilestones}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors text-[11px]"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset Thresholds</span>
            </button>
          </div>
        </div>

        {/* Live Revenue Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Live Total Revenue Protected
            </span>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span>{currentRevenueProtected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Active live bot streaming
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Milestones Unlocked
            </span>
            <div className="text-xl font-bold text-cyan-400">
              {unlockedCount} / {milestones.length}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round((unlockedCount / Math.max(1, milestones.length)) * 100)}%)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Across configured threshold array
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Next Milestone Target
            </span>
            {nextMilestone ? (
              <>
                <div className="text-base font-bold text-slate-200 truncate">
                  ${nextMilestone.threshold_usd.toLocaleString()} ({nextMilestone.label})
                </div>
                <div className="text-[10px] text-yellow-400 mt-1">
                  ${nextDistance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining ({nextPct}%)
                </div>
              </>
            ) : (
              <div className="text-sm font-bold text-emerald-400 mt-1">
                🏆 All Configured Milestones Unlocked!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Threshold Array Monitor & Notifications Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Milestone Threshold Array Monitor */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">
                Active Threshold Array Configuration
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {sortedMilestones.length} active thresholds
            </span>
          </div>

          {/* Add New Milestone Form */}
          <form onSubmit={handleAddSubmit} className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Custom Milestone Threshold Value</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <input
                  type="number"
                  step="50"
                  min="1"
                  placeholder="Threshold USD (e.g. 1500)"
                  value={newThresholdInput}
                  onChange={(e) => setNewThresholdInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Label (optional)"
                  value={newLabelInput}
                  onChange={(e) => setNewLabelInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>
            {errorMsg && (
              <div className="text-rose-400 text-[10px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>

          {/* List of Thresholds */}
          <div className="space-y-2.5">
            {sortedMilestones.map((m) => {
              const isReached = currentRevenueProtected >= m.threshold_usd;
              const progressPct = Math.min(100, Math.round((currentRevenueProtected / m.threshold_usd) * 100));

              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isReached
                      ? 'bg-emerald-950/20 border-emerald-800/80 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${
                        isReached ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 text-xs flex items-center gap-2">
                          <span>${m.threshold_usd.toLocaleString()}</span>
                          <span className="text-slate-400 font-normal">· {m.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {m.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isReached ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>UNLOCKED</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                          {progressPct}% ({`$${(m.threshold_usd - currentRevenueProtected).toFixed(0)} to go`})
                        </span>
                      )}

                      {/* Test trigger button */}
                      <button
                        onClick={() => onTriggerTestAlert(m.threshold_usd, m.label)}
                        title="Simulate visual notification trigger for this milestone"
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-cyan-400 text-[10px] flex items-center gap-0.5 transition-colors"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Test Alert</span>
                      </button>

                      {/* Remove custom */}
                      <button
                        onClick={() => onRemoveMilestone(m.id)}
                        title="Remove threshold"
                        className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isReached ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Triggered Notifications Log */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">
                Triggered Alert Audit Log
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline"
              >
                Clear Log
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Clock className="w-8 h-8 text-slate-700 mb-2" />
                <span className="font-semibold text-slate-400">No Alerts Fired Yet</span>
                <p className="text-[10px] text-slate-600 max-w-xs mt-1">
                  When total developer revenue protected crosses any milestone threshold value, visual toast and audit events will appear here automatically.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 animate-in fade-in duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>{n.title}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-tight">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-slate-500 pt-0.5 flex justify-between">
                    <span>Threshold: ${n.threshold_usd.toLocaleString()}</span>
                    <span className="text-emerald-500 font-semibold">● Trigger Dispatched</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
