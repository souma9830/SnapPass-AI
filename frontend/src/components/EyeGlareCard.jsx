import React from 'react';
import { analyzeEyeGlare } from '../utils/eyeGlareInspector';
import './EyeGlareCard.css';

export default function EyeGlareCard({ canvasRef, eyeRegions }) {
  const result = analyzeEyeGlare(canvasRef?.current, eyeRegions);

  return (
    <div className="eye-glare-card" data-testid="eye-glare-card">
      <div className="glare-header">
        <h4 className="glare-title">Eye Glare & Specular Reflection</h4>
        <span className={`glare-badge ${result.glareDetected ? 'fail' : 'pass'}`}>
          {result.glareDetected ? 'Flash Glare Warning' : 'No Glare Detected'}
        </span>
      </div>

      <div className="glare-details">
        <span className="details-label">Max Eye Specular Highlight:</span>
        <span className="details-value">{(result.maxSpecularRatio * 100).toFixed(1)}%</span>
      </div>

      {result.warnings.length > 0 && (
        <p className="glare-warning-text" data-testid="glare-warning">
          ⚠️ {result.warnings[0]}
        </p>
      )}
    </div>
  );
}
