import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Settings, 
  Check, 
  ExternalLink, 
  Link, 
  Tag, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { AffiliateSettings } from '../types/storefront';
import { DEFAULT_AFFILIATE_SETTINGS } from '../services/cheapSharkService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AffiliateSettings;
  onSave: (newSettings: AffiliateSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AffiliateSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setFormData(DEFAULT_AFFILIATE_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Checkout & Affiliate Settings</h3>
              <p className="text-xs text-slate-400">
                Paste your custom payment links and partner tags (Saved to browser storage)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          {/* Section: Software & Subscription Checkout Links */}
          <div className="space-y-3">
            <span className="text-slate-300 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              1. Software Sales & Subscription Checkout Links (Dodo Payments / Stripe)
            </span>

            {/* Dodo Payments $99 Full Source Code */}
            <div>
              <label className="block text-slate-400 mb-1">
                $99 Full Source Code Checkout URL (Dodo Payments / Stripe / Custom):
              </label>
              <input
                type="url"
                required
                value={formData.gumroadCodeUrl}
                onChange={(e) => setFormData({ ...formData, gumroadCodeUrl: e.target.value })}
                placeholder="https://test.checkout.dodopayments.com/buy/pdt_0NpnXGSoBzU3ztUxa9h5n?quantity=1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* $19/mo Starter Discord Bot */}
            <div>
              <label className="block text-slate-400 mb-1">
                $19/mo Discord Deal Bot Subscription URL (Dodo Payments):
              </label>
              <input
                type="url"
                required
                value={formData.starterSubUrl}
                onChange={(e) => setFormData({ ...formData, starterSubUrl: e.target.value })}
                placeholder="https://test.checkout.dodopayments.com/buy/pdt_0NpnYBGFkhOaO65vHovK2?quantity=1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* $149/mo Pro API */}
            <div>
              <label className="block text-slate-400 mb-1">
                $149/mo Pro API & Enterprise Checkout URL (Dodo Payments):
              </label>
              <input
                type="url"
                required
                value={formData.proSubUrl}
                onChange={(e) => setFormData({ ...formData, proSubUrl: e.target.value })}
                placeholder="https://test.checkout.dodopayments.com/buy/pdt_0NpnYry8pi8ku5qPC9aMS?quantity=1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Section: Affiliate Tracking Parameters */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-slate-300 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              2. Deal Storefront Affiliate Tags
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  Affiliate Track Parameter (?aff_track=):
                </label>
                <input
                  type="text"
                  required
                  value={formData.affiliateTag}
                  onChange={(e) => setFormData({ ...formData, affiliateTag: e.target.value })}
                  placeholder="pricepulse"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  UTM Source Parameter (?utm_source=):
                </label>
                <input
                  type="text"
                  required
                  value={formData.utmSource}
                  onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                  placeholder="pricepulse"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="text-slate-300 font-semibold block">Live Output Preview:</span>
              <p className="text-emerald-400 font-mono break-all text-[10px]">
                https://www.cheapshark.com/redirect?dealID=abc123&aff_track=
                <span className="font-bold underline">{formData.affiliateTag || 'pricepulse'}</span>
                &utm_source=
                <span className="font-bold underline">{formData.utmSource || 'pricepulse'}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-950"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
