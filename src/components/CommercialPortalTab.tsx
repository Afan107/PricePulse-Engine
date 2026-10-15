import React, { useState } from 'react';
import { 
  DollarSign, 
  Coins, 
  Share2, 
  Key, 
  Bell, 
  ShieldCheck, 
  Check, 
  Copy, 
  ExternalLink, 
  Zap, 
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Sliders,
  Sparkles,
  Database,
  Code,
  Bot,
  Workflow,
  BarChart3,
  Server
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  requestQuota: string;
  targetAudience: string;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'hobby',
    name: 'Hobbyist / Indie Dev',
    priceMonthly: 0,
    requestQuota: '25,000 req/mo',
    targetAudience: 'Side projects & hobby bots',
    features: [
      'Core price normalization API',
      'Redis sub-5ms cached deals',
      'Rate limit: 25k requests/mo',
      'Community Discord support',
    ],
    ctaLabel: 'Active Free Key',
  },
  {
    id: 'pro_developer',
    name: 'Commercial API Pro',
    priceMonthly: 149,
    requestQuota: '250,000 req/mo',
    targetAudience: 'Gaming apps, browser extensions, price comparators',
    features: [
      '250,000 requests/month quota',
      'Real-time All-Time Low (ATL) webhook stream',
      'Deceptive discount & MSRP fraud audit',
      'Developer cut analytics (Steam, Epic 88%, GOG)',
      '99.95% SLA & dedicated support',
    ],
    ctaLabel: 'Upgrade to Pro ($149/mo)',
    popular: true,
  },
  {
    id: 'publisher_saas',
    name: 'Publisher Anti-Fraud SaaS',
    priceMonthly: 999,
    requestQuota: '2,500,000 req/mo',
    targetAudience: 'AA & AAA Game Publishers, Indie Distributors',
    features: [
      '2.5M requests/month quota',
      'Automated Grey-Market (G2A/Kinguin) key theft surveillance',
      'EU Omnibus Directive 30-day prior price compliance engine',
      'Instant key revocation advisory alerts',
      'Custom webhook destinations for internal fraud teams',
    ],
    ctaLabel: 'Start Publisher Plan ($999/mo)',
  },
  {
    id: 'institutional_edgar',
    name: 'Hedge Fund & Equity Intel',
    priceMonthly: 4999,
    requestQuota: 'Unlimited Real-Time',
    targetAudience: 'Quantitative hedge funds, equity analysts, market makers',
    features: [
      'Unlimited high-frequency ingestion stream',
      'Live SEC EDGAR 10-K/10-Q XBRL financial parser',
      'Publisher sell-through velocity & digital net bookings models',
      'Historical discount elasticity datasets (CSV/Parquet export)',
      'Direct WebSocket / SSE feed with 99.999% uptime SLA',
    ],
    ctaLabel: 'Contact Institutional Sales',
  },
];

