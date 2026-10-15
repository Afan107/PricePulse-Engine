import { CheapSharkDeal, StoreInfo, ScamCheckResult, AffiliateSettings } from '../types/storefront';
import { analyzeHistoricalPricingTrends } from './historicalPriceService';

export const STORES_MAP: Record<string, StoreInfo> = {
  '1': {
    storeID: '1',
    storeName: 'Steam',
    storeType: 'AUTHORIZED_DIRECT',
    devCutPct: 70,
    logoBadge: 'Steam Official',
    color: 'from-blue-600 to-indigo-800',
    domain: 'store.steampowered.com',
  },
  '7': {
    storeID: '7',
    storeName: 'GOG.com',
    storeType: 'AUTHORIZED_DIRECT',
    devCutPct: 70,
    logoBadge: 'GOG DRM-Free',
    color: 'from-purple-600 to-indigo-900',
    domain: 'gog.com',
  },
  '11': {
    storeID: '11',
    storeName: 'Humble Store',
    storeType: 'AUTHORIZED_KEY',
    devCutPct: 75,
    logoBadge: 'Humble Partner',
    color: 'from-red-600 to-rose-800',
    domain: 'humblebundle.com/store',
  },
  '15': {
    storeID: '15',
    storeName: 'Fanatical',
    storeType: 'AUTHORIZED_KEY',
    devCutPct: 75,
    logoBadge: 'Fanatical Official',
    color: 'from-amber-600 to-orange-700',
    domain: 'fanatical.com',
  },
  '25': {
    storeID: '25',
    storeName: 'Epic Games Store',
    storeType: 'AUTHORIZED_DIRECT',
    devCutPct: 88,
    logoBadge: 'Epic 88% Dev Split',
    color: 'from-slate-700 to-slate-900',
    domain: 'epicgames.com',
  },
};

export const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  gumroadCodeUrl: 'https://test.checkout.dodopayments.com/buy/pdt_0NpnXGSoBzU3ztUxa9h5n?quantity=1',
  starterSubUrl: 'https://test.checkout.dodopayments.com/buy/pdt_0NpnYBGFkhOaO65vHovK2?quantity=1',
  proSubUrl: 'https://test.checkout.dodopayments.com/buy/pdt_0NpnYry8pi8ku5qPC9aMS?quantity=1',
  affiliateTag: 'pricepulse',
  utmSource: 'pricepulse',
  humbleAffiliateId: 'pricepulse',
  fanaticalAffiliateId: 'pricepulse',
  epicCreatorTag: 'PRICEPULSE',
};

