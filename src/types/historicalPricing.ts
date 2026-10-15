export interface HistoricalSaleEvent {
  id: string;
  eventName: string;
  startDate: string; // ISO date 'YYYY-MM-DD'
  endDate: string; // ISO date 'YYYY-MM-DD'
  durationDays: number;
  store: string;
  msrp: number; // MSRP in effect at that time
  salePrice: number; // Price charged during the sale
  discountPercentage: number;
  isAllTimeLowAtTime: boolean;
  isMsrpElevated: boolean; // True if MSRP was artificially bumped before/during promotion
  status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
  notes?: string;
}

export interface HistoricalPriceDataPoint {
  date: string; // 'YYYY-MM-DD'
  displayDate: string; // 'Nov 2025' or 'Nov 15'
  regularPrice: number; // MSRP
  actualPrice: number; // Effective purchase price
  discountPercentage: number;
  isOnSale: boolean;
  store: string;
  saleEventName?: string;
  isAtl: boolean;
  isDeceptiveMSRPHike: boolean;
}

export interface PredictiveSaleSignalDetail {
  recommendation: 'BUY_NOW' | 'WAIT' | 'FAIR_VALUE';
  confidenceScore: number; // 0 to 100 percentage
  primaryReason: string;
  nextExpectedEvent: string;
  nextExpectedDate: string;
  daysUntilNextSale: number;
  projectedDiscountPct: number;
  projectedPrice: number;
  cadenceDescription: string;
  cadenceReliability: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'SPORADIC';
}

export interface OmnibusComplianceDetail {
  lowestPricePrior30Days: number;
  baselineMsrpPrior30Days: number;
  currentClaimedMsrp: number;
  msrpElevationDelta: number;
  isDeceptiveInflation: boolean;
  isCompliantDirective986: boolean;
  directiveAuditExplanation: string;
  prior30DayWindowStart: string;
  prior30DayWindowEnd: string;
}

export interface HistoricalPricingTrendAnalysis {
  gameId: string;
  gameTitle: string;
  currency: string;
  dataRangeMonths: number;
  startDate: string;
  endDate: string;
  
  // High-level aggregates over 1-year window
  allTimeLowPrice: number;
  allTimeLowDate: string;
  allTimeLowStore: string;
  currentPrice: number;
  currentMsrp: number;
  stableBaselineMsrp: number;
  highestRecordedMsrp: number;
  lowestRecordedMsrp: number;
  
  // Sale Event statistics
  totalSalesPastYear: number;
  averageSaleDiscountPct: number;
  maxHistoricalDiscountPct: number;
  averageSaleDurationDays: number;
  averageDaysBetweenSales: number;
  lastSaleEndDate: string;
  daysSinceLastSale: number;
  
  // Regulatory & Deceptive Discount Flagging
  omnibusCompliance: OmnibusComplianceDetail;
  isDeceptiveDiscount: boolean;
  deceptiveExplanation: string;
  deceptiveViolationTags: string[];
  
  // Predictive Sale Signals
  predictiveSignals: PredictiveSaleSignalDetail;
  
  // Chronological sale events and time-series data for charting
  saleEvents: HistoricalSaleEvent[];
  timeline: HistoricalPriceDataPoint[];
}
