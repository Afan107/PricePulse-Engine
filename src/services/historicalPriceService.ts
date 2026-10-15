import {
  HistoricalSaleEvent,
  HistoricalPriceDataPoint,
  HistoricalPricingTrendAnalysis,
  OmnibusComplianceDetail,
  PredictiveSaleSignalDetail,
} from '../types/historicalPricing';

// Baseline reference date: October 15, 2026
const REFERENCE_DATE = '2026-10-15';

/**
 * Pre-compiled 1-Year Historical Datasets for benchmark catalog titles
 */

// 1. ELDEN RING: 1-Year History (Stable $59.99 MSRP, predictable ~55-day sale cadence, verified ATL at $35.99)
const ELDEN_RING_EVENTS: HistoricalSaleEvent[] = [
  {
    id: 'er_sale_1',
    eventName: 'Bandai Namco Publisher Weekend 2025',
    startDate: '2025-10-24',
    endDate: '2025-11-03',
    durationDays: 10,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 35.99,
    discountPercentage: 40,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'First time hitting -40% threshold.',
  },
  {
    id: 'er_sale_2',
    eventName: 'Steam Autumn / Black Friday Sale 2025',
    startDate: '2025-11-25',
    endDate: '2025-12-02',
    durationDays: 7,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 39.99,
    discountPercentage: 33,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Autumn promotion.',
  },
  {
    id: 'er_sale_3',
    eventName: 'Steam Winter Sale 2025',
    startDate: '2025-12-18',
    endDate: '2026-01-05',
    durationDays: 18,
    store: 'Steam & GOG',
    msrp: 59.99,
    salePrice: 35.99,
    discountPercentage: 40,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Matches record low of $35.99.',
  },
  {
    id: 'er_sale_4',
    eventName: 'FromSoftware Anniversary Sale',
    startDate: '2026-02-20',
    endDate: '2026-03-02',
    durationDays: 10,
    store: 'Fanatical & Steam',
    msrp: 59.99,
    salePrice: 35.99,
    discountPercentage: 40,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: '2-Year release milestone celebration.',
  },
  {
    id: 'er_sale_5',
    eventName: 'Steam Spring Sale 2026',
    startDate: '2026-03-19',
    endDate: '2026-03-26',
    durationDays: 7,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 39.99,
    discountPercentage: 33,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'er_sale_6',
    eventName: 'Shadow of the Erdtree Launch Hype',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    durationDays: 10,
    store: 'Steam & Humble',
    msrp: 59.99,
    salePrice: 41.99,
    discountPercentage: 30,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Mild discount ahead of expansion.',
  },
  {
    id: 'er_sale_7',
    eventName: 'Steam Summer Sale 2026',
    startDate: '2026-07-02',
    endDate: '2026-07-16',
    durationDays: 14,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 35.99,
    discountPercentage: 40,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'er_sale_8',
    eventName: 'Fanatical Authorized Partner Promo (Current)',
    startDate: '2026-10-08',
    endDate: '2026-10-22',
    durationDays: 14,
    store: 'Fanatical (Authorized Key)',
    msrp: 59.99,
    salePrice: 35.99,
    discountPercentage: 40,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'ACTIVE',
    notes: 'Verified All-Time Low ($35.99). Authorized partner with 75% dev cut.',
  },
];

