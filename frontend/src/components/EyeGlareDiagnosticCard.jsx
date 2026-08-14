import React from 'react';
import './EyeGlareDiagnosticCard.css';

export default function EyeGlareDiagnosticCard({ diagnosticResult }) {
  if (!diagnosticResult) {
    return (
      <div className="glare-card placeholder" data-testid="glare-card-placeholder">
        <p>No eye glare analysis data available.</p>
      </div>
    );
  }

  const { hasGlare, specularRatio, confidence } = diagnosticResult;

  return (
    <div className="glare-card" data-testid="glare-diagnostic-card">
      <div className="card-header">
        <h4>Eye Glare & Reflection Diagnostic</h4>
        <span className={`status-badge ${hasGlare ? 'alert' : 'clear'}`}>
          {hasGlare ? 'Glare Detected' : 'Clear Refraction'}
        </span>
      </div>

      <div className="glare-metrics">
        <div className="metric-box">
          <span className="label">Specular Saturation</span>
          <span className="value">{specularRatio}%</span>
        </div>
        <div className="metric-box">
          <span className="label">Diagnostic Confidence</span>
          <span className="value">{confidence}%</span>
        </div>
      </div>

      {hasGlare && (
        <div className="glare-warning-note">
          ⚠️ Lens reflections detected over eye pupil region. Please tilt head slightly or remove glasses.
        </div>
      )}
    </div>
  );
}
