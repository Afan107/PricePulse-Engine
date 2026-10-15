import React from 'react';
import { AlertNotification } from '../types/alerts';
import { Trophy, X, Sparkles, ArrowRight } from 'lucide-react';

interface ToastBannerProps {
  notifications: AlertNotification[];
  onDismiss: (id: string) => void;
  onNavigateToAlerts?: () => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({
  notifications,
  onDismiss,
  onNavigateToAlerts,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto bg-slate-900/95 border-2 border-emerald-500/80 rounded-lg p-3.5 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <Trophy className="w-4 h-4 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>{item.title}</span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">
              {item.message}
            </p>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[10px]">
              <span className="text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
              {onNavigateToAlerts && (
                <button
                  onClick={onNavigateToAlerts}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-semibold"
                >
                  <span>View in Alerts</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(item.id)}
            className="text-slate-500 hover:text-slate-200 p-0.5 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