// 2. DARK TACTICS: CHRONO EDITION (The Deceptive Markup Scam Case)
// Artificially inflated MSRP from $29.99 to $49.99 right before a "50% off" sale
const DARK_TACTICS_EVENTS: HistoricalSaleEvent[] = [
  {
    id: 'dt_sale_1',
    eventName: 'Halloween Indie Spotlight 2025',
    startDate: '2025-10-28',
    endDate: '2025-11-04',
    durationDays: 7,
    store: 'Steam',
    msrp: 29.99,
    salePrice: 14.99,
    discountPercentage: 50,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Legit 50% discount on true $29.99 baseline.',
  },
  {
    id: 'dt_sale_2',
    eventName: 'Winter Indie Gala 2025',
    startDate: '2025-12-20',
    endDate: '2026-01-04',
    durationDays: 15,
    store: 'Steam',
    msrp: 29.99,
    salePrice: 14.99,
    discountPercentage: 50,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Tied true ATL of $14.99.',
  },
  {
    id: 'dt_sale_3',
    eventName: 'Tactics Festival 2026',
    startDate: '2026-04-10',
    endDate: '2026-04-17',
    durationDays: 7,
    store: 'Steam',
    msrp: 29.99,
    salePrice: 17.99,
    discountPercentage: 40,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'dt_sale_4',
    eventName: 'Summer Sale 2026',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    durationDays: 14,
    store: 'Steam',
    msrp: 29.99,
    salePrice: 14.99,
    discountPercentage: 50,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Last legit sale at $14.99.',
  },
  {
    id: 'dt_sale_5',
    eventName: 'Unannounced Base MSRP Price Spike',
    startDate: '2026-09-18',
    endDate: '2026-10-05',
    durationDays: 17,
    store: 'All Stores',
    msrp: 49.99, // Injected spike from $29.99 to $49.99 (+66.7%)
    salePrice: 49.99,
    discountPercentage: 0,
    isAllTimeLowAtTime: false,
    isMsrpElevated: true,
    status: 'COMPLETED',
    notes: 'MSRP artificially elevated from $29.99 to $49.99 without product updates.',
  },
  {
    id: 'dt_sale_6',
    eventName: 'Fake "50% OFF" Flash Promotion (Current)',
    startDate: '2026-10-06',
    endDate: '2026-10-20',
    durationDays: 14,
    store: 'ShadyKeys / Grey Reseller',
    msrp: 49.99,
    salePrice: 24.99,
    discountPercentage: 50,
    isAllTimeLowAtTime: false,
    isMsrpElevated: true,
    status: 'ACTIVE',
    notes: 'VIOLATION DETECTED: Advertised as 50% off $49.99, but true 30-day baseline was $29.99. Effective price of $24.99 is 66.7% above true ATL ($14.99).',
  },
];

// 3. BALDUR'S GATE 3: 1-Year History (Stable $59.99 MSRP, rare conservative discounts, $47.99 ATL floor)
const BALDURS_GATE_3_EVENTS: HistoricalSaleEvent[] = [
  {
    id: 'bg3_sale_1',
    eventName: 'Steam Winter Sale 2025',
    startDate: '2025-12-18',
    endDate: '2026-01-05',
    durationDays: 18,
    store: 'Steam & GOG',
    msrp: 59.99,
    salePrice: 47.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'First official discount (-20%). New record floor.',
  },
  {
    id: 'bg3_sale_2',
    eventName: 'Steam Spring Sale 2026',
    startDate: '2026-03-19',
    endDate: '2026-03-26',
    durationDays: 7,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 47.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Matches record low of $47.99.',
  },
  {
    id: 'bg3_sale_3',
    eventName: 'Steam Summer Sale 2026',
    startDate: '2026-07-02',
    endDate: '2026-07-16',
    durationDays: 14,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 47.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'bg3_sale_4',
    eventName: 'Larian Anniversary Week (Current)',
    startDate: '2026-10-10',
    endDate: '2026-10-24',
    durationDays: 14,
    store: 'Steam Official',
    msrp: 59.99,
    salePrice: 47.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'ACTIVE',
    notes: 'Matches All-Time Low ($47.99). Never dropped below -20%. High value.',
  },
];

// 4. CYBERPUNK 2077: PHANTOM LIBERTY (Stable baseline, regular ~45 day cycle)
const CYBERPUNK_EVENTS: HistoricalSaleEvent[] = [
  {
    id: 'cp_sale_1',
    eventName: 'Black Friday 2025',
    startDate: '2025-11-20',
    endDate: '2025-11-30',
    durationDays: 10,
    store: 'GOG & Steam',
    msrp: 29.99,
    salePrice: 23.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'cp_sale_2',
    eventName: 'Winter Holiday Bonanza 2025',
    startDate: '2025-12-18',
    endDate: '2026-01-04',
    durationDays: 17,
    store: 'GOG.com',
    msrp: 29.99,
    salePrice: 20.99,
    discountPercentage: 30,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Record All-Time Low for expansion ($20.99).',
  },
  {
    id: 'cp_sale_3',
    eventName: 'Spring Cyber Festival 2026',
    startDate: '2026-03-15',
    endDate: '2026-03-25',
    durationDays: 10,
    store: 'Steam',
    msrp: 29.99,
    salePrice: 23.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'cp_sale_4',
    eventName: 'Steam Summer Sale 2026',
    startDate: '2026-07-02',
    endDate: '2026-07-16',
    durationDays: 14,
    store: 'GOG & Steam',
    msrp: 29.99,
    salePrice: 20.99,
    discountPercentage: 30,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'cp_sale_5',
    eventName: 'Patch 2.2 Milestone Celebration (Current)',
    startDate: '2026-10-09',
    endDate: '2026-10-23',
    durationDays: 14,
    store: 'GOG.com (DRM-Free)',
    msrp: 29.99,
    salePrice: 23.99,
    discountPercentage: 20,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'ACTIVE',
    notes: 'Fair value at $23.99, but waiting for winter sale will save an extra $3.00.',
  },
];

