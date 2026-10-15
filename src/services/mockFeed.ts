import { RawScrapePayload } from '../types/pipeline';

export interface PresetTestCase {
  id: string;
  name: string;
  scenario: string;
  category: 'deceptive_fraud' | 'all_time_low' | 'grey_market' | 'epic_margin' | 'seasonal_wait' | 'fair_value';
  payload: RawScrapePayload;
}

export const PRESET_TEST_CASES: PresetTestCase[] = [
  {
    id: 'case_fraud_msrp',
    name: 'Fraud: Artificially Elevated MSRP Spiking',
    scenario: 'Store inflates MSRP from historical $49.99 to $79.99 to claim fake "37% OFF" at $49.99.',
    category: 'deceptive_fraud',
    payload: {
      raw_id: 'scrape_hike_99182',
      game_title: 'Cyberpunk 2077: Phantom Liberty Bundle',
      store: 'Unknown Reseller Pro',
      raw_price: '$49.99 USD',
      raw_msrp: '$79.99',
      currency: 'USD',
      historical_baseline_msrp: 49.99,
      lowest_recorded_history: 29.99,
      scrape_timestamp: '2026-10-10T12:00:00Z',
      region: 'US',
      sku: 'CP2077-PL-EXP',
    },
  },
  {
    id: 'case_record_atl',
    name: 'Record Breaker: All-Time Low on GOG',
    scenario: 'GOG discounts Baldur\'s Gate 3 to $34.99, beating previous historical low of $39.99.',
    category: 'all_time_low',
    payload: {
      raw_id: 'scrape_gog_atl_4412',
      game_title: "Baldur's Gate 3",
      store: 'GOG.com',
      raw_price: '34.99 EUR',
      raw_msrp: '59.99',
      currency: 'USD',
      historical_baseline_msrp: 59.99,
      lowest_recorded_history: 39.99,
      scrape_timestamp: '2026-10-10T12:05:00Z',
      region: 'GLOBAL',
      sku: 'BG3-DRM-FREE',
    },
  },
  {
    id: 'case_grey_market',
    name: 'Integrity Block: G2A Grey Market Arbitrage',
    scenario: 'Unauthorized key reseller offers low price, but $0 goes to developer and key risk is critical.',
    category: 'grey_market',
    payload: {
      raw_id: 'scrape_g2a_resell_7731',
      game_title: 'Elden Ring: Shadow of the Erdtree Edition',
      store: 'G2A',
      raw_price: '$28.45',
      raw_msrp: '$79.99',
      currency: 'USD',
      historical_baseline_msrp: 79.99,
      lowest_recorded_history: 39.99,
      seller_id: 'KeyMaster_FastKeys_EU',
      seller_rating: 4.2,
      scrape_timestamp: '2026-10-10T12:10:00Z',
      region: 'ROW',
      sku: 'ER-SOTE-GLOBAL',
    },
  },
  {
    id: 'case_epic_cut',
    name: 'Epic 88% Split: Developer Margin Advantage',
    scenario: 'Epic Games Store 88% revenue share leaves $35.19 for indie developer vs $27.99 on Steam.',
    category: 'epic_margin',
    payload: {
      raw_id: 'scrape_epic_88_0029',
      game_title: 'Hades II',
      store: 'Epic Games Store',
      raw_price: '$39.99',
      raw_msrp: '$39.99',
      currency: 'USD',
      historical_baseline_msrp: 39.99,
      lowest_recorded_history: 39.99,
      scrape_timestamp: '2026-10-10T12:12:00Z',
      region: 'US',
      sku: 'HADES-2-EGS',
    },
  },
  {
    id: 'case_wait_halloween',
    name: 'Predictive Wait: Steam Scream Fest in 18 Days',
    scenario: 'Only 10% discount offered right before major Steam Halloween Sale with 60% historical average.',
    category: 'seasonal_wait',
    payload: {
      raw_id: 'scrape_steam_wait_8819',
      game_title: 'Dead Space (Remake)',
      store: 'Steam',
      raw_price: '$53.99',
      raw_msrp: '$59.99',
      currency: 'USD',
      historical_baseline_msrp: 59.99,
      lowest_recorded_history: 17.99,
      scrape_timestamp: '2026-10-10T12:14:00Z',
      region: 'US',
      sku: 'DEADSPACE-REM-PC',
    },
  },
  {
    id: 'case_humble_direct',
    name: 'Humble Direct Widget: 85% Developer Net',
    scenario: 'Authorized Humble Direct distribution channel paying 85% directly to creator.',
    category: 'fair_value',
    payload: {
      raw_id: 'scrape_humble_widget_1120',
      game_title: 'Hollow Knight: Silksong',
      store: 'Humble Direct',
      raw_price: '$29.99',
      raw_msrp: '$29.99',
      currency: 'USD',
      historical_baseline_msrp: 29.99,
      lowest_recorded_history: 29.99,
      scrape_timestamp: '2026-10-10T12:15:00Z',
      region: 'GLOBAL',
      sku: 'SILKSONG-HDW-01',
    },
  },
];

