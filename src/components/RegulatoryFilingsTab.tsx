import React, { useState, useEffect } from 'react';
import { SecFiling, SecFormType } from '../types/regulatory';
import { SEED_FILINGS, generateRandomSecFiling } from '../services/regulatoryService';
import { 
  Building, 
  FileText, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  ExternalLink, 
  Search, 
  Check, 
  Copy, 
  DollarSign, 
  Percent, 
  Scale, 
  Layers, 
  TrendingUp,
  Cpu
} from 'lucide-react';

export const RegulatoryFilingsTab: React.FC = () => {
  const [filings, setFilings] = useState<SecFiling[]>(SEED_FILINGS);
  const [selectedFiling, setSelectedFiling] = useState<SecFiling>(SEED_FILINGS[0]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeedMs, setStreamSpeedMs] = useState<number>(3000);
  const [filterForm, setFilterForm] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'analysis' | 'raw_xbrl'>('analysis');

  // Real-time live SEC Edgar ingestion simulator
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newFiling = generateRandomSecFiling();
      setFilings((prev) => {
        const next = [newFiling, ...prev];
        return next.slice(0, 100); // keep max 100 filings in buffer
      });
    }, streamSpeedMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeedMs]);

  const handleStepOnce = () => {
    const newFiling = generateRandomSecFiling();
    setFilings((prev) => [newFiling, ...prev]);
    setSelectedFiling(newFiling);
  };

  const handleReset = () => {
    setFilings(SEED_FILINGS);
    setSelectedFiling(SEED_FILINGS[0]);
  };

  const filteredFilings = filings.filter((f) => {
    if (filterForm !== 'all' && f.form_type !== filterForm) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEntity = f.entity_name.toLowerCase().includes(q);
      const matchTicker = f.ticker.toLowerCase().includes(q);
      const matchCik = f.cik.includes(q);
      const matchTitle = f.title.toLowerCase().includes(q);
      const matchAcc = f.accession_number.toLowerCase().includes(q);
      if (!matchEntity && !matchTicker && !matchCik && !matchTitle && !matchAcc) {
        return false;
      }
    }
    return true;
  });

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedFiling, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Accession Number',
      'CIK',
      'Entity Name',
      'Ticker',
      'Exchange',
      'Form Type',
      'Filing Date',
      'Fiscal Period',
      'Filing Title',
      'Digital Net Bookings ($)',
      'Storefront Distribution Fees ($)',
      'Digital Sales (%)',
      'Unit Sales Milestone',
      'Verified Storefront Split',
      'PricePulse Correlation Summary',
      'XBRL Tag'
    ];

    const lines = [headers.map(escapeCsv).join(',')];
    filings.forEach((f) => {
      lines.push([
        f.accession_number,
        f.cik,
        f.entity_name,
        f.ticker,
        f.exchange,
        f.form_type,
        f.filing_date,
        f.fiscal_period,
        f.title,
        f.key_financial_metrics.digital_net_bookings_usd ?? '',
        f.key_financial_metrics.storefront_distribution_fees_usd ?? '',
        f.key_financial_metrics.digital_sales_percentage ?? '',
        f.key_financial_metrics.unit_sales_milestone ?? '',
        f.pricepulse_correlation.verified_storefront_split,
        f.pricepulse_correlation.impact_summary,
        f.xbrl_tag
      ].map(escapeCsv).join(','));
    });

    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pricepulse_sec_edgar_filings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Compute aggregate totals from filings
  const totalDigitalBookings = filings.reduce(
    (acc, curr) => acc + (curr.key_financial_metrics.digital_net_bookings_usd || 0), 
    0
  );
  const totalPlatformFeesDisclosed = filings.reduce(
    (acc, curr) => acc + (curr.key_financial_metrics.storefront_distribution_fees_usd || 0), 
    0
  );

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header & Ingestion Telemetry */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                SEC EDGAR &amp; Official Regulatory Disclosures Ingestion Feed
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulated live institutional stream of official SEC Form 10-K, 10-Q, 8-K, 6-K, and EU Transparency Directive filings disclosing digital storefront revenue shares, platform commissions, and publisher performance.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Speed */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300">
              <span className="text-slate-500">Rate:</span>
              <select
                value={streamSpeedMs}
                onChange={(e) => setStreamSpeedMs(Number(e.target.value))}
                className="bg-transparent border-0 font-medium text-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value={1500} className="bg-slate-900 text-slate-200">Fast (1.5s)</option>
                <option value={3000} className="bg-slate-900 text-slate-200">Normal (3s)</option>
                <option value={6000} className="bg-slate-900 text-slate-200">Slow (6s)</option>
              </select>
            </div>

            {/* Step */}
            <button
              onClick={handleStepOnce}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors text-[11px]"
            >
              Step 1x
            </button>

            {/* Toggle Streaming */}
            <button
              onClick={() => setIsStreaming((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors text-[11px] ${
                isStreaming
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Ingest Live</span>
                </>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-[11px]"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>Export Filings CSV</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Filings Ingested
            </span>
            <div className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{filings.length} Disclosures</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Active buffer: max 100 in memory
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Disclosed Digital Net Bookings
            </span>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>${(totalDigitalBookings / 1000000000).toFixed(2)} Billion</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Tracked across public gaming publishers
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Platform Distribution Fees Disclosed
            </span>
            <div className="text-base font-bold text-purple-400 flex items-center gap-1">
              <Percent className="w-4 h-4 text-purple-400" />
              <span>${(totalPlatformFeesDisclosed / 1000000000).toFixed(2)} Billion</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Paid to Steam, PlayStation, Xbox, Epic
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              SEC EDGAR Feed Ingestion Latency
            </span>
            <div className="text-base font-bold text-yellow-300 flex items-center gap-1">
              <Cpu className="w-4 h-4 text-yellow-400" />
              <span>0.38 ms</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Real-time XBRL parsing pipeline
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane: Filings Feed (Left) & Document Analysis Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (7 cols): Ingestion Table */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[760px]">
          {/* Filter Bar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            {/* Form filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {['all', '10-Q', '10-K', '8-K', '6-K', 'REG-EU'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFilterForm(fmt)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    filterForm === fmt
                      ? 'bg-slate-800 text-white font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search CIK, Ticker, Game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 px-2 py-1 text-[11px] bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* List of Filings */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredFilings.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No filings match the current query filter.
              </div>
            ) : (
              filteredFilings.map((filing) => {
                const isSelected = filing.id === selectedFiling.id;
                return (
                  <div
                    key={filing.id}
                    onClick={() => setSelectedFiling(filing)}
                    className={`p-3 cursor-pointer transition-colors hover:bg-slate-800/50 flex flex-col gap-1.5 ${
                      isSelected ? 'bg-slate-800/90 border-l-4 border-l-cyan-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          filing.form_type === '10-K'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : filing.form_type === '10-Q'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : filing.form_type === '8-K'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {filing.form_type}
                        </span>
                        <strong className="text-slate-100 text-sm">
                          {filing.ticker}
                        </strong>
                        <span className="text-slate-400 text-[11px] truncate max-w-[220px]">
                          {filing.entity_name}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500">
                        {new Date(filing.filing_date).toLocaleTimeString()} · {filing.fiscal_period}
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 font-medium line-clamp-1">
                      {filing.title}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {filing.excerpt}
                    </div>

                    {/* Metadata strip */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <span>CIK: {filing.cik}</span>
                        <span>·</span>
                        <span className="text-cyan-400">Acc: {filing.accession_number}</span>
                      </div>
                      <div className="text-emerald-400 font-semibold">
                        {filing.pricepulse_correlation.verified_storefront_split}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>SEC EDGAR Live Ingestion Socket: Active</span>
            <span className="text-slate-400">Click any disclosure to view PricePulse correlation analysis</span>
          </div>
        </div>

        {/* Right Pane (5 cols): Detailed Document & PricePulse Correlation Analysis */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[760px]">
          {/* Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">
                Filing Intelligence &amp; Correlation
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5 text-[10px]">
                <button
                  onClick={() => setViewMode('analysis')}
                  className={`px-2 py-0.5 rounded ${viewMode === 'analysis' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  Market Analysis
                </button>
                <button
                  onClick={() => setViewMode('raw_xbrl')}
                  className={`px-2 py-0.5 rounded ${viewMode === 'raw_xbrl' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  Raw EDGAR
                </button>
              </div>

              <button
                onClick={handleCopyRaw}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                title="Copy raw filing payload"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Body Viewer */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {viewMode === 'analysis' ? (
              <>
                {/* Formal SEC Header Block */}
                <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Registrant / Issuer
                      </span>
                      <strong className="text-sm text-slate-100">{selectedFiling.entity_name}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold text-xs">
                      FORM {selectedFiling.form_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-400">
                    <div>Ticker: <strong className="text-slate-200">{selectedFiling.ticker} ({selectedFiling.exchange})</strong></div>
                    <div>CIK Number: <strong className="text-slate-200">{selectedFiling.cik}</strong></div>
                    <div>Accession: <strong className="text-slate-200">{selectedFiling.accession_number}</strong></div>
                    <div>Fiscal Period: <strong className="text-slate-200">{selectedFiling.fiscal_period}</strong></div>
                  </div>

                  <div className="pt-1 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Filing Date: {selectedFiling.filing_date}</span>
                    <a
                      href={selectedFiling.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>SEC.gov Source</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Excerpt Box */}
                <div className="p-3 rounded bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Itemized Disclosure Excerpt:
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">
                    &quot;{selectedFiling.excerpt}&quot;
                  </p>
                </div>

                {/* Quantitative Metrics Highlight */}
                <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Disclosed Financial Performance Metrics:
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedFiling.key_financial_metrics.digital_net_bookings_usd && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400">Digital Net Bookings:</span>
                        <div className="font-bold text-emerald-400 text-sm mt-0.5">
                          ${(selectedFiling.key_financial_metrics.digital_net_bookings_usd / 1000000).toLocaleString()}M
                        </div>
                      </div>
                    )}

                    {selectedFiling.key_financial_metrics.storefront_distribution_fees_usd && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400">Storefront Comm. Fees:</span>
                        <div className="font-bold text-purple-400 text-sm mt-0.5">
                          ${(selectedFiling.key_financial_metrics.storefront_distribution_fees_usd / 1000000).toLocaleString()}M
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedFiling.key_financial_metrics.unit_sales_milestone && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px]">
                      <span className="text-slate-400 block text-[10px]">Unit Sales Milestones:</span>
                      <strong className="text-slate-200">
                        {selectedFiling.key_financial_metrics.unit_sales_milestone}
                      </strong>
                    </div>
                  )}

                  {selectedFiling.key_financial_metrics.promotional_discount_guidance && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px]">
                      <span className="text-slate-400 block text-[10px]">Promotional Cadence Guidance:</span>
                      <span className="text-cyan-300">
                        {selectedFiling.key_financial_metrics.promotional_discount_guidance}
                      </span>
                    </div>
                  )}
                </div>

                {/* PricePulse Engine Correlation Analysis Card */}
                <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-800/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>PricePulse Pipeline Correlation</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                      VERIFIED REVENUE SHARE
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed">
                    {selectedFiling.pricepulse_correlation.impact_summary}
                  </div>

                  <div className="pt-2 border-t border-emerald-900/60 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Storefront Royalty Contract:</span>
                      <strong className="text-slate-100">{selectedFiling.pricepulse_correlation.verified_storefront_split}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sale Window Expectation:</span>
                      <span className="text-cyan-300">{selectedFiling.pricepulse_correlation.pricing_guidance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Related Game Entities:</span>
                      <span className="text-emerald-400">{selectedFiling.pricepulse_correlation.related_games.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* XBRL Metadata Tag */}
                <div className="text-[10px] text-slate-500 flex items-center justify-between px-1">
                  <span>XBRL Concept: <code className="text-slate-400">{selectedFiling.xbrl_tag}</code></span>
                  <span>Parser SLA: {selectedFiling.ingestion_latency_ms} ms</span>
                </div>
              </>
            ) : (
              /* Raw XBRL / SGML View */
              <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px]">
                <div className="text-slate-500 mb-2 pb-1 border-b border-slate-800 flex justify-between">
                  <span>SEC EDGAR XBRL DATA PAYLOAD</span>
                  <span className="text-cyan-400">CIK {selectedFiling.cik}</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                  {JSON.stringify(selectedFiling, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