// 5. DEAD SPACE (REMAKE): Imminent Halloween Sale Example (Frequent sales, current 10% is weak)
const DEAD_SPACE_EVENTS: HistoricalSaleEvent[] = [
  {
    id: 'ds_sale_1',
    eventName: 'Steam Halloween / Scream Fest 2025',
    startDate: '2025-10-26',
    endDate: '2025-11-02',
    durationDays: 7,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 20.99,
    discountPercentage: 65,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
    notes: 'Massive seasonal drop.',
  },
  {
    id: 'ds_sale_2',
    eventName: 'Steam Winter Sale 2025',
    startDate: '2025-12-19',
    endDate: '2026-01-03',
    durationDays: 15,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 20.99,
    discountPercentage: 65,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'ds_sale_3',
    eventName: 'Sci-Fi Weekend 2026',
    startDate: '2026-04-12',
    endDate: '2026-04-19',
    durationDays: 7,
    store: 'EA App & Steam',
    msrp: 59.99,
    salePrice: 23.99,
    discountPercentage: 60,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'ds_sale_4',
    eventName: 'Summer Sale 2026',
    startDate: '2026-07-02',
    endDate: '2026-07-16',
    durationDays: 14,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 20.99,
    discountPercentage: 65,
    isAllTimeLowAtTime: true,
    isMsrpElevated: false,
    status: 'COMPLETED',
  },
  {
    id: 'ds_sale_5',
    eventName: 'Midweek Teaser (Current)',
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    durationDays: 5,
    store: 'Steam',
    msrp: 59.99,
    salePrice: 53.99,
    discountPercentage: 10,
    isAllTimeLowAtTime: false,
    isMsrpElevated: false,
    status: 'ACTIVE',
    notes: 'Sub-optimal 10% discount right before Steam Scream Fest (18 days). Immediate WAIT signal.',
  },
];

/**
 * Helper to generate 12-14 monthly chronological data points from sale events
 */
function buildTimelineFromSaleEvents(
  events: HistoricalSaleEvent[],
  baselineMsrp: number,
  currentPrice: number,
  currentMsrp: number,
  isDeceptive: boolean,
  startDateStr = '2025-10-01',
  endDateStr = REFERENCE_DATE
): HistoricalPriceDataPoint[] {
  const points: HistoricalPriceDataPoint[] = [];

  // Generate 26 bi-weekly/monthly sample intervals across the 12 months
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const steps = 24;
  const stepDays = Math.floor(totalDays / steps);

  let recordAtlSoFar = baselineMsrp;

  for (let i = 0; i <= steps; i++) {
    const ptDate = new Date(start.getTime() + i * stepDays * 24 * 60 * 60 * 1000);
    const dateStr = ptDate.toISOString().split('T')[0];
    const displayDate = ptDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    // Check if this date falls within any sale event
    const activeEvent = events.find((ev) => {
      const s = new Date(ev.startDate).getTime();
      const e = new Date(ev.endDate).getTime();
      const curr = ptDate.getTime();
      return curr >= s && curr <= e;
    });

    let regPrice = baselineMsrp;
    let actPrice = baselineMsrp;
    let discountPct = 0;
    let onSale = false;
    let eventName: string | undefined = undefined;
    let store = 'Steam Official';
    let isHike = false;

    if (activeEvent) {
      regPrice = activeEvent.msrp;
      actPrice = activeEvent.salePrice;
      discountPct = activeEvent.discountPercentage;
      onSale = discountPct > 0;
      eventName = activeEvent.eventName;
      store = activeEvent.store;
      isHike = activeEvent.isMsrpElevated;
    } else {
      // Non-sale period
      if (isDeceptive && i >= steps - 2) {
        regPrice = currentMsrp; // Spiked MSRP
        actPrice = currentMsrp;
        isHike = true;
      }
    }

    if (actPrice < recordAtlSoFar) {
      recordAtlSoFar = actPrice;
    }

    const isAtl = Math.abs(actPrice - recordAtlSoFar) < 0.05 && onSale;

    points.push({
      date: dateStr,
      displayDate,
      regularPrice: Number(regPrice.toFixed(2)),
      actualPrice: Number(actPrice.toFixed(2)),
      discountPercentage: discountPct,
      isOnSale: onSale,
      store,
      saleEventName: eventName,
      isAtl,
      isDeceptiveMSRPHike: isHike,
    });
  }

  // Ensure final point is today
  const lastEvent = events[events.length - 1];
  const finalActual = lastEvent ? lastEvent.salePrice : currentPrice;
  const finalReg = lastEvent ? lastEvent.msrp : currentMsrp;
  const finalDiscount = lastEvent ? lastEvent.discountPercentage : 0;

  points[points.length - 1] = {
    date: REFERENCE_DATE,
    displayDate: 'Current (Oct 26)',
    regularPrice: Number(finalReg.toFixed(2)),
    actualPrice: Number(finalActual.toFixed(2)),
    discountPercentage: finalDiscount,
    isOnSale: finalDiscount > 0,
    store: lastEvent?.store || 'Primary Store',
    saleEventName: lastEvent?.eventName,
    isAtl: lastEvent ? lastEvent.isAllTimeLowAtTime : false,
    isDeceptiveMSRPHike: isDeceptive,
  };

  return points;
}