const GAMES_CATALOG = [
  { title: "Baldur's Gate 3", msrp: 59.99, atl: 39.99, sku: 'BG3-LARI' },
  { title: 'Cyberpunk 2077: Ultimate Edition', msrp: 79.99, atl: 39.99, sku: 'CP2077-ULT' },
  { title: 'Elden Ring', msrp: 59.99, atl: 34.79, sku: 'ER-BANDAI' },
  { title: 'Hades II', msrp: 39.99, atl: 29.99, sku: 'HADES-2' },
  { title: 'Helldivers 2', msrp: 39.99, atl: 31.99, sku: 'HELLDIVE-2' },
  { title: 'Black Myth: Wukong', msrp: 59.99, atl: 49.99, sku: 'BMW-GAMES' },
  { title: 'Red Dead Redemption 2', msrp: 59.99, atl: 14.99, sku: 'RDR2-ROCK' },
  { title: 'Persona 3 Reload', msrp: 69.99, atl: 41.99, sku: 'P3R-SEGA' },
  { title: 'Armored Core VI: Fires of Rubicon', msrp: 59.99, atl: 35.99, sku: 'AC6-FS' },
  { title: 'Starfield', msrp: 69.99, atl: 34.99, sku: 'STARFIELD-BS' },
  { title: 'Monster Hunter: Wilds', msrp: 69.99, atl: 59.99, sku: 'MHW-CAPCOM' },
  { title: 'Resident Evil 4 (Remake)', msrp: 59.99, atl: 19.99, sku: 'RE4-CAPCOM' },
];

const STORE_SCRAPES = [
  { name: 'Steam', prefix: '$', rawType: 'clean' },
  { name: 'Epic Games Store', prefix: '$', rawType: 'clean' },
  { name: 'GOG.com', prefix: '€', rawType: 'euro' },
  { name: 'Humble Store', prefix: '$', rawType: 'clean' },
  { name: 'Humble Direct', prefix: '$', rawType: 'clean' },
  { name: 'Fanatical', prefix: '£', rawType: 'gbp' },
  { name: 'Green Man Gaming', prefix: '$', rawType: 'clean' },
  { name: 'Xbox Store', prefix: '$', rawType: 'clean' },
  { name: 'itch.io', prefix: '$', rawType: 'clean' },
  // Grey market occasionally appears
  { name: 'G2A', prefix: '$', rawType: 'grey' },
  { name: 'Kinguin', prefix: '$', rawType: 'grey' },
];

/**
 * Generates an unstandardized, high-throughput realistic scrape event
 */
export function generateRandomScrapePayload(): RawScrapePayload {
  const game = GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)];
  const store = STORE_SCRAPES[Math.floor(Math.random() * STORE_SCRAPES.length)];

  // Determine scenario
  const rand = Math.random();
  let rawPriceVal: number;
  let rawMsrpVal: number = game.msrp;
  let baselineMsrp = game.msrp;
  let lowestAtl = game.atl;

  if (rand < 0.15) {
    // SCENARIO 1: DECEPTIVE MSRP HIKE (e.g. baseline is $59.99, but retailer claims MSRP is $89.99 with "40% off" at $53.99)
    rawMsrpVal = Number((game.msrp * (1.3 + Math.random() * 0.4)).toFixed(2));
    rawPriceVal = Number((game.msrp * (0.85 + Math.random() * 0.1)).toFixed(2));
  } else if (rand < 0.35) {
    // SCENARIO 2: ALL-TIME LOW BREAKER
    const discountBelowAtl = 1.00 + Math.random() * 6.00;
    rawPriceVal = Number((Math.max(4.99, lowestAtl - discountBelowAtl)).toFixed(2));
  } else if (rand < 0.50) {
    // SCENARIO 3: MATCHES ALL-TIME LOW EXACTLY
    rawPriceVal = lowestAtl;
  } else if (rand < 0.70) {
    // SCENARIO 4: SUBTLE DISCOUNT (e.g. 10% - 20% off before seasonal sale)
    rawPriceVal = Number((game.msrp * (0.8 + Math.random() * 0.15)).toFixed(2));
  } else {
    // SCENARIO 5: DEEP VERIFIED DISCOUNT (>50% off)
    rawPriceVal = Number((game.msrp * (0.35 + Math.random() * 0.15)).toFixed(2));
  }

  // Raw price formatting quirks
  let rawPriceStr: string | number = rawPriceVal;
  let rawMsrpStr: string | number = rawMsrpVal;

  if (store.rawType === 'euro') {
    rawPriceStr = `${rawPriceVal.toFixed(2).replace('.', ',')} €`;
    rawMsrpStr = `${rawMsrpVal.toFixed(2).replace('.', ',')} €`;
  } else if (store.rawType === 'gbp') {
    rawPriceStr = `£${rawPriceVal.toFixed(2)}`;
    rawMsrpStr = `£${rawMsrpVal.toFixed(2)}`;
  } else {
    rawPriceStr = `$${rawPriceVal.toFixed(2)} USD`;
    rawMsrpStr = `$${rawMsrpVal.toFixed(2)}`;
  }

  return {
    raw_id: `scrape_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-4)}`,
    game_title: game.title,
    store: store.name,
    raw_price: rawPriceStr,
    raw_msrp: rawMsrpStr,
    currency: 'USD',
    historical_baseline_msrp: baselineMsrp,
    lowest_recorded_history: lowestAtl,
    scrape_timestamp: new Date().toISOString(),
    region: 'GLOBAL',
    sku: game.sku,
  };
}
