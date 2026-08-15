import React from 'react';

/**
 * ComplianceScoreGauge — Dynamic SVG gauge component visualizing
 * passport photo compliance percentage and compliance grade.
 */
export function ComplianceScoreGauge({ score = 92, grade = 'A', status = 'COMPLIANT' }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatusColor = () => {
    if (score >= 85) return '#10b981'; // Emerald green
    if (score >= 70) return '#f59e0b'; // Amber yellow
    return '#ef4444'; // Red
  };

  return (
    <div
      className="compliance-gauge-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ position: 'relative', width: '110px', height: '110px' }}>
        <svg width="110" height="110" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getStatusColor()}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 600ms ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: getStatusColor() }}>
            {score}%
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0' }}>
            Grade {grade}
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: `${getStatusColor()}20`,
          color: getStatusColor(),
          border: `1px solid ${getStatusColor()}40`,
        }}
      >
        {status === 'EXCELLENT' || status === 'COMPLIANT' ? 'Official Compliant' : status === 'NEEDS_REVISION' || status === 'NEEDS_ADJUSTMENT' ? 'Minor Adjustment Needed' : 'Non-Compliant'}
      </div>
    </div>
  );
}

export default ComplianceScoreGauge;
