/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RawScrapePayload, 
  NormalizedProductionPayload, 
  PipelineMetrics 
} from './types/pipeline';
import { normalizePriceScrape } from './services/normalizer';
import { generateRandomScrapePayload, PRESET_TEST_CASES } from './services/mockFeed';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { PipelineFlow } from './components/PipelineFlow';
import { StreamFeed } from './components/StreamFeed';
import { PayloadInspector } from './components/PayloadInspector';
import { FastApiExplorer } from './components/FastApiExplorer';
import { ManualPlayground } from './components/ManualPlayground';
import { DevMarginSimulator } from './components/DevMarginSimulator';
import { PredictiveRadar } from './components/PredictiveRadar';
import { ApiDocsModal } from './components/ApiDocsModal';
import { AlertsTab } from './components/AlertsTab';
import { RegulatoryFilingsTab } from './components/RegulatoryFilingsTab';
import { CommercialPortalTab } from './components/CommercialPortalTab';
import { ToastBanner } from './components/ToastBanner';
import { SimpleStorefrontTab } from './components/SimpleStorefrontTab';
import { ScamCheckerTab } from './components/ScamCheckerTab';
import { SoftwareSalesTab } from './components/SoftwareSalesTab';
import { SettingsModal } from './components/SettingsModal';
import { AffiliateSettings } from './types/storefront';
import { DEFAULT_AFFILIATE_SETTINGS } from './services/cheapSharkService';
import { RevenueMilestone, AlertNotification } from './types/alerts';

const INITIAL_MILESTONES: RevenueMilestone[] = [
  {
    id: 'm_500',
    threshold_usd: 500,
    label: '$500 Pipeline Genesis',
    tier: 'bronze',
    description: 'Initial pipeline developer royalty threshold crossed',
    is_triggered: false,
  },
  {
    id: 'm_1000',
    threshold_usd: 1000,
    label: '$1,000 Four-Figure Guardian',
    tier: 'bronze',
    description: 'Protected four-figure milestone in developer payouts',
    is_triggered: false,
  },
  {
    id: 'm_2500',
    threshold_usd: 2500,
    label: '$2,500 Indie Studio Benchmark',
    tier: 'silver',
    description: 'Equivalent to full launch cycle indie revenue',
    is_triggered: false,
  },
  {
    id: 'm_5000',
    threshold_usd: 5000,
    label: '$5,000 Commercial Scaler',
    tier: 'silver',
    description: 'High-throughput cross-platform syndicated royalties',
    is_triggered: false,
  },
  {
    id: 'm_10000',
    threshold_usd: 10000,
    label: '$10,000 Major Publisher Payout',
    tier: 'gold',
    description: 'Enterprise commercial distribution scale reached',
    is_triggered: false,
  },
  {
    id: 'm_25000',
    threshold_usd: 25000,
    label: '$25,000 Ecosystem Fortress',
    tier: 'platinum',
    description: 'Large-scale publisher protection & revenue realization',
    is_triggered: false,
  },
  {
    id: 'm_50000',
    threshold_usd: 50000,
    label: '$50,000 AAA Sovereign Royalty',
    tier: 'diamond',
    description: 'Tier-1 commercial syndication milestone achieved',
    is_triggered: false,
  },
];

