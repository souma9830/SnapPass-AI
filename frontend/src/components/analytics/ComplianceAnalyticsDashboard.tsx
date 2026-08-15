import React, { useState, useMemo } from 'react';
import { AnalyticsSummary, ExportFilterOptions } from '../../types/analytics';
import { generateMockAnalyticsSummary, exportAnalyticsToCSV, exportAnalyticsToJSON } from '../../services/analyticsExportService';
import styles from './ComplianceAnalyticsDashboard.module.css';

export const ComplianceAnalyticsDashboard: React.FC = () => {
  const [data] = useState<AnalyticsSummary>(() => generateMockAnalyticsSummary());
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [includeViolations, setIncludeViolations] = useState<boolean>(true);

  const filteredTrend = useMemo(() => {
    return data.trendData;
  }, [data, timeRange]);

  const handleExportCSV = () => {
    const options: ExportFilterOptions = {
      includeRawViolations: includeViolations,
    };
    exportAnalyticsToCSV(data, options);
  };

  const handleExportJSON = () => {
    exportAnalyticsToJSON(data);
  };

  return (
    <div className={styles.dashboardContainer} aria-label="Compliance Analytics Dashboard">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Passport Compliance Analytics</h1>
          <p className={styles.subtitle}>Aggregate photo verification statistics, violation breakdowns, and country preset performance.</p>
        </div>
        <div className={styles.actionToolbar}>
          <div className={styles.segmentedControl}>
            <button
              className={timeRange === '7d' ? styles.activeSegment : styles.segment}
              onClick={() => setTimeRange('7d')}
              type="button"
            >
              7 Days
            </button>
            <button
              className={timeRange === '30d' ? styles.activeSegment : styles.segment}
              onClick={() => setTimeRange('30d')}
              type="button"
            >
              30 Days
            </button>
            <button
              className={timeRange === '90d' ? styles.activeSegment : styles.segment}
              onClick={() => setTimeRange('90d')}
              type="button"
            >
              90 Days
            </button>
          </div>
          <button className={styles.exportBtn} onClick={handleExportCSV} type="button">
            📥 Export CSV
          </button>
          <button className={styles.exportBtnSecondary} onClick={handleExportJSON} type="button">
            📄 Export JSON
          </button>
        </div>
      </header>

      {/* Metric Overview Cards */}
      <section className={styles.metricsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Total Photos Checked</div>
          <div className={styles.cardValue}>{data.totalPhotosProcessed.toLocaleString()}</div>
          <div className={styles.cardSubtext}>+12.4% vs previous period</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Overall Pass Rate</div>
          <div className={styles.cardValueHighlight}>{data.overallPassRate}%</div>
          <div className={styles.cardSubtext}>Target: &gt; 85.0%</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Average AI Quality Score</div>
          <div className={styles.cardValue}>{data.avgScore} / 100</div>
          <div className={styles.cardSubtext}>Based on face & background checks</div>
        </div>
      </section>

      {/* Rules Breakdown & Top Violations */}
      <section className={styles.twoColumnGrid}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Rule Category Pass Rates</h2>
          <div className={styles.ruleList}>
            {data.metrics.map((m) => (
              <div key={m.id} className={styles.ruleItem}>
                <div className={styles.ruleMeta}>
                  <span className={styles.ruleName}>{m.name}</span>
                  <span className={styles.ruleBadge}>{m.passRatePercentage}%</span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${m.passRatePercentage}%`, backgroundColor: m.passRatePercentage >= 90 ? '#10b981' : '#f59e0b' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Top Compliance Violations</h2>
          <div className={styles.violationList}>
            {data.topViolations.map((v) => (
              <div key={v.ruleId} className={styles.violationCard}>
                <div className={styles.violationHeader}>
                  <span className={styles.violationName}>{v.ruleName}</span>
                  <span className={`${styles.severityPill} ${styles[v.severity]}`}>{v.severity}</span>
                </div>
                <div className={styles.violationStats}>
                  <span>Occurrences: {v.occurrenceCount}</span>
                  <span>{v.percentageOfFailures}% of total failures</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Presets Table */}
      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Performance by Country Preset</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Preset Specification</th>
                <th>Submissions</th>
                <th>Pass Rate</th>
                <th>Most Common Failure</th>
              </tr>
            </thead>
            <tbody>
              {data.countryStats.map((c) => (
                <tr key={c.presetId}>
                  <td className={styles.countryCell}>
                    <span className={styles.flag}>{c.flagEmoji}</span>
                    <span>{c.countryName}</span>
                  </td>
                  <td>{c.totalSubmissions}</td>
                  <td>
                    <span className={c.passRate >= 90 ? styles.passHigh : styles.passMed}>{c.passRate}%</span>
                  </td>
                  <td>{c.topViolation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