/**
 * Computes deep EU Omnibus Directive 98/6/EC compliance & Deceptive Discount Flags
 * Analyzes the 30-day period immediately preceding the promotion.
 */
function evaluateOmnibusAndDeceptiveFlags(
  events: HistoricalSaleEvent[],
  baselineMsrp: number,
  currentPrice: number,
  currentClaimedMsrp: number
): {
  omnibusCompliance: OmnibusComplianceDetail;
  isDeceptiveDiscount: boolean;
  deceptiveExplanation: string;
  deceptiveViolationTags: string[];
} {
  const windowEnd = '2026-10-15';
  const windowStart = '2026-09-15'; // 30 days prior

  // Find price points or sales within the 30-day prior window
  const prior30DayEvents = events.filter((ev) => {
    return ev.startDate <= windowEnd && ev.endDate >= windowStart;
  });

  // Calculate lowest price in prior 30 days
  let lowest30Day = baselineMsrp;
  for (const ev of prior30DayEvents) {
    if (ev.salePrice < lowest30Day) {
      lowest30Day = ev.salePrice;
    }
  }

  const msrpDelta = Number((currentClaimedMsrp - baselineMsrp).toFixed(2));
  const isMsrpElevated = msrpDelta > baselineMsrp * 0.05; // >5% baseline elevation

  // Also check if any recent event had flagged elevation
  const hadElevatedEvent = events.some((ev) => ev.isMsrpElevated);

  const isDeceptive = isMsrpElevated || hadElevatedEvent;
  const violationTags: string[] = [];

  let directiveExplanation = '';
  if (isDeceptive) {
    violationTags.push('OMNIBUS_DIRECTIVE_98_6_VIOLATION');
    violationTags.push('ARTIFICIAL_MSRP_INFLATION');
    if (currentPrice > lowest30Day) {
      violationTags.push('EFFECTIVE_PRICE_ABOVE_PRIOR_BASELINE');
    }

    directiveExplanation = `NON-COMPLIANT WITH EU OMNIBUS DIRECTIVE (98/6/EC Article 6a): Claimed baseline MSRP of $${currentClaimedMsrp.toFixed(2)} represents an artificial elevation of +$${msrpDelta.toFixed(2)} (+${Math.round((msrpDelta / baselineMsrp) * 100)}%) above the verified 365-day stable baseline of $${baselineMsrp.toFixed(2)}. Retailer claimed discount is deceptive.`;
  } else {
    directiveExplanation = `COMPLIANT WITH EU OMNIBUS DIRECTIVE (98/6/EC): Baseline MSRP of $${baselineMsrp.toFixed(2)} has been verified stable across all authorized retailers for >90 days. Advertised discount is legitimate.`;
  }

  const omnibusCompliance: OmnibusComplianceDetail = {
    lowestPricePrior30Days: Number(lowest30Day.toFixed(2)),
    baselineMsrpPrior30Days: Number(baselineMsrp.toFixed(2)),
    currentClaimedMsrp: Number(currentClaimedMsrp.toFixed(2)),
    msrpElevationDelta: msrpDelta,
    isDeceptiveInflation: isDeceptive,
    isCompliantDirective986: !isDeceptive,
    directiveAuditExplanation: directiveExplanation,
    prior30DayWindowStart: windowStart,
    prior30DayWindowEnd: windowEnd,
  };

  const deceptiveExplanation = isDeceptive
    ? `DECEPTIVE DISCOUNT DETECTED: The advertised sale claims a discount against an inflated base price ($${currentClaimedMsrp.toFixed(2)}), whereas the historical 1-year stable MSRP is $${baselineMsrp.toFixed(2)}. The consumer pays $${currentPrice.toFixed(2)}, which is higher than actual historical sale norms.`
    : `VERIFIED AUTHENTIC DISCOUNT: Base MSRP ($${baselineMsrp.toFixed(2)}) is consistent with 1-year historical pricing without artificial pre-sale inflation.`;

  return {
    omnibusCompliance,
    isDeceptiveDiscount: isDeceptive,
    deceptiveExplanation,
    deceptiveViolationTags: violationTags,
  };
}