export default function App() {
  // View mode: 'simple' (default for 5-second newcomer clarity) vs 'pro' (for dev/fund inspection)
  const [viewMode, setViewMode] = useState<'simple' | 'pro'>('simple');
  const [activeTab, setActiveTab] = useState<string>('simple_deals');

  // Streaming controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(1000);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Affiliate & checkout settings
  const [affiliateSettings, setAffiliateSettings] = useState<AffiliateSettings>(() => {
    try {
      const saved = localStorage.getItem('pricepulse_affiliate_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure any old placeholder URLs are replaced with the permanent Dodo Payments links
        const hasLegacyPlaceholders =
          !parsed.gumroadCodeUrl ||
          parsed.gumroadCodeUrl.includes('gumroad.com/l/pricepulse-source') ||
          !parsed.starterSubUrl ||
          parsed.starterSubUrl.includes('test_pricepulse_starter_19') ||
          !parsed.proSubUrl ||
          parsed.proSubUrl.includes('test_pricepulse_enterprise_149');

        if (hasLegacyPlaceholders) {
          const merged: AffiliateSettings = {
            ...DEFAULT_AFFILIATE_SETTINGS,
            ...parsed,
            gumroadCodeUrl: DEFAULT_AFFILIATE_SETTINGS.gumroadCodeUrl,
            starterSubUrl: DEFAULT_AFFILIATE_SETTINGS.starterSubUrl,
            proSubUrl: DEFAULT_AFFILIATE_SETTINGS.proSubUrl,
          };
          localStorage.setItem('pricepulse_affiliate_settings', JSON.stringify(merged));
          return merged;
        }
        return {
          ...DEFAULT_AFFILIATE_SETTINGS,
          ...parsed,
        };
      }
    } catch (e) {
      console.warn('Failed to load affiliate settings from localStorage:', e);
    }
    return DEFAULT_AFFILIATE_SETTINGS;
  });

  // Scam checker target query
  const [scamCheckerQuery, setScamCheckerQuery] = useState<string>('ELDEN RING');

  // Milestone alerts and thresholds
  const [milestones, setMilestones] = useState<RevenueMilestone[]>(INITIAL_MILESTONES);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [activeToasts, setActiveToasts] = useState<AlertNotification[]>([]);

  // Initial seed events from preset test cases
  const [events, setEvents] = useState<NormalizedProductionPayload[]>(() => {
    return PRESET_TEST_CASES.map((tc) => normalizePriceScrape(tc.payload));
  });

  const [selectedPayload, setSelectedPayload] = useState<NormalizedProductionPayload | null>(() => {
    return events.length > 0 ? events[0] : null;
  });

  // Calculate live cumulative metrics
  const [metrics, setMetrics] = useState<PipelineMetrics>({
    total_ingested: PRESET_TEST_CASES.length,
    total_normalized: PRESET_TEST_CASES.length,
    deceptive_discounts_flagged: 1,
    all_time_lows_detected: 2,
    grey_market_blocked: 1,
    total_dev_revenue_protected_usd: 1240.5,
    avg_latency_ms: 3.4,
  });

  // Ref to access current milestones and metrics without restarting interval
  const milestonesRef = useRef(milestones);
  milestonesRef.current = milestones;
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

  // Save affiliate settings to localStorage
  const handleSaveSettings = (newSettings: AffiliateSettings) => {
    setAffiliateSettings(newSettings);
    try {
      localStorage.setItem('pricepulse_affiliate_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  // Toggle View Mode
  const handleToggleViewMode = (newMode: 'simple' | 'pro') => {
    setViewMode(newMode);
    if (newMode === 'simple') {
      if (!['simple_deals', 'simple_scam_checker', 'simple_software_sales'].includes(activeTab)) {
        setActiveTab('simple_deals');
      }
    } else {
      if (['simple_deals', 'simple_scam_checker', 'simple_software_sales'].includes(activeTab)) {
        setActiveTab('live_stream');
      }
    }
  };

  // Check and trigger milestone alerts
  const checkMilestones = useCallback((currentRev: number) => {
    const currentMilestones = milestonesRef.current;
    const newlyTriggered: RevenueMilestone[] = [];

    const updatedMilestones = currentMilestones.map((m) => {
      if (!m.is_triggered && currentRev >= m.threshold_usd) {
        newlyTriggered.push(m);
        return {
          ...m,
          is_triggered: true,
          triggered_at: new Date().toISOString(),
        };
      }
      return m;
    });

    if (newlyTriggered.length > 0) {
      setMilestones(updatedMilestones);

      const newNotifs: AlertNotification[] = newlyTriggered.map((m) => ({
        id: `notif_${m.id}_${Date.now()}`,
        milestone_id: m.id,
        threshold_usd: m.threshold_usd,
        title: `Milestone Crossed: ${m.label}`,
        message: `Total protected developer royalties reached $${currentRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`,
        timestamp: new Date().toISOString(),
        type: 'milestone_unlocked',
        read: false,
      }));

      setNotifications((prev) => [...newNotifs, ...prev]);
      setActiveToasts((prev) => [...newNotifs, ...prev].slice(0, 3));
    }
  }, []);

  // Process a single scraped payload through pipeline
  const processNewScrape = useCallback((raw: RawScrapePayload) => {
    const normalized = normalizePriceScrape(raw);

    setEvents((prev) => [normalized, ...prev.slice(0, 49)]);

    setMetrics((prev) => {
      const devRevAdded = normalized.store_integrity.developer_net_payout;
      const isDeceptive = normalized.pricing.is_deceptive_discount ? 1 : 0;
      const isAtl = normalized.all_time_low.is_all_time_low ? 1 : 0;
      const isGrey = normalized.store_integrity.retailer_category === 'unauthorized_grey_market' ? 1 : 0;
      const newRev = prev.total_dev_revenue_protected_usd + devRevAdded;

      checkMilestones(newRev);

      return {
        total_ingested: prev.total_ingested + 1,
        total_normalized: prev.total_normalized + 1,
        deceptive_discounts_flagged: prev.deceptive_discounts_flagged + isDeceptive,
        all_time_lows_detected: prev.all_time_lows_detected + isAtl,
        grey_market_blocked: prev.grey_market_blocked + isGrey,
        total_dev_revenue_protected_usd: newRev,
        avg_latency_ms: +(3.0 + Math.random() * 1.5).toFixed(1),
      };
    });
  }, [checkMilestones]);

  // Main streaming loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const raw = generateRandomScrapePayload();
      processNewScrape(raw);
    }, speedMs);

    return () => clearInterval(interval);
  }, [isRunning, speedMs, processNewScrape]);

  const handleStepOnce = () => {
    const raw = generateRandomScrapePayload();
    processNewScrape(raw);
  };

  const handleReset = () => {
    const initialEvents = PRESET_TEST_CASES.map((tc) => normalizePriceScrape(tc.payload));
    setEvents(initialEvents);
    setSelectedPayload(initialEvents[0]);
    setMetrics({
      total_ingested: PRESET_TEST_CASES.length,
      total_normalized: PRESET_TEST_CASES.length,
      deceptive_discounts_flagged: 1,
      all_time_lows_detected: 2,
      grey_market_blocked: 1,
      total_dev_revenue_protected_usd: 1240.5,
      avg_latency_ms: 3.2,
    });
  };

  const handleAddMilestone = (threshold: number, label: string) => {
    const newId = `m_${threshold}_${Date.now()}`;
    const newM: RevenueMilestone = {
      id: newId,
      threshold_usd: threshold,
      label: label || `$${threshold.toLocaleString()} Custom Target`,
      tier: threshold >= 25000 ? 'platinum' : threshold >= 10000 ? 'gold' : threshold >= 2500 ? 'silver' : 'bronze',
      description: `User-defined milestone target for $${threshold.toLocaleString()}`,
      is_triggered: metrics.total_dev_revenue_protected_usd >= threshold,
      triggered_at: metrics.total_dev_revenue_protected_usd >= threshold ? new Date().toISOString() : undefined,
    };
    setMilestones((prev) => [...prev, newM].sort((a, b) => a.threshold_usd - b.threshold_usd));
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleResetMilestones = () => {
    setMilestones(INITIAL_MILESTONES);
    setNotifications([]);
    setActiveToasts([]);
  };

  const handleTriggerTestAlert = (threshold: number, label: string) => {
    const testNotif: AlertNotification = {
      id: `test_${Date.now()}`,
      milestone_id: 'test_manual',
      threshold_usd: threshold,
      title: `[TEST ALERT] ${label}`,
      message: `Manual milestone simulation triggered for $${threshold.toLocaleString()} threshold.`,
      timestamp: new Date().toISOString(),
      type: 'milestone_unlocked',
      read: false,
    };

    setNotifications((prev) => [testNotif, ...prev]);
    setActiveToasts((prev) => [testNotif, ...prev].slice(0, 3));
  };

  const handleDismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const streamRateStr = isRunning 
    ? speedMs === 300 ? '3.3 ev/s' : speedMs === 1000 ? '1.0 ev/s' : '0.4 ev/s'
    : 'PAUSED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header with Simple vs Pro Mode Switcher & Settings */}
      <Header
        isRunning={isRunning}
        onToggleRun={() => setIsRunning((prev) => !prev)}
        speedMs={speedMs}
        onChangeSpeed={setSpeedMs}
        onStepOnce={handleStepOnce}
        onReset={handleReset}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={notifications.length}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ========================================================================= */}
        {/* SIMPLE VIEW MODE (3 Clean Tabs Only: Free Storefront, Anti-Scam, Sales)  */}
        {/* ========================================================================= */}
        {viewMode === 'simple' && (
          <div>
            {/* Simple Tab 1: Live Game Deals (Free Storefront) */}
            {activeTab === 'simple_deals' && (
              <SimpleStorefrontTab
                affiliateSettings={affiliateSettings}
                onNavigateToScamChecker={(gameTitle) => {
                  if (gameTitle) setScamCheckerQuery(gameTitle);
                  setActiveTab('simple_scam_checker');
                }}
                onNavigateToSoftwareSales={() => setActiveTab('simple_software_sales')}
              />
            )}

            {/* Simple Tab 2: Fake Discount & Scam Checker */}
            {activeTab === 'simple_scam_checker' && (
              <ScamCheckerTab
                initialQuery={scamCheckerQuery}
                affiliateSettings={affiliateSettings}
                onNavigateToDeals={() => setActiveTab('simple_deals')}
              />
            )}

            {/* Simple Tab 3: Buy This Software & Pro Access ($99 Storefront) */}
            {activeTab === 'simple_software_sales' && (
              <SoftwareSalesTab
                affiliateSettings={affiliateSettings}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onSwitchToProView={() => handleToggleViewMode('pro')}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRO TERMINAL VIEW (Full 6-Stage Telemetry, SEC EDGAR, Alerts, Simulator)  */}
        {/* ========================================================================= */}
        {viewMode === 'pro' && (
          <div className="space-y-6">
            {/* KPI Strip with CSV Export Button */}
            <MetricsBar 
              metrics={metrics} 
              streamRateStr={streamRateStr} 
              events={events} 
            />

            {/* Pipeline Architecture Flow */}
            <PipelineFlow />

            {/* Pro Tab 1: Realtime Pipeline Feed */}
            {activeTab === 'live_stream' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                  <StreamFeed
                    events={events}
                    onSelectEvent={(ev) => setSelectedPayload(ev)}
                    selectedEventId={selectedPayload?.record_id}
                  />
                </div>
                <div className="lg:col-span-5 sticky top-24">
                  <PayloadInspector payload={selectedPayload} />
                </div>
              </div>
            )}

            {/* Pro Tab 2: Commercial Architecture & Monetization Engine */}
            {activeTab === 'commercial_portal' && <CommercialPortalTab />}

            {/* Pro Tab 3: Regulatory Filings (SEC EDGAR Feed) */}
            {activeTab === 'regulatory_filings' && <RegulatoryFilingsTab />}

            {/* Pro Tab 4: Milestone Alerts Center */}
            {activeTab === 'alerts' && (
              <AlertsTab
                currentRevenueProtected={metrics.total_dev_revenue_protected_usd}
                milestones={milestones}
                onAddMilestone={handleAddMilestone}
                onRemoveMilestone={handleRemoveMilestone}
                onResetMilestones={handleResetMilestones}
                onTriggerTestAlert={handleTriggerTestAlert}
                notifications={notifications}
                onClearNotifications={() => setNotifications([])}
              />
            )}

            {/* Pro Tab 5: FastAPI & Redis Microservice Console */}
            {activeTab === 'fastapi_service' && <FastApiExplorer />}

            {/* Pro Tab 6: Playground & Ingestion Lab */}
            {activeTab === 'playground' && (
              <ManualPlayground
                onOutputGenerated={(output) => {
                  setSelectedPayload(output);
                }}
              />
            )}

            {/* Pro Tab 7: Developer Revenue Simulator & 10-Minute Activity Chart */}
            {activeTab === 'dev_margins' && (
              <DevMarginSimulator 
                events={events} 
                totalDevRevenue={metrics.total_dev_revenue_protected_usd} 
              />
            )}

            {/* Pro Tab 8: Sale Cadence & ATL Radar */}
            {activeTab === 'predictive_radar' && <PredictiveRadar />}
          </div>
        )}
      </main>

      {/* Floating Visual Toast Notification Banner */}
      <ToastBanner
        notifications={activeToasts}
        onDismiss={handleDismissToast}
        onNavigateToAlerts={() => {
          setViewMode('pro');
          setActiveTab('alerts');
        }}
      />

      {/* Settings Modal (Gear Icon) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={affiliateSettings}
        onSave={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">PricePulse Engine</span>
            <span>·</span>
            <span className="text-emerald-400">100% Authorized Distributor Syndication</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => handleToggleViewMode(viewMode === 'simple' ? 'pro' : 'simple')}
              className="text-slate-400 hover:text-white underline"
            >
              Switch to {viewMode === 'simple' ? 'Pro Terminal View' : 'Simple Storefront'}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-400 hover:text-emerald-400"
            >
              Affiliate &amp; Checkout Setup
            </button>
          </div>
        </div>
      </footer>

      {/* B2B API Specs Modal */}
      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />
    </div>
  );
}
