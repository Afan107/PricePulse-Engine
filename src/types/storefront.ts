import { HistoricalPricingTrendAnalysis } from './historicalPricing';

export interface CheapSharkDeal {
  dealID: string;
  dealRating: string;
  gameID: string;
  title: string;
  internalName?: string;
  metacriticLink?: string;
  metacriticScore?: string;
  steamRatingText?: string;
  steamRatingPercent?: string;
  steamRatingCount?: string;
  steamAppID?: string;
  releaseDate?: number;
  lastChange?: number;
  isOnSale: string;
  normalPrice: string;
  salePrice: string;
  savings: string;
  thumb: string;
  storeID: string;
}

export interface StoreInfo {
  storeID: string;
  storeName: string;
  storeType: 'AUTHORIZED_DIRECT' | 'AUTHORIZED_KEY' | 'UNAUTHORIZED_GREY';
  devCutPct: number;
  logoBadge: string;
  color: string;
  domain: string;
}

export interface AffiliateSettings {
  gumroadCodeUrl: string;
  starterSubUrl: string;
  proSubUrl: string;
  affiliateTag: string;
  utmSource: string;
  humbleAffiliateId: string;
  fanaticalAffiliateId: string;
  epicCreatorTag: string;
}

export interface ScamCheckResult {
  game_id: string;
  title: string;
  currency: string;
  original_msrp: number;
  best_deal: {
    store: string;
    current_price: number;
    discount_percentage: number;
    voucher_code: string | null;
    is_all_time_low: boolean;
    matches_all_time_low: boolean;
    dev_revenue_share_pct: number;
    store_type: 'AUTHORIZED_DIRECT' | 'AUTHORIZED_KEY' | 'UNAUTHORIZED_GREY';
  };
  market_analysis: {
    is_deceptive_discount: boolean;
    historical_lowest_price: number;
    purchase_recommendation: 'BUY_NOW' | 'WAIT' | 'FAIR_VALUE';
    recommendation_reason: string;
    omnibus_warning?: string;
    price_delta_pct?: number;
  };
  all_store_quotes: Array<{
    store: string;
    price: number;
    cut_to_dev_pct: number;
  }>;
  historical_pricing?: HistoricalPricingTrendAnalysis;
}
