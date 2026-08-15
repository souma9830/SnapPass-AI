import React from 'react';
import { calculateFacialAsymmetry } from '../utils/facialAsymmetryEvaluator';
import './FacialAsymmetryWidget.css';

export default function FacialAsymmetryWidget({ landmarks }) {
  const result = calculateFacialAsymmetry(landmarks);

  return (
    <div className="asymmetry-widget" data-testid="asymmetry-widget">
      <div className="asymmetry-header">
        <h4 className="asymmetry-title">Biometric Facial Symmetry</h4>
        <span className={`asymmetry-score-badge ${result.isCompliant ? 'passed' : 'warning'}`}>
          {result.symmetryScore}% Score
        </span>
      </div>

      <div className="asymmetry-metrics">
        <div className="asymmetry-metric">
          <span className="metric-name">Eye Horizontal Level Diff</span>
          <span className="metric-val">{result.eyeLevelDiffPx} px</span>
        </div>

        <div className="asymmetry-metric">
          <span className="metric-name">Mouth Midline Offset</span>
          <span className="metric-val">{result.mouthCenteringOffsetPx} px</span>
        </div>
      </div>

      <div className="symmetry-progress-bar">
        <div
          className={`progress-fill ${result.isCompliant ? 'good' : 'poor'}`}
          style={{ width: `${result.symmetryScore}%` }}
        />
      </div>
    </div>
  );
}
