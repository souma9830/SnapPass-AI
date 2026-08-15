import { AnalyticsSummary, ExportFilterOptions } from '../types/analytics';

export function generateMockAnalyticsSummary(): AnalyticsSummary {
  return {
    totalPhotosProcessed: 1248,
    overallPassRate: 88.4,
    avgScore: 91.2,
    metrics: [
      { id: 'm1', category: 'Background', name: 'Plain White/Off-White Background', totalChecked: 1248, passedCount: 1120, failedCount: 128, passRatePercentage: 89.7 },
      { id: 'm2', category: 'Dimensions', name: 'Aspect Ratio & Pixel Dimensions', totalChecked: 1248, passedCount: 1210, failedCount: 38, passRatePercentage: 97.0 },
      { id: 'm3', category: 'Lighting', name: 'Uniform Lighting & Zero Shadows', totalChecked: 1248, passedCount: 1045, failedCount: 203, passRatePercentage: 83.7 },
      { id: 'm4', category: 'Pose', name: 'Full-Face Centered & Open Eyes', totalChecked: 1248, passedCount: 1195, failedCount: 53, passRatePercentage: 95.8 },
      { id: 'm5', category: 'Attire', name: 'Contrast with Background & No Headwear', totalChecked: 1248, passedCount: 1140, failedCount: 108, passRatePercentage: 91.3 },
    ],
    topViolations: [
      { ruleId: 'v1', ruleName: 'Harsh Facial Shadow Detected', severity: 'high', occurrenceCount: 142, percentageOfFailures: 38.2 },
      { ruleId: 'v2', ruleName: 'Uneven Off-White Background', severity: 'medium', occurrenceCount: 96, percentageOfFailures: 25.8 },
      { ruleId: 'v3', ruleName: 'Low Head-to-Canvas Ratio', severity: 'medium', occurrenceCount: 74, percentageOfFailures: 19.9 },
      { ruleId: 'v4', ruleName: 'Eyeglasses Glare / Reflection', severity: 'critical', occurrenceCount: 38, percentageOfFailures: 10.2 },
      { ruleId: 'v5', ruleName: 'Slight Eye Line Tilt (> 3 degrees)', severity: 'low', occurrenceCount: 22, percentageOfFailures: 5.9 },
    ],
    countryStats: [
      { presetId: 'us', countryName: 'United States Passport (2x2")', flagEmoji: '🇺🇸', totalSubmissions: 540, passRate: 91.5, topViolation: 'Facial Shadow' },
      { presetId: 'schengen', countryName: 'Schengen Visa (35x45mm)', flagEmoji: '🇪🇺', totalSubmissions: 320, passRate: 86.2, topViolation: 'Background Shade' },
      { presetId: 'india', countryName: 'Indian Passport (51x51mm)', flagEmoji: '🇮🇳', totalSubmissions: 230, passRate: 87.8, topViolation: 'Head Ratio' },
      { presetId: 'uk', countryName: 'UK Passport (35x45mm)', flagEmoji: '🇬🇧', totalSubmissions: 158, passRate: 85.0, topViolation: 'Eyeglasses Glare' },
    ],
    trendData: [
      { dateLabel: 'Mon', passCount: 142, failCount: 18 },
      { dateLabel: 'Tue', passCount: 165, failCount: 22 },
      { dateLabel: 'Wed', passCount: 180, failCount: 15 },
      { dateLabel: 'Thu', passCount: 155, failCount: 25 },
      { dateLabel: 'Fri', passCount: 198, failCount: 14 },
      { dateLabel: 'Sat', passCount: 130, failCount: 20 },
      { dateLabel: 'Sun', passCount: 133, failCount: 17 },
    ],
  };
}

export function exportAnalyticsToCSV(summary: AnalyticsSummary, options: ExportFilterOptions): void {
  const rows: string[][] = [];

  rows.push(['SnapPass-AI Compliance Analytics Report']);
  rows.push([`Generated At: ${new Date().toISOString()}`]);
  rows.push([]);

  rows.push(['SUMMARY METRICS']);
  rows.push(['Total Photos Processed', summary.totalPhotosProcessed.toString()]);
  rows.push(['Overall Pass Rate (%)', summary.overallPassRate.toString()]);
  rows.push(['Average Score', summary.avgScore.toString()]);
  rows.push([]);

  rows.push(['RULE CATEGORY BREAKDOWN']);
  rows.push(['Category', 'Rule Name', 'Total Checked', 'Passed', 'Failed', 'Pass Rate (%)']);
  summary.metrics.forEach((m) => {
    rows.push([m.category, `"${m.name}"`, m.totalChecked.toString(), m.passedCount.toString(), m.failedCount.toString(), m.passRatePercentage.toString()]);
  });
  rows.push([]);

  if (options.includeRawViolations) {
    rows.push(['TOP FREQUENT VIOLATIONS']);
    rows.push(['Rule ID', 'Violation Description', 'Severity', 'Occurrence Count', 'Failure Share (%)']);
    summary.topViolations.forEach((v) => {
      rows.push([v.ruleId, `"${v.ruleName}"`, v.severity, v.occurrenceCount.toString(), v.percentageOfFailures.toString()]);
    });
    rows.push([]);
  }

  rows.push(['COUNTRY PRESET STATS']);
  rows.push(['Preset ID', 'Country Specification', 'Total Submissions', 'Pass Rate (%)', 'Top Violation']);
  summary.countryStats.forEach((c) => {
    rows.push([c.presetId, `"${c.countryName}"`, c.totalSubmissions.toString(), c.passRate.toString(), `"${c.topViolation}"`]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SnapPass_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAnalyticsToJSON(summary: AnalyticsSummary): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(summary, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `SnapPass_Analytics_Report_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}