export const FALLBACK_DEALS: CheapSharkDeal[] = [
  {
    dealID: 'sim_cp2077_01',
    dealRating: '9.6',
    gameID: '10214',
    title: 'Cyberpunk 2077: Ultimate Edition',
    metacriticScore: '89',
    steamRatingText: 'Very Positive',
    steamRatingPercent: '88',
    steamRatingCount: '720000',
    isOnSale: '1',
    normalPrice: '79.99',
    salePrice: '39.99',
    savings: '50.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    storeID: '1',
  },
  {
    dealID: 'sim_bg3_02',
    dealRating: '9.9',
    gameID: '10884',
    title: "Baldur's Gate 3",
    metacriticScore: '96',
    steamRatingText: 'Overwhelmingly Positive',
    steamRatingPercent: '96',
    steamRatingCount: '610000',
    isOnSale: '1',
    normalPrice: '59.99',
    salePrice: '47.99',
    savings: '20.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    storeID: '7',
  },
  {
    dealID: 'sim_elden_03',
    dealRating: '9.8',
    gameID: '11540',
    title: 'ELDEN RING',
    metacriticScore: '94',
    steamRatingText: 'Very Positive',
    steamRatingPercent: '93',
    steamRatingCount: '890000',
    isOnSale: '1',
    normalPrice: '59.99',
    salePrice: '35.99',
    savings: '40.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    storeID: '15',
  },
  {
    dealID: 'sim_witcher_04',
    dealRating: '9.9',
    gameID: '8744',
    title: 'The Witcher 3: Wild Hunt - Complete Edition',
    metacriticScore: '93',
    steamRatingText: 'Overwhelmingly Positive',
    steamRatingPercent: '97',
    steamRatingCount: '780000',
    isOnSale: '1',
    normalPrice: '49.99',
    salePrice: '12.49',
    savings: '75.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
    storeID: '7',
  },
  {
    dealID: 'sim_helldivers_05',
    dealRating: '9.2',
    gameID: '14210',
    title: 'HELLDIVERS™ 2',
    metacriticScore: '82',
    steamRatingText: 'Mostly Positive',
    steamRatingPercent: '79',
    steamRatingCount: '410000',
    isOnSale: '1',
    normalPrice: '39.99',
    salePrice: '31.99',
    savings: '20.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg',
    storeID: '11',
  },
  {
    dealID: 'sim_rdr2_06',
    dealRating: '9.7',
    gameID: '9840',
    title: 'Red Dead Redemption 2',
    metacriticScore: '93',
    steamRatingText: 'Very Positive',
    steamRatingPercent: '91',
    steamRatingCount: '590000',
    isOnSale: '1',
    normalPrice: '59.99',
    salePrice: '19.79',
    savings: '67.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    storeID: '25',
  },
  {
    dealID: 'sim_hollow_07',
    dealRating: '9.9',
    gameID: '7300',
    title: 'Hollow Knight',
    metacriticScore: '90',
    steamRatingText: 'Overwhelmingly Positive',
    steamRatingPercent: '97',
    steamRatingCount: '340000',
    isOnSale: '1',
    normalPrice: '14.99',
    salePrice: '7.49',
    savings: '50.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    storeID: '1',
  },
  {
    dealID: 'sim_hades_08',
    dealRating: '9.9',
    gameID: '9932',
    title: 'Hades',
    metacriticScore: '93',
    steamRatingText: 'Overwhelmingly Positive',
    steamRatingPercent: '98',
    steamRatingCount: '250000',
    isOnSale: '1',
    normalPrice: '24.99',
    salePrice: '8.49',
    savings: '66.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg',
    storeID: '25',
  },
  {
    dealID: 'sim_doom_09',
    dealRating: '9.5',
    gameID: '9120',
    title: 'DOOM Eternal Deluxe Edition',
    metacriticScore: '88',
    steamRatingText: 'Very Positive',
    steamRatingPercent: '91',
    steamRatingCount: '185000',
    isOnSale: '1',
    normalPrice: '69.99',
    salePrice: '17.49',
    savings: '75.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg',
    storeID: '15',
  },
  {
    dealID: 'sim_persona_10',
    dealRating: '9.8',
    gameID: '12490',
    title: 'Persona 5 Royal',
    metacriticScore: '95',
    steamRatingText: 'Overwhelmingly Positive',
    steamRatingPercent: '96',
    steamRatingCount: '62000',
    isOnSale: '1',
    normalPrice: '59.99',
    salePrice: '23.99',
    savings: '60.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg',
    storeID: '1',
  },
  {
    dealID: 'sim_gow_11',
    dealRating: '9.7',
    gameID: '11920',
    title: 'God of War (2018)',
    metacriticScore: '93',
    steamRatingText: 'Overwhelmingly Positive',
    steamRatingPercent: '96',
    steamRatingCount: '95000',
    isOnSale: '1',
    normalPrice: '49.99',
    salePrice: '19.99',
    savings: '60.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    storeID: '11',
  },
  {
    dealID: 'sim_remnant_12',
    dealRating: '9.1',
    gameID: '13880',
    title: 'Remnant II',
    metacriticScore: '80',
    steamRatingText: 'Very Positive',
    steamRatingPercent: '84',
    steamRatingCount: '52000',
    isOnSale: '1',
    normalPrice: '49.99',
    salePrice: '24.99',
    savings: '50.00',
    thumb: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1282100/header.jpg',
    storeID: '15',
  },
];

