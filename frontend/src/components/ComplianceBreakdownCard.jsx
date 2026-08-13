import React from 'react';
import ComplianceScoreGauge from './ComplianceScoreGauge';

/**
 * ComplianceBreakdownCard — Detailed breakdown list displaying
 * checks, pass/fail status, scores, and AI recommendations.
 *
 * When onExportReport is provided, an "Export Report" button renders in
 * the header and calls the callback with the serialized metrics payload.
 */
export function ComplianceBreakdownCard({ metrics, onExportReport }) {
  if (!metrics) return null;

  const { totalScore, grade, status, checks } = metrics;

  const handleExport = () => {
    if (!onExportReport) return;
    onExportReport({
      totalScore,
      grade,
      status,
      checks,
      exportedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="compliance-breakdown-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <ComplianceScoreGauge score={totalScore} grade={grade} status={status} />
        {onExportReport && (
          <button
            type="button"
            onClick={handleExport}
            style={{
              flexShrink: 0,
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#93c5fd',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 200ms ease',
            }}
          >
            Export Report
          </button>
        )}
      </div>
      <div className="compliance-checks-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>
            Detailed AI Inspection Rules
          </h4>
          {onExportReport && (
            <button
              onClick={onExportReport}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Export Audit Summary
            </button>
          )}
        </div>
        {checks.map((check) => (
          <div
            key={check.id}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${check.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f8fafc' }}>
                {check.title}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: check.passed ? '#10b981' : '#ef4444',
                }}
              >
                {check.passed ? 'PASS' : 'WARN'} ({check.score}%)
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '0.4rem',
              }}
            >
              <div
                style={{
                  width: `${check.score}%`,
                  height: '100%',
                  backgroundColor: check.passed ? '#10b981' : '#ef4444',
                  transition: 'width 400ms ease',
                }}
              />
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.3 }}>
              {check.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplianceBreakdownCard;
