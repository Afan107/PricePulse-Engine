import { HistoricalPricingTrendAnalysis } from './historicalPricing';

export type StoreSlug = 
  | 'steam'
  | 'epic_games'
  | 'gog'
  | 'humble_store'
  | 'humble_direct'
  | 'fanatical'
  | 'xbox_store'
  | 'playstation_store'
  | 'green_man_gaming'
  | 'itch_io'
  | 'g2a'
  | 'kinguin'
  | 'eneba'
  | 'cdkeys';

export type RetailerCategory = 'first_party_platform' | 'authorized_reseller' | 'unauthorized_grey_market';

export interface RawScrapePayload {
  raw_id?: string;
  game_title: string;
  store: string;
  raw_price: string | number;
  raw_msrp?: string | number;
  currency?: string;
  historical_baseline_msrp?: number;
  lowest_recorded_history?: number;
  scrape_timestamp?: string;
  region?: string;
  sku?: string;
  seller_id?: string;
  seller_rating?: number;
  url?: string;
}

export type KnownSecurityThreatType = 
  | 'GREY_MARKET_KEY_RESALE'
  | 'DECEPTIVE_MSRP_INFLATION'
  | 'REGIONAL_CURRENCY_ARBITRAGE'
  | 'REVOKED_KEY_BATCH_EXPOSURE'
  | 'UNVERIFIED_MARKETPLACE_SELLER'
  | 'OMNIBUS_DIRECTIVE_VIOLATION';

export interface KnownSecurityAudit {
  security_status: 'PASSED' | 'SUSPICIOUS' | 'COMPROMISED';
  threat_score: number; // 0 - 100
  threat_level: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL';
  detected_threat_signatures: KnownSecurityThreatType[];
  security_advisory: string;
  is_quarantined: boolean;
  ssl_fingerprint_verified: boolean;
  developer_rev_secured: boolean;
}

export interface StoreIntegrity {
  store_name: string;
  store_slug: StoreSlug | string;
  retailer_category: RetailerCategory;
  is_authorized_store: boolean;
  developer_cut_percentage: number;
  platform_fee_percentage: number;
  developer_net_payout: number;
  risk_level: 'NONE' | 'LOW' | 'CRITICAL';
  exclusion_flags: string[];
}

export interface PricingAnalysis {
  normalized_msrp: number;
  normalized_current_price: number;
  currency: string;
  claimed_discount_percentage: number;
  true_discount_percentage: number;
  is_deceptive_discount: boolean;
  historical_baseline_msrp: number;
  msrp_elevation_delta: number;
  fraud_explanation?: string;
}

export interface AtlTelemetry {
  is_all_time_low: boolean;
  matches_all_time_low: boolean;
  lowest_recorded_history: number;
  margin_below_previous_atl: number;
  savings_vs_previous_atl_pct: number;
  previous_atl_date?: string;
  previous_atl_store?: string;
}

export type RecommendationSignal = 'BUY_NOW' | 'WAIT' | 'FAIR_VALUE';

export interface NextSaleWindow {
  event_name: string;
  platform: string;
  days_until_start: number;
  known_seconds_until_start: number; // Exact known seconds countdown
  expected_start_date: string;
  historical_avg_discount: number;
}

export interface PredictiveSignal {
  recommendation: RecommendationSignal;
  confidence_score: number;
  primary_reason: string;
  next_sale_window: NextSaleWindow;
  cadence_summary: string;
}

export interface NormalizedProductionPayload {
  schema_version: '2026.4.b2b';
  record_id: string;
  processed_at: string;
  pipeline_latency_ms: number;
  game_metadata: {
    canonical_title: string;
    normalized_sku: string;
    region: string;
  };
  pricing: PricingAnalysis;
  store_integrity: StoreIntegrity;
  known_security: KnownSecurityAudit; // Known Sec audit
  all_time_low: AtlTelemetry;
  predictive_analytics: PredictiveSignal;
  market_intelligence: {
    eligible_for_best_deal: boolean;
    recommended_channel: string;
    actionable_summary: string;
  };
  raw_audit_trace: {
    raw_ingestion_id: string;
    ingested_store: string;
    original_raw_price: string | number;
    original_raw_msrp?: string | number;
  };
  historical_trend?: HistoricalPricingTrendAnalysis;
}

export interface PipelineMetrics {
  total_ingested: number;
  total_normalized: number;
  deceptive_discounts_flagged: number;
  all_time_lows_detected: number;
  grey_market_blocked: number;
  total_dev_revenue_protected_usd: number;
  avg_latency_ms: number;
}