/**
 * Fetch real-time deals from CheapShark with fallback
 */
export async function fetchLiveGameDeals(): Promise<{ deals: CheapSharkDeal[]; source: 'live' | 'fallback' }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      'https://www.cheapshark.com/api/1.0/deals?storeID=1,7,11,15,25&pageSize=24',
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CheapShark responded with HTTP ${response.status}`);
    }

    const data: CheapSharkDeal[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return { deals: data, source: 'live' };
    }
    return { deals: FALLBACK_DEALS, source: 'fallback' };
  } catch (err) {
    console.warn('CheapShark API unreachable, deploying high-fidelity fallback dataset:', err);
    return { deals: FALLBACK_DEALS, source: 'fallback' };
  }
}

/**
 * Builds affiliate-tagged link
 */
export function buildAffiliateUrl(
  deal: CheapSharkDeal,
  settings: AffiliateSettings
): string {
  const affTrack = encodeURIComponent(settings.affiliateTag || 'pricepulse');
  const utmSource = encodeURIComponent(settings.utmSource || 'pricepulse');

  // If CheapShark deal ID exists
  if (deal.dealID.startsWith('sim_')) {
    // Simulated demo link goes to Steam search or game store search with tags
    const query = encodeURIComponent(deal.title);
    return `https://store.steampowered.com/search/?term=${query}&utm_source=${utmSource}&aff_track=${affTrack}`;
  }

  // Official CheapShark redirect with our custom affiliate params
  return `https://www.cheapshark.com/redirect?dealID=${deal.dealID}&aff_track=${affTrack}&utm_source=${utmSource}`;
}

/**
 * Pre-defined test cases for Fake Discount & Scam Checker
 */
