
export interface RawMetricRow {
  primaryMetric: string;
  platform: string;
  tool: string;
  values: (number | null)[];
}

export interface ClinicData {
  name: string;
  weeks: string[];
  metrics: RawMetricRow[];
  latestWeekIdx: number;
  prevWeekIdx: number;
}

export interface AnalysisSummary {
  clinicName: string;
  overallHealth: number;
  healthTrend: number;
  aiVisTrend: number;
  aiVisibilityPulse: string;
  keyTrend: string;
  recommendation: string;
  isTechnicalFlag: boolean;
  visibilityStatus: 'stable' | 'up' | 'down';
}

export interface ComparisonData {
  label: string;
  semrushValue: number;
  ahrefsValue: number;
}