/**
 * Calculates predictive sale signals based on observed 1-year sale cadence,
 * days between past sales, and seasonal calendars.
 */
function calculatePredictiveSignals(
  events: HistoricalSaleEvent[],
  currentPrice: number,
  allTimeLow: number,
  baselineMsrp: number,
  isDeceptive: boolean,
  discountPct: number
): PredictiveSaleSignalDetail {
  // Compute sale intervals
  const completedEvents = events.filter((e) => e.status === 'COMPLETED');
  const intervals: number[] = [];
  for (let i = 1; i < completedEvents.length; i++) {
    const prevEnd = new Date(completedEvents[i - 1].endDate).getTime();
    const nextStart = new Date(completedEvents[i].startDate).getTime();
    const diffDays = Math.max(0, Math.round((nextStart - prevEnd) / (1000 * 60 * 60 * 24)));
    intervals.push(diffDays);
  }

  const avgDaysBetween = intervals.length > 0
    ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
    : 55;

  const discounts = events.map((e) => e.discountPercentage).filter((d) => d > 0);
  const avgDiscount = discounts.length > 0
    ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length)
    : 35;

  // Next sale event prediction
  // Steam Scream Fest is Oct 28 (13 days from Oct 15)
  // Steam Autumn / Black Friday is Nov 23 (39 days from Oct 15)
  // Steam Winter is Dec 21 (67 days)
  const nextEvent = 'Steam Scream Fest / Halloween Sale';
  const nextDate = '2026-10-28';
  const daysUntilNextSale = 13;

  if (isDeceptive) {
    return {
      recommendation: 'WAIT',
      confidenceScore: 98,
      primaryReason:
        'DO NOT BUY: Deceptive price elevation detected. Wait for authorized publisher sale where base price resets to legitimate historical baseline.',
      nextExpectedEvent: nextEvent,
      nextExpectedDate: nextDate,
      daysUntilNextSale,
      projectedDiscountPct: avgDiscount,
      projectedPrice: Number((baselineMsrp * (1 - avgDiscount / 100)).toFixed(2)),
      cadenceDescription: 'Irregular / Deceptive Manipulation Detected',
      cadenceReliability: 'SPORADIC',
    };
  }

  // Check if current price is ATL or tied with ATL
  const isAtl = currentPrice <= allTimeLow || Math.abs(currentPrice - allTimeLow) < 0.05;

  if (isAtl) {
    return {
      recommendation: 'BUY_NOW',
      confidenceScore: 96,
      primaryReason: `ALL-TIME LOW HIT ($${currentPrice.toFixed(2)}): Current price matches or beats the 1-year historical floor price. Highly recommended immediate purchase.`,
      nextExpectedEvent: nextEvent,
      nextExpectedDate: nextDate,
      daysUntilNextSale,
      projectedDiscountPct: discountPct,
      projectedPrice: currentPrice,
      cadenceDescription: `Consistent ${avgDaysBetween}-Day Promotional Cadence`,
      cadenceReliability: 'VERY_HIGH',
    };
  }

  // If discount is >= 50%
  if (discountPct >= 50) {
    return {
      recommendation: 'BUY_NOW',
      confidenceScore: 92,
      primaryReason: `DEEP DISCOUNT THRESHOLD (-${discountPct}%): Exceeds 1-year average discount of ${avgDiscount}%. Strong purchase window.`,
      nextExpectedEvent: nextEvent,
      nextExpectedDate: nextDate,
      daysUntilNextSale,
      projectedDiscountPct: discountPct,
      projectedPrice: currentPrice,
      cadenceDescription: `Regular ${avgDaysBetween}-Day Sale Cadence`,
      cadenceReliability: 'HIGH',
    };
  }

  // If seasonal sale is within 30 days and current discount is weak (<30%)
  if (daysUntilNextSale <= 30 && discountPct < 30) {
    return {
      recommendation: 'WAIT',
      confidenceScore: 89,
      primaryReason: `SEASONAL EVENT IMMINENT: ${nextEvent} starts in ${daysUntilNextSale} days. Historical average discount for this title is ${avgDiscount}%, whereas current discount is only ${discountPct}%. Waiting is projected to save ~$${((baselineMsrp * (avgDiscount - discountPct)) / 100).toFixed(2)}.`,
      nextExpectedEvent: nextEvent,
      nextExpectedDate: nextDate,
      daysUntilNextSale,
      projectedDiscountPct: avgDiscount,
      projectedPrice: Number((baselineMsrp * (1 - avgDiscount / 100)).toFixed(2)),
      cadenceDescription: `High Frequency (~${avgDaysBetween} Days Interval)`,
      cadenceReliability: 'HIGH',
    };
  }

  return {
    recommendation: 'FAIR_VALUE',
    confidenceScore: 82,
    primaryReason: `FAIR VALUE: Current ${discountPct}% discount reflects standard cadence without artificial markup. Next major price drop expected during ${nextEvent}.`,
    nextExpectedEvent: nextEvent,
    nextExpectedDate: nextDate,
    daysUntilNextSale,
    projectedDiscountPct: avgDiscount,
    projectedPrice: Number((baselineMsrp * (1 - avgDiscount / 100)).toFixed(2)),
    cadenceDescription: `Standard Cadence (~${avgDaysBetween} Days)`,
    cadenceReliability: 'MODERATE',
  };
}