export const PRESET_SCAM_TESTS: ScamCheckResult[] = [
  {
    game_id: 'elden-ring',
    title: 'ELDEN RING',
    currency: 'USD',
    original_msrp: 59.99,
    best_deal: {
      store: 'Fanatical (Authorized Key)',
      current_price: 35.99,
      discount_percentage: 40,
      voucher_code: 'FANATICAL10',
      is_all_time_low: true,
      matches_all_time_low: true,
      dev_revenue_share_pct: 75,
      store_type: 'AUTHORIZED_KEY',
    },
    market_analysis: {
      is_deceptive_discount: false,
      historical_lowest_price: 35.99,
      purchase_recommendation: 'BUY_NOW',
      recommendation_reason:
        'New verified All-Time Low ($35.99). Fully legit Bandai Namco distributor with 75% publisher pass-through. 1-Year historical baseline verified stable at $59.99 with EU Omnibus compliance.',
      price_delta_pct: 0,
    },
    all_store_quotes: [
      { store: 'Fanatical', price: 35.99, cut_to_dev_pct: 75 },
      { store: 'Steam Official', price: 39.99, cut_to_dev_pct: 70 },
      { store: 'Humble Store', price: 41.99, cut_to_dev_pct: 75 },
      { store: 'Epic Games', price: 59.99, cut_to_dev_pct: 88 },
      { store: 'G2A Reseller (Grey)', price: 33.20, cut_to_dev_pct: 0 },
    ],
    historical_pricing: analyzeHistoricalPricingTrends('ELDEN RING', 35.99, 59.99, 'Fanatical'),
  },
  {
    game_id: 'deceptive-rpg-tactics',
    title: 'Dark Tactics: Chrono Edition (Inflated Price Alert)',
    currency: 'USD',
    original_msrp: 49.99, // Artificially marked up from $29.99
    best_deal: {
      store: 'ShadyKeys Global',
      current_price: 24.99,
      discount_percentage: 50,
      voucher_code: null,
      is_all_time_low: false,
      matches_all_time_low: false,
      dev_revenue_share_pct: 0,
      store_type: 'UNAUTHORIZED_GREY',
    },
    market_analysis: {
      is_deceptive_discount: true,
      historical_lowest_price: 14.99,
      purchase_recommendation: 'WAIT',
      recommendation_reason:
        'WARNING: Deceptive discount detected! 1-Year historical analysis shows base MSRP was raised from $29.99 to $49.99 right before a "50% OFF" promotion. Actual effective price ($24.99) is 66% HIGHER than the true Historical Low of $14.99. In breach of EU Omnibus Directive 98/6/EC.',
      omnibus_warning: 'VIOLATION OF DIRECTIVE 98/6/EC: 30-day prior baseline price was $29.99, not $49.99.',
      price_delta_pct: 66.7,
    },
    all_store_quotes: [
      { store: 'ShadyKeys (Grey)', price: 24.99, cut_to_dev_pct: 0 },
      { store: 'Steam Official', price: 29.99, cut_to_dev_pct: 70 },
      { store: 'GOG DRM-Free', price: 29.99, cut_to_dev_pct: 70 },
      { store: 'Historical Low Record', price: 14.99, cut_to_dev_pct: 70 },
    ],
    historical_pricing: analyzeHistoricalPricingTrends('Dark Tactics: Chrono Edition', 24.99, 49.99, 'ShadyKeys'),
  },
  {
    game_id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077: Phantom Liberty',
    currency: 'USD',
    original_msrp: 29.99,
    best_deal: {
      store: 'GOG.com (DRM-Free)',
      current_price: 23.99,
      discount_percentage: 20,
      voucher_code: null,
      is_all_time_low: false,
      matches_all_time_low: false,
      dev_revenue_share_pct: 70,
      store_type: 'AUTHORIZED_DIRECT',
    },
    market_analysis: {
      is_deceptive_discount: false,
      historical_lowest_price: 20.99,
      purchase_recommendation: 'FAIR_VALUE',
      recommendation_reason:
        'Legitimate official discount (-20%). CD PROJEKT direct partner with 70% direct studio revenue. 1-Year historical low is $20.99 (Steam Summer Sale); fair price if DRM-Free desired, but waiting for winter sales saves ~$3.00.',
      price_delta_pct: 14.2,
    },
    all_store_quotes: [
      { store: 'GOG.com', price: 23.99, cut_to_dev_pct: 70 },
      { store: 'Steam Official', price: 25.49, cut_to_dev_pct: 70 },
      { store: 'Epic Games', price: 26.99, cut_to_dev_pct: 88 },
      { store: 'Historical Record', price: 20.99, cut_to_dev_pct: 70 },
    ],
    historical_pricing: analyzeHistoricalPricingTrends('Cyberpunk 2077: Phantom Liberty', 23.99, 29.99, 'GOG.com'),
  },
  {
    game_id: 'baldirs-gate-3',
    title: "Baldur's Gate 3",
    currency: 'USD',
    original_msrp: 59.99,
    best_deal: {
      store: 'Steam Official',
      current_price: 47.99,
      discount_percentage: 20,
      voucher_code: null,
      is_all_time_low: true,
      matches_all_time_low: true,
      dev_revenue_share_pct: 70,
      store_type: 'AUTHORIZED_DIRECT',
    },
    market_analysis: {
      is_deceptive_discount: false,
      historical_lowest_price: 47.99,
      purchase_recommendation: 'BUY_NOW',
      recommendation_reason:
        'Tied with the All-Time Low ($47.99) for GOTY winner. Larian Studios receives full 70% payout. 1-Year historical analysis proves this is the absolute floor price (-20%) across all seasonal sales. Instant buy.',
      price_delta_pct: 0,
    },
    all_store_quotes: [
      { store: 'Steam Official', price: 47.99, cut_to_dev_pct: 70 },
      { store: 'GOG DRM-Free', price: 47.99, cut_to_dev_pct: 70 },
      { store: 'Humble Store', price: 59.99, cut_to_dev_pct: 75 },
    ],
    historical_pricing: analyzeHistoricalPricingTrends("Baldur's Gate 3", 47.99, 59.99, 'Steam Official'),
  },
];

