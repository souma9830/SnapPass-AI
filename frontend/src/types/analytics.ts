export interface ComplianceMetric {
  id: string;
  category: string;
  name: string;
  totalChecked: number;
  passedCount: number;
  failedCount: number;
  passRatePercentage: number;
}

export interface ViolationMetric {
  ruleId: string;
  ruleName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  occurrenceCount: number;
  percentageOfFailures: number;
}

export interface CountryPresetStat {
  presetId: string;
  countryName: string;
  flagEmoji: string;
  totalSubmissions: number;
  passRate: number;
  topViolation: string;
}

export interface ComplianceTrendPoint {
  dateLabel: string;
  passCount: number;
  failCount: number;
}

export interface AnalyticsSummary {
  totalPhotosProcessed: number;
  overallPassRate: number;
  avgScore: number;
  metrics: ComplianceMetric[];
  topViolations: ViolationMetric[];
  countryStats: CountryPresetStat[];
  trendData: ComplianceTrendPoint[];
}

export interface ExportFilterOptions {
  startDate?: string;
  endDate?: string;
  presetFilter?: string;
  includeRawViolations: boolean;
}