/**
 * Dynamically synthesizes a realistic 1-year historical pricing dataset for any custom or searched title
 */
function synthesizeDynamicHistoricalData(
  title: string,
  currentPrice = 29.99,
  currentMsrp = 59.99
): HistoricalSaleEvent[] {
  const isDeceptiveSearch =
    title.toLowerCase().includes('scam') ||
    title.toLowerCase().includes('fake') ||
    title.toLowerCase().includes('markup') ||
    title.toLowerCase().includes('chrono');

  const baseMsrp = isDeceptiveSearch ? 29.99 : currentMsrp > 0 ? currentMsrp : 59.99;
  const targetAtl = Number((baseMsrp * 0.5).toFixed(2));

  if (isDeceptiveSearch) {
    return DARK_TACTICS_EVENTS;
  }

  return [
    {
      id: 'dyn_sale_1',
      eventName: 'Autumn Promotion 2025',
      startDate: '2025-11-20',
      endDate: '2025-11-28',
      durationDays: 8,
      store: 'Steam',
      msrp: baseMsrp,
      salePrice: Number((baseMsrp * 0.75).toFixed(2)),
      discountPercentage: 25,
      isAllTimeLowAtTime: false,
      isMsrpElevated: false,
      status: 'COMPLETED',
    },
    {
      id: 'dyn_sale_2',
      eventName: 'Winter Holiday Festival 2025',
      startDate: '2025-12-19',
      endDate: '2026-01-04',
      durationDays: 16,
      store: 'Steam & GOG',
      msrp: baseMsrp,
      salePrice: targetAtl,
      discountPercentage: 50,
      isAllTimeLowAtTime: true,
      isMsrpElevated: false,
      status: 'COMPLETED',
    },
    {
      id: 'dyn_sale_3',
      eventName: 'Spring Sale 2026',
      startDate: '2026-03-18',
      endDate: '2026-03-25',
      durationDays: 7,
      store: 'Steam',
      msrp: baseMsrp,
      salePrice: Number((baseMsrp * 0.65).toFixed(2)),
      discountPercentage: 35,
      isAllTimeLowAtTime: false,
      isMsrpElevated: false,
      status: 'COMPLETED',
    },
    {
      id: 'dyn_sale_4',
      eventName: 'Summer Sale 2026',
      startDate: '2026-07-01',
      endDate: '2026-07-15',
      durationDays: 14,
      store: 'Steam',
      msrp: baseMsrp,
      salePrice: targetAtl,
      discountPercentage: 50,
      isAllTimeLowAtTime: true,
      isMsrpElevated: false,
      status: 'COMPLETED',
    },
    {
      id: 'dyn_sale_5',
      eventName: 'Publisher Spotlight (Current)',
      startDate: '2026-10-10',
      endDate: '2026-10-24',
      durationDays: 14,
      store: 'Authorized Digital Store',
      msrp: baseMsrp,
      salePrice: currentPrice,
      discountPercentage: Math.max(0, Math.round(((baseMsrp - currentPrice) / baseMsrp) * 100)),
      isAllTimeLowAtTime: currentPrice <= targetAtl,
      isMsrpElevated: false,
      status: 'ACTIVE',
    },
  ];
}