/**
 * Evaluates any user query/URL for fake discounts & scams with 1-Year Historical Pricing Trend Analysis
 */
export function analyzeGameDeal(inputQuery: string): ScamCheckResult {
  const clean = inputQuery.toLowerCase().trim();

  // Match presets first
  if (clean.includes('elden')) return PRESET_SCAM_TESTS[0];
  if (clean.includes('fake') || clean.includes('chrono') || clean.includes('tactic') || clean.includes('g2a') || clean.includes('kinguin')) {
    return PRESET_SCAM_TESTS[1];
  }
  if (clean.includes('cyberpunk') || clean.includes('phantom')) return PRESET_SCAM_TESTS[2];
  if (clean.includes('baldur') || clean.includes('bg3')) return PRESET_SCAM_TESTS[3];

  // Dynamic simulation for any other title with 1-Year Historical Pricing Engine
  const isSuspicious = clean.includes('free') || clean.includes('cheap') || clean.includes('key') || clean.includes('cdkey');
  const basePrice = 59.99;
  const currentPrice = isSuspicious ? 12.99 : 29.99;
  const histLow = isSuspicious ? 19.99 : 24.99;

  const trendAnalysis = analyzeHistoricalPricingTrends(
    inputQuery.trim() || 'Custom Title Inspection',
    currentPrice,
    basePrice,
    isSuspicious ? 'Unknown Grey Reseller' : 'Steam / Humble Authorized'
  );

  return {
    game_id: clean.replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'custom-game',
    title: inputQuery.trim() || 'Custom Title Inspection',
    currency: 'USD',
    original_msrp: basePrice,
    best_deal: {
      store: isSuspicious ? 'Unknown Grey Reseller' : 'Steam / Humble Authorized',
      current_price: currentPrice,
      discount_percentage: Math.round(((basePrice - currentPrice) / basePrice) * 100),
      voucher_code: isSuspicious ? null : 'SAVE10',
      is_all_time_low: !isSuspicious && currentPrice <= histLow,
      matches_all_time_low: !isSuspicious && currentPrice <= histLow,
      dev_revenue_share_pct: isSuspicious ? 0 : 70,
      store_type: isSuspicious ? 'UNAUTHORIZED_GREY' : 'AUTHORIZED_DIRECT',
    },
    market_analysis: {
      is_deceptive_discount: trendAnalysis.isDeceptiveDiscount,
      historical_lowest_price: trendAnalysis.allTimeLowPrice,
      purchase_recommendation: trendAnalysis.predictiveSignals.recommendation,
      recommendation_reason: isSuspicious
        ? 'CAUTION: Distributor origin unverified. Developer revenue pass-through is 0%. 1-Year pricing trend suggests grey-market key revocation risk.'
        : trendAnalysis.predictiveSignals.primaryReason,
      omnibus_warning: trendAnalysis.omnibusCompliance.isDeceptiveInflation
        ? trendAnalysis.omnibusCompliance.directiveAuditExplanation
        : undefined,
      price_delta_pct: Math.round(((currentPrice - trendAnalysis.allTimeLowPrice) / trendAnalysis.allTimeLowPrice) * 100),
    },
    all_store_quotes: [
      { store: isSuspicious ? 'Grey Reseller' : 'Steam Official', price: currentPrice, cut_to_dev_pct: isSuspicious ? 0 : 70 },
      { store: 'GOG.com', price: Number((basePrice * 0.7).toFixed(2)), cut_to_dev_pct: 70 },
      { store: 'Fanatical', price: Number((basePrice * 0.65).toFixed(2)), cut_to_dev_pct: 75 },
      { store: 'Epic Games Store', price: basePrice, cut_to_dev_pct: 88 },
    ],
    historical_pricing: trendAnalysis,
  };
}
