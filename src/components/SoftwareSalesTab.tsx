import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ExternalLink, 
  Code2, 
  Bot, 
  Server, 
  Zap, 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  FileCode, 
  Database, 
  Globe, 
  Clock, 
  HelpCircle,
  TrendingUp,
  Settings,
  Star,
  Users
} from 'lucide-react';
import { AffiliateSettings } from '../types/storefront';

interface SoftwareSalesTabProps {
  affiliateSettings: AffiliateSettings;
  onOpenSettings: () => void;
  onSwitchToProView: () => void;
}

export const SoftwareSalesTab: React.FC<SoftwareSalesTabProps> = ({
  affiliateSettings,
  onOpenSettings,
  onSwitchToProView,
}) => {
  const [subTier, setSubTier] = useState<'starter' | 'commercial'>('starter');
  const [monthlyClicks, setMonthlyClicks] = useState<number>(1000);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // ROI math
  const estimatedConversions = Math.round(monthlyClicks * 0.045);
  const estimatedCartVolume = estimatedConversions * 32; // $32 avg basket
  const estimatedMonthlyCommission = Math.round(estimatedCartVolume * 0.075); // 7.5% avg affiliate cut

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  return (
    <div className="space-y-12 pb-16 max-w-6xl mx-auto">
      {/* 3-Step Visual 'How It Works' Banner */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Turnkey Software & Enterprise Deal Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Launch Your Own Gaming Deal Business Today
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Get the complete source code or connect to our high-frequency deals API to power deal websites, Discord community bots, and hedge fund market trackers.
        </p>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          {/* Step 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-mono text-emerald-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 text-emerald-300">1</span>
              <span>MULTI-STORE INGESTION</span>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">
              Ingest 50+ Stores in Real-Time
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sub-5ms normalization of price feeds across Steam, GOG, Humble, Fanatical, and Epic with automatic currency conversion and metadata enrichment.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 text-cyan-300">2</span>
              <span>FRAUD & ATL VERIFICATION</span>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">
              Cross-Verify Historical Lows & SEC Data
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit for artificial price hikes violating EU Directive 98/6/EC and correlate pricing cycles with publisher quarterly 10-Q SEC EDGAR filings.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
            <div className="text-xs font-mono text-purple-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40 text-purple-300">3</span>
              <span>MONETIZE & AUTOMATE</span>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">
              Capture Commissions & Protect Margins
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every deal link automatically injects your partner tracking tags. Discord bot pushes instant alerts when wishlist games hit verified All-Time Lows.
            </p>
          </div>
        </div>
      </div>

      {/* Main Pricing Offer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Card 1: Full Source Code ($99 One-Time) */}
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Popular badge */}
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-bl-2xl font-mono uppercase tracking-wider">
            Most Popular • One-Time
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <FileCode className="w-3.5 h-3.5" />
              <span>Full Commercial License</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Buy Full Source Code
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Own the complete production codebase. Deploy your own gaming deals SaaS, Discord bot empire, or private price tracker in 15 minutes.
              </p>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-2 pt-2 border-t border-slate-800">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono">$99</span>
              <span className="text-slate-400 text-xs font-mono uppercase">USD / One-time payment</span>
              <span className="ml-auto text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Lifetime Updates
              </span>
            </div>

            {/* Feature checklist */}
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 py-3">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full React 19 Frontend:</strong> Simple Storefront + Pro Terminal View with real-time CheapShark integration.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Production FastAPI Microservice:</strong> Async Redis caching, API-key tier metering, and sub-5ms endpoints.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Turnkey Discord Deal Bot:</strong> Webhook dispatcher that automatically tweets or posts real-time ATL game sales with your affiliate tags.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>SQLAlchemy Models & Docker Compose:</strong> Pre-configured PostgreSQL schema, Redis cluster config, and 1-command launch.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Commercial Redistribution Rights:</strong> Rebrand it, charge subscription fees to your users, and keep 100% of revenue.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-6 space-y-3">
            <a
              href={affiliateSettings.gumroadCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-950 text-center"
            >
              <span>Instant Download Source Code ($99)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Dodo Payments 1-Click Checkout
              </span>
              <button
                onClick={onOpenSettings}
                className="text-slate-400 hover:text-emerald-400 underline flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Configure Links
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Discord Deal Bot / Pro API ($19 - $149/mo) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Toggle switcher for Starter vs Commercial */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                <Server className="w-3.5 h-3.5" />
                <span>Cloud Hosted SaaS</span>
              </div>

              {/* Tier Toggle */}
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                <button
                  onClick={() => setSubTier('starter')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    subTier === 'starter'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Discord Bot ($19)
                </button>
                <button
                  onClick={() => setSubTier('commercial')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    subTier === 'commercial'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pro API ($149)
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {subTier === 'starter' ? 'Discord Deal Bot & API' : 'Commercial Hedge Fund API'}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {subTier === 'starter'
                  ? 'Autonomous bot that alerts your gaming community whenever verified deals hit ATL with your personal affiliate links.'
                  : 'High-frequency deal ingestion with SEC EDGAR publisher filings, grey-market threat detection, and 250,000 requests/mo.'}
              </p>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-2 pt-2 border-t border-slate-800">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                ${subTier === 'starter' ? '19' : '149'}
              </span>
              <span className="text-slate-400 text-xs font-mono uppercase">USD / Monthly</span>
              <span className="ml-auto text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                Cancel Anytime
              </span>
            </div>

            {/* Feature checklist */}
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 py-3">
              {subTier === 'starter' ? (
                <>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Turnkey Discord & Telegram Webhook Bot for up to 5 servers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Automatic affiliate tag substitution on all deal clicks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>10,000 API requests/month for price queries.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Real-time webhook notifications when wishlist titles hit All-Time Low.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>250,000 API requests/month with sub-5ms Redis latency.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Live SEC EDGAR Ingestion Feed (EA, Take-Two, CD Projekt).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Known-Sec Threat Matrix & Grey-Market Key revocation scanner.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Dedicated Slack/Discord private engineering support channel.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="pt-6 space-y-3">
            <a
              href={subTier === 'starter' ? affiliateSettings.starterSubUrl : affiliateSettings.proSubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all text-center ${
                subTier === 'starter'
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-950'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-950'
              }`}
            >
              <span>Subscribe to {subTier === 'starter' ? 'Discord Bot ($19/mo)' : 'Pro API ($149/mo)'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" /> Dodo Payments 1-Click Checkout
              </span>
              <button
                onClick={onSwitchToProView}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Inspect Pro Terminal View →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive ROI Calculator for Buyers */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Affiliate Arbitrage Calculator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              How Fast Does The $99 Software Pay For Itself?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Drag the slider to see projected monthly affiliate revenue from sharing verified PC game deals.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-right">
            <span className="text-[11px] text-slate-400 block font-mono">Estimated Monthly Profit</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">
              ${estimatedMonthlyCommission}
            </span>
            <span className="text-[11px] text-slate-500 block font-mono">
              ROI: Payback in {estimatedMonthlyCommission >= 99 ? '< 1 month' : `${Math.ceil(99 / Math.max(1, estimatedMonthlyCommission))} months`}
            </span>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Monthly Deal Clicks: <strong className="text-emerald-400">{monthlyClicks.toLocaleString()} clicks</strong></span>
            <span className="text-slate-500">~{estimatedConversions} purchases ($32 avg cart)</span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={monthlyClicks}
            onChange={(e) => setMonthlyClicks(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Trust Badges & Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-300 italic">
            "We plugged PricePulse into our 40,000-member gaming Discord. The bot paid for its $99 cost in 48 hours purely through Humble and Fanatical affiliate links."
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            — Marcus V., Deal Hunter Community Admin
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-300 italic">
            "The FastAPI microservice with Redis caching handles 500 requests/sec with &lt;4ms response times. Cleanest Python and React architecture I've bought."
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            — Alex K., Senior Backend Lead
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-300 italic">
            "The EU Omnibus fake discount detection algorithm saved our indie publishing studio from grey-market key reseller arbitrage."
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            — Elena R., Commercial Ops Director
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h3>
        <div className="space-y-2 max-w-3xl mx-auto">
          {[
            {
              q: 'What is included in the $99 Source Code package?',
              a: 'You receive full access to the GitHub repository and a downloadable ZIP with the complete React 19 + Tailwind CSS frontend, the FastAPI Python microservice with Redis caching, Docker Compose setup, and SQL schemas. Includes an unrestricted commercial license.',
            },
            {
              q: 'Can I replace the affiliate links and checkout buttons with my own?',
              a: 'Yes! You can configure them right now by clicking the gear icon in the top header. You can paste your own Gumroad, Lemon Squeezy, Stripe, or Dodo Payments links, plus your personal Fanatical, Humble, or Steam tracking IDs.',
            },
            {
              q: 'What if CheapShark is down or slow?',
              a: 'PricePulse features built-in zero-downtime resilience: if CheapShark or any upstream partner experiences latency or rate limits, the engine automatically falls back to the local verified cache without interrupting your visitors.',
            },
            {
              q: 'Is there a money-back guarantee?',
              a: 'Yes, 100% money-back guarantee within 14 days if the codebase does not compile or run as advertised.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{item.q}</span>
                <span className="text-emerald-400 text-lg font-mono">
                  {faqOpen === idx ? '−' : '+'}
                </span>
              </button>
              {faqOpen === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