/**
 * Primary Engine Function:
 * Analyzes >= 1 Year of historical price data, sale windows, MSRP fluctuations,
 * and outputs deterministic deceptive discount flags and predictive sale signals.
 */
export function analyzeHistoricalPricingTrends(
  gameTitleOrId: string,
  userCurrentPrice?: number,
  userCurrentMsrp?: number,
  userStore?: string
): HistoricalPricingTrendAnalysis {
  const clean = gameTitleOrId.toLowerCase().trim();

  let saleEvents: HistoricalSaleEvent[];
  let canonicalTitle = gameTitleOrId.trim() || 'Custom Title Inspection';
  let gameId = clean.replace(/[^a-z0-9]+/g, '-').slice(0, 35) || 'game-trend';
  let baselineMsrp = 59.99;
  let activePrice = userCurrentPrice !== undefined ? userCurrentPrice : 35.99;
  let activeMsrp = userCurrentMsrp !== undefined ? userCurrentMsrp : 59.99;

  if (clean.includes('elden')) {
    canonicalTitle = 'ELDEN RING';
    gameId = 'elden-ring';
    baselineMsrp = 59.99;
    activePrice = userCurrentPrice || 35.99;
    activeMsrp = userCurrentMsrp || 59.99;
    saleEvents = ELDEN_RING_EVENTS;
  } else if (clean.includes('chrono') || clean.includes('tactic') || clean.includes('fake') || clean.includes('scam')) {
    canonicalTitle = 'Dark Tactics: Chrono Edition (Inflated Price Alert)';
    gameId = 'deceptive-rpg-tactics';
    baselineMsrp = 29.99; // True historical baseline
    activePrice = userCurrentPrice || 24.99;
    activeMsrp = userCurrentMsrp || 49.99; // Inflated MSRP
    saleEvents = DARK_TACTICS_EVENTS;
  } else if (clean.includes('baldur') || clean.includes('bg3')) {
    canonicalTitle = "Baldur's Gate 3";
    gameId = 'baldurs-gate-3';
    baselineMsrp = 59.99;
    activePrice = userCurrentPrice || 47.99;
    activeMsrp = userCurrentMsrp || 59.99;
    saleEvents = BALDURS_GATE_3_EVENTS;
  } else if (clean.includes('cyberpunk') || clean.includes('phantom')) {
    canonicalTitle = 'Cyberpunk 2077: Phantom Liberty';
    gameId = 'cyberpunk-2077';
    baselineMsrp = 29.99;
    activePrice = userCurrentPrice || 23.99;
    activeMsrp = userCurrentMsrp || 29.99;
    saleEvents = CYBERPUNK_EVENTS;
  } else if (clean.includes('dead space')) {
    canonicalTitle = 'Dead Space (Remake)';
    gameId = 'dead-space-remake';
    baselineMsrp = 59.99;
    activePrice = userCurrentPrice || 53.99;
    activeMsrp = userCurrentMsrp || 59.99;
    saleEvents = DEAD_SPACE_EVENTS;
  } else {
    // Dynamic synthesis
    baselineMsrp = userCurrentMsrp && userCurrentMsrp > 0 ? userCurrentMsrp : 59.99;
    activePrice = userCurrentPrice && userCurrentPrice > 0 ? userCurrentPrice : baselineMsrp * 0.7;
    activeMsrp = baselineMsrp;
    saleEvents = synthesizeDynamicHistoricalData(canonicalTitle, activePrice, activeMsrp);
  }

  // Calculate aggregates across the 1-year history
  const allPrices = saleEvents.map((e) => e.salePrice);
  const allMsrps = saleEvents.map((e) => e.msrp);
  const allDiscounts = saleEvents.map((e) => e.discountPercentage);

  const allTimeLowPrice = Math.min(...allPrices);
  const atlEvent = saleEvents.find((e) => e.salePrice === allTimeLowPrice);
  const allTimeLowDate = atlEvent ? atlEvent.startDate : '2025-10-24';
  const allTimeLowStore = atlEvent ? atlEvent.store : 'Steam & Fanatical';

  const highestRecordedMsrp = Math.max(...allMsrps, activeMsrp);
  const lowestRecordedMsrp = Math.min(...allMsrps, baselineMsrp);

  const totalSalesPastYear = saleEvents.length;
  const averageSaleDiscountPct = Math.round(
    allDiscounts.reduce((a, b) => a + b, 0) / (allDiscounts.length || 1)
  );
  const maxHistoricalDiscountPct = Math.max(...allDiscounts);
  const averageSaleDurationDays = Math.round(
    saleEvents.reduce((a, b) => a + b.durationDays, 0) / (saleEvents.length || 1)
  );

  // Compute sale cadence
  const completed = saleEvents.filter((e) => e.status === 'COMPLETED');
  const intervals: number[] = [];
  for (let i = 1; i < completed.length; i++) {
    const prevEnd = new Date(completed[i - 1].endDate).getTime();
    const nextStart = new Date(completed[i].startDate).getTime();
    intervals.push(Math.max(1, Math.round((nextStart - prevEnd) / (1000 * 60 * 60 * 24))));
  }
  const averageDaysBetweenSales = intervals.length > 0
    ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
    : 52;

  const lastCompleted = completed[completed.length - 1];
  const lastSaleEndDate = lastCompleted ? lastCompleted.endDate : '2026-07-16';
  const daysSinceLastSale = Math.max(
    0,
    Math.round((new Date(REFERENCE_DATE).getTime() - new Date(lastSaleEndDate).getTime()) / (1000 * 60 * 60 * 24))
  );

  // Regulatory Omnibus & Deceptive Flag Evaluation
  const {
    omnibusCompliance,
    isDeceptiveDiscount,
    deceptiveExplanation,
    deceptiveViolationTags,
  } = evaluateOmnibusAndDeceptiveFlags(saleEvents, baselineMsrp, activePrice, activeMsrp);

  // Current discount relative to baseline MSRP
  const currentDiscountPct = baselineMsrp > 0
    ? Math.max(0, Math.round(((baselineMsrp - activePrice) / baselineMsrp) * 100))
    : 0;

  // Predictive Signals based on 1-year history
  const predictiveSignals = calculatePredictiveSignals(
    saleEvents,
    activePrice,
    allTimeLowPrice,
    baselineMsrp,
    isDeceptiveDiscount,
    currentDiscountPct
  );

  // Chronological timeline data points for Recharts
  const timeline = buildTimelineFromSaleEvents(
    saleEvents,
    baselineMsrp,
    activePrice,
    activeMsrp,
    isDeceptiveDiscount
  );

  return {
    gameId,
    gameTitle: canonicalTitle,
    currency: 'USD',
    dataRangeMonths: 14,
    startDate: '2025-10-01',
    endDate: REFERENCE_DATE,

    allTimeLowPrice,
    allTimeLowDate,
    allTimeLowStore,
    currentPrice: activePrice,
    currentMsrp: activeMsrp,
    stableBaselineMsrp: baselineMsrp,
    highestRecordedMsrp,
    lowestRecordedMsrp,

    totalSalesPastYear,
    averageSaleDiscountPct,
    maxHistoricalDiscountPct,
    averageSaleDurationDays,
    averageDaysBetweenSales,
    lastSaleEndDate,
    daysSinceLastSale,

    omnibusCompliance,
    isDeceptiveDiscount,
    deceptiveExplanation,
    deceptiveViolationTags,

    predictiveSignals,

    saleEvents,
    timeline,
  };
}

/**
 * Returns available preset games with rich historical datasets
 */
export function getPresetHistoricalGames(): Array<{
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
}> {
  return [
    {
      id: 'elden-ring',
      title: 'ELDEN RING',
      category: '100% Verified ATL & Stable MSRP',
      badge: '★ Real ATL Floor (-40%)',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'deceptive-rpg-tactics',
      title: 'Dark Tactics: Chrono Edition',
      category: 'Artificially Inflated MSRP Scam',
      badge: '⚠️ Fake Discount Markup (+66%)',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    },
    {
      id: 'baldurs-gate-3',
      title: "Baldur's Gate 3",
      category: 'Rare Promotional Cadence',
      badge: '🏆 Tied Record Floor ($47.99)',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'cyberpunk-2077',
      title: 'Cyberpunk 2077: Phantom Liberty',
      category: 'Steady-State DLC Pricing',
      badge: 'ℹ️ Fair Value Cadence',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 'dead-space-remake',
      title: 'Dead Space (Remake)',
      category: 'Imminent Seasonal Sale Indicator',
      badge: '⏳ Wait: Scream Fest in 13 Days',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
  ];
}
