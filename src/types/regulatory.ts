export type SecFormType = '10-K' | '10-Q' | '8-K' | '6-K' | 'REG-EU' | 'DEF 14A';

export interface KeyFinancialMetrics {
  digital_net_bookings_usd?: number;
  storefront_distribution_fees_usd?: number;
  digital_sales_percentage?: number;
  unit_sales_milestone?: string;
  promotional_discount_guidance?: string;
}

export interface PricePulseCorrelation {
  related_games: string[];
  impact_summary: string;
  verified_storefront_split: string;
  pricing_guidance: string;
}

export interface SecFiling {
  id: string;
  accession_number: string;
  cik: string;
  entity_name: string;
  ticker: string;
  exchange: string;
  form_type: SecFormType;
  filing_date: string;
  fiscal_period: string;
  title: string;
  item_codes: string[];
  excerpt: string;
  key_financial_metrics: KeyFinancialMetrics;
  pricepulse_correlation: PricePulseCorrelation;
  document_url: string;
  xbrl_tag: string;
  ingestion_latency_ms: number;
}
