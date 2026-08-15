import React from 'react';
import './PhotoQualityHealthMeter.css';

function PhotoQualityHealthMeter({ file, complianceScore = 85, darkMode }) {
  if (!file) return null;

  const resolutionGrade = file.size > 500000 ? 'High (Pass)' : 'Low (Warning)';
  const lightingGrade = complianceScore >= 80 ? 'Optimal' : 'Needs Adjustment';
  const backgroundGrade = complianceScore >= 70 ? 'Clean White' : 'Shadow Detected';

  let overallHealth = 'EXCELLENT';
  let meterColor = '#10b981';
  if (complianceScore < 70) {
    overallHealth = 'POOR';
    meterColor = '#ef4444';
  } else if (complianceScore < 85) {
    overallHealth = 'FAIR';
    meterColor = '#f59e0b';
  }

  return (
    <div className={`photo-quality-health-meter ${darkMode ? 'photo-quality-health-meter-dark' : ''}`}>
      <div className="health-meter-header">
        <h4 className="health-meter-title">🩺 Photo Health & Biometric Audit</h4>
        <span className="health-badge" style={{ backgroundColor: meterColor }}>
          {overallHealth}
        </span>
      </div>

      <div className="health-bar-wrapper">
        <div className="health-bar-fill" style={{ width: `${complianceScore}%`, backgroundColor: meterColor }} />
      </div>

      <div className="health-checklist-grid">
        <div className="health-check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Resolution Grade: <strong>{resolutionGrade}</strong></span>
        </div>
        <div className="health-check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Lighting Uniformity: <strong>{lightingGrade}</strong></span>
        </div>
        <div className="health-check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Background Isolation: <strong>{backgroundGrade}</strong></span>
        </div>
      </div>
    </div>
  );
}

export default PhotoQualityHealthMeter;
