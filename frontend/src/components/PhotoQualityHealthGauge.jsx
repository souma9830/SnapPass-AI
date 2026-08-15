import React from 'react';
import { calculateQualityGaugeMetrics } from '../utils/qualityGaugeScorer';
import './PhotoQualityHealthGauge.css';

export default function PhotoQualityHealthGauge({ metrics }) {
  const result = calculateQualityGaugeMetrics(metrics);

  return (
    <div className="quality-gauge-card" data-testid="photo-quality-health-gauge">
      <div className="gauge-header">
        <h4>Photo Quality Health Gauge</h4>
        <span className={`tier-badge ${result.statusTier.toLowerCase()}`}>
          {result.statusTier}
        </span>
      </div>

      <div className="gauge-score-display">
        <span className="score-number">{result.overallHealthScore}</span>
        <span className="score-max">/100</span>
      </div>

      <div className="submetrics-list">
        <div className="submetric-row">
          <span>Sharpness</span>
          <div className="bar-bg"><div className="bar-fill" style={{ width: `${result.sharpness}%` }}></div></div>
        </div>
        <div className="submetric-row">
          <span>Lighting</span>
          <div className="bar-bg"><div className="bar-fill" style={{ width: `${result.lighting}%` }}></div></div>
        </div>
        <div className="submetric-row">
          <span>Contrast</span>
          <div className="bar-bg"><div className="bar-fill" style={{ width: `${result.contrast}%` }}></div></div>
        </div>
      </div>
    </div>
  );
}