export const CommercialPortalTab: React.FC = () => {
  // Simulator state
  const [proSubscribers, setProSubscribers] = useState<number>(35);
  const [publisherSubscribers, setPublisherSubscribers] = useState<number>(8);
  const [institutionalSubscribers, setInstitutionalSubscribers] = useState<number>(2);
  const [monthlyAffiliateClicks, setMonthlyAffiliateClicks] = useState<number>(45000);
  const [webhookSubscribers, setWebhookSubscribers] = useState<number>(60);

  // Affiliate tag state
  const [fanaticalTag, setFanaticalTag] = useState<string>('pricepulse');
  const [humbleTag, setHumbleTag] = useState<string>('pricepulse_deal');
  const [epicCreatorCode, setEpicCreatorCode] = useState<string>('PRICEPULSE_B2B');
  const [sampleGameUrl, setSampleGameUrl] = useState<string>('https://www.fanatical.com/en/game/baldurs-gate-3');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Revenue Math
  const apiMrr = (proSubscribers * 149) + (publisherSubscribers * 999) + (institutionalSubscribers * 4999);
  // Affiliate estimate: 3.5% conversion rate on clicks, $28 average basket size, 7% average storefront commission
  const affiliateConversions = monthlyAffiliateClicks * 0.035;
  const affiliateGrossSales = affiliateConversions * 28.00;
  const affiliateMonthlyCommission = affiliateGrossSales * 0.07;
  // Webhook MRR ($19/mo per gaming community / Discord bot)
  const webhookMrr = webhookSubscribers * 19;

  const totalMrr = apiMrr + affiliateMonthlyCommission + webhookMrr;
  const totalArr = totalMrr * 12;

  const generateAffiliateUrl = (rawUrl: string): string => {
    if (rawUrl.includes('fanatical.com')) {
      return `${rawUrl}?aff_track=${fanaticalTag}&utm_source=pricepulse`;
    }
    if (rawUrl.includes('humblebundle.com')) {
      return `${rawUrl}?partner=${humbleTag}`;
    }
    if (rawUrl.includes('epicgames.com')) {
      return `${rawUrl}?epic_creator_id=${epicCreatorCode}`;
    }
    return `${rawUrl}?ref=pricepulse`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generateAffiliateUrl(sampleGameUrl));
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Commercial Architecture &amp; Monetization Engine
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PricePulse Engine converts high-throughput market normalization into 4 lucrative B2B &amp; B2C revenue streams: metered API subscriptions, digital affiliate arbitrage, automated deal webhooks, and publisher anti-fraud SaaS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Stream Monetization Ready</span>
            </span>
          </div>
        </div>

        {/* 4 Core Monetization Vectors KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Stream 1: B2B API Subscriptions
            </span>
            <div className="text-base font-bold text-emerald-400">
              $149 – $4,999 <span className="text-xs font-normal text-slate-400">/ mo</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Metered Redis quota keys (Hobby to Enterprise)
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Stream 2: Storefront Affiliates
            </span>
            <div className="text-base font-bold text-cyan-400">
              5% – 10% <span className="text-xs font-normal text-slate-400">commission</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Humble, Fanatical, Green Man Gaming, Epic
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Stream 3: Webhook Deal Feeds
            </span>
            <div className="text-base font-bold text-purple-400">
              $19 – $49 <span className="text-xs font-normal text-slate-400">/ bot / mo</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Real-time Discord/Telegram ATL break alerts
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Stream 4: Publisher Fraud SaaS
            </span>
            <div className="text-base font-bold text-amber-400">
              $999 <span className="text-xs font-normal text-slate-400">/ studio / mo</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Anti-grey market &amp; EU Omnibus compliance
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Monthly Revenue Simulator (MRR & ARR Calculator) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-slate-100 text-xs">
              Interactive Recurring Revenue (MRR / ARR) Projection Simulator
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-500 block">Projected MRR:</span>
              <strong className="text-sm text-emerald-400 font-mono">
                ${totalMrr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / mo
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Annualized Run Rate (ARR):</span>
              <strong className="text-sm text-cyan-400 font-mono">
                ${totalArr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / yr
              </strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Slider 1: Pro API Users */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Commercial Pro APIs ($149):</span>
              <strong className="text-emerald-400">{proSubscribers} clients</strong>
            </div>
            <input
              type="range"
              min={0}
              max={250}
              step={5}
              value={proSubscribers}
              onChange={(e) => setProSubscribers(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>0</span>
              <span>MRR: ${(proSubscribers * 149).toLocaleString()}</span>
              <span>250</span>
            </div>
          </div>

          {/* Slider 2: Publisher SaaS Clients */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Publisher SaaS ($999):</span>
              <strong className="text-amber-400">{publisherSubscribers} studios</strong>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={publisherSubscribers}
              onChange={(e) => setPublisherSubscribers(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>0</span>
              <span>MRR: ${(publisherSubscribers * 999).toLocaleString()}</span>
              <span>40</span>
            </div>
          </div>

          {/* Slider 3: Hedge Funds */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Hedge Funds ($4,999):</span>
              <strong className="text-purple-400">{institutionalSubscribers} funds</strong>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={institutionalSubscribers}
              onChange={(e) => setInstitutionalSubscribers(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>0</span>
              <span>MRR: ${(institutionalSubscribers * 4999).toLocaleString()}</span>
              <span>10</span>
            </div>
          </div>

          {/* Slider 4: Monthly Outbound Affiliate Clicks */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Monthly Affiliate Clicks:</span>
              <strong className="text-cyan-400">{(monthlyAffiliateClicks / 1000).toFixed(0)}k clicks</strong>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={5000}
              value={monthlyAffiliateClicks}
              onChange={(e) => setMonthlyAffiliateClicks(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>5k</span>
              <span>Est: ${Math.round(affiliateMonthlyCommission).toLocaleString()}/mo</span>
              <span>250k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers Packaging Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Commercial API Subscription Packaging</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Backed by Redis monthly quota metering
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-4 rounded-lg border flex flex-col justify-between font-mono text-xs ${
                tier.popular
                  ? 'bg-slate-900 border-emerald-500 shadow-lg relative'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                {tier.popular && (
                  <span className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    MOST POPULAR
                  </span>
                )}

                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  {tier.name}
                </div>

                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl font-bold text-slate-100">
                    ${tier.priceMonthly}
                  </span>
                  <span className="text-slate-500 text-[11px]">/ month</span>
                </div>

                <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-emerald-400 mb-3 font-semibold">
                  Quota: {tier.requestQuota}
                </div>

                <div className="text-[11px] text-slate-400 mb-3">
                  {tier.targetAudience}
                </div>

                <ul className="space-y-2 border-t border-slate-800/80 pt-3 text-[11px] text-slate-300">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  className={`w-full py-2 rounded text-xs font-bold transition-colors ${
                    tier.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {tier.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outbound Affiliate Link Monetization Engine */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-xs">
              Digital Retailer Affiliate Tagging Engine (Earn 5%–10% Per Sale)
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400">
            Auto-injects tracked partner IDs into authorized store links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Fanatical Affiliate Tag
            </span>
            <input
              type="text"
              value={fanaticalTag}
              onChange={(e) => setFanaticalTag(e.target.value)}
              className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 text-xs"
            />
            <span className="text-[10px] text-slate-500">7% commission on Steam key sales</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Humble Partner Code
            </span>
            <input
              type="text"
              value={humbleTag}
              onChange={(e) => setHumbleTag(e.target.value)}
              className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 text-xs"
            />
            <span className="text-[10px] text-slate-500">Up to 10% on Humble Store &amp; Bundles</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Epic Games Creator Tag
            </span>
            <input
              type="text"
              value={epicCreatorCode}
              onChange={(e) => setEpicCreatorCode(e.target.value)}
              className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 text-xs"
            />
            <span className="text-[10px] text-slate-500">5% revenue share on Epic Store purchases</span>
          </div>
        </div>

        {/* Live URL Transformer Simulator */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Live URL Attribution Transformer (Demo):
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={sampleGameUrl}
              onChange={(e) => setSampleGameUrl(e.target.value)}
              className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1 transition-colors shrink-0"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied Tagged Link' : 'Generate Monetized Link'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2 overflow-x-auto pt-1">
            <span className="text-slate-500">Resolved Output:</span>
            <code className="text-emerald-400 font-mono text-[10px] break-all">
              {generateAffiliateUrl(sampleGameUrl)}
            </code>
          </div>
        </div>
      </div>

      {/* Technical Engineering Roadmap: Exact Modifications to Monetize */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-slate-100 text-xs">
                Engineering Roadmap: Exact System Modifications to Generate Revenue
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              5 concrete architectural changes to transform the PricePulse pipeline into a revenue-generating commercial engine.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            Production Blueprint
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Card 1: Stripe & Redis Metering */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Stripe Metered Billing</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">
                  B2B SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Connect the FastAPI <code className="text-slate-300">RateLimitMiddleware</code> to Stripe Metering Events. When usage exceeds 25k (Hobby) or 250k (Pro), charge metered overages ($0.001/call) or prompt self-service card checkout.
              </p>
              <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                <div className="font-semibold text-emerald-400 mb-0.5">Required Code Modification:</div>
                <code>stripe.billing.meterEvents.create(event_name=&quot;api_call&quot;, customer_id=cust_id)</code>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
              <span>Potential Revenue:</span>
              <strong className="text-emerald-400">$3,500 – $15,000 / mo</strong>
            </div>
          </div>

          {/* Card 2: High-Speed Affiliate Redirector */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Sub-ID Affiliate Redirector</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                  Passive RevShare
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Add an asynchronous redirect endpoint <code className="text-slate-300">GET /r/&#123;deal_id&#125;</code> that generates affiliate links on the fly, logs click attribution in Redis, and redirects via HTTP 307 in &lt;2ms.
              </p>
              <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                <div className="font-semibold text-cyan-400 mb-0.5">Affiliate Networks to Integrate:</div>
                <span>Impact (Fanatical), CJ (Green Man Gaming), Humble Partner, Epic Creator.</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
              <span>Potential Revenue:</span>
              <strong className="text-cyan-400">$2,000 – $10,000 / mo</strong>
            </div>
          </div>

          {/* Card 3: Discord / Telegram Bot SaaS */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Turnkey Discord Bot SaaS</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold">
                  Community MRR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Create a turnkey Discord &amp; Telegram bot that automatically posts real-time ATL drops to gaming servers. Community owners pay $19/mo for custom filters, role pings, or branding.
              </p>
              <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                <div className="font-semibold text-purple-400 mb-0.5">Scale Vector:</div>
                <span>1,000 Discord servers × $19/mo = $19,000 MRR with zero additional scraping overhead.</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
              <span>Potential Revenue:</span>
              <strong className="text-purple-400">$5,000 – $20,000 / mo</strong>
            </div>
          </div>

          {/* Card 4: Publisher Anti-Fraud SaaS */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Publisher Anti-Fraud SaaS</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                  Enterprise B2B
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Package PricePulse as an MSRP &amp; grey-market monitor for game publishers. Alert studios whenever stolen keys appear on G2A/Kinguin or when retailers violate EU Omnibus 30-day prior pricing rules.
              </p>
              <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                <div className="font-semibold text-amber-400 mb-0.5">Commercial Offering:</div>
                <span>$999/month per game studio. 10 studios = $10,000 MRR ($120k ARR).</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
              <span>Potential Revenue:</span>
              <strong className="text-amber-400">$10,000 – $50,000 / mo</strong>
            </div>
          </div>

          {/* Card 5: Institutional Equity & AltData Feed */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                  <span>5. Institutional AltData Feed</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold">
                  Wall Street Quants
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Package normalized game sales velocity and SEC EDGAR cross-referenced publisher financial metrics as an alternative data feed for hedge funds trading EA, Take-Two, Sony, and Ubisoft stock.
              </p>
              <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                <div className="font-semibold text-rose-400 mb-0.5">Contract Size:</div>
                <span>AltData Bloomberg/FactSet syndications license at $2,500 – $5,000/mo per seat.</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
              <span>Potential Revenue:</span>
              <strong className="text-rose-400">$15,000 – $60,000 / mo</strong>
            </div>
          </div>

          {/* Card 6: Infrastructure Cost vs Profit Margin */}
          <div className="p-3.5 rounded bg-slate-950 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>6. Unit Economics &amp; Margin</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  &gt;90% Net Margin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Because Redis provides sub-5ms caching and data is normalized in-memory, serving 10,000,000 API queries costs only ~$85/month on Cloud Run + Redis Cloud.
              </p>
              <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Compute + Redis Cost:</span>
                  <span className="text-rose-400">~$120 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Monthly Revenue:</span>
                  <span className="text-emerald-400 font-bold">${Math.round(totalMrr).toLocaleString()} / mo</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400 font-semibold">Net Software Margin:</span>
                  <span className="text-cyan-400 font-bold">96.8%</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
              <span>Projected ARR:</span>
              <strong className="text-emerald-400">${Math.round(totalArr).toLocaleString()} / yr</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
