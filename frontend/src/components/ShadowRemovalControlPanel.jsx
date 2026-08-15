import React, { useState } from 'react';
import './ShadowRemovalControlPanel.css';

export default function ShadowRemovalControlPanel({ onApplyShadowRemoval }) {
  const [shadowThreshold, setShadowThreshold] = useState(100);
  const [boostFactor, setBoostFactor] = useState(1.25);
  const [isEnabled, setIsEnabled] = useState(false);

  const handleApply = () => {
    if (onApplyShadowRemoval) {
      onApplyShadowRemoval({ shadowThreshold, boostFactor, isEnabled });
    }
  };

  return (
    <div className="shadow-removal-panel" data-testid="shadow-removal-panel">
      <div className="panel-header">
        <h4>Adaptive Shadow Removal</h4>
        <label className="switch">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            data-testid="shadow-toggle"
          />
          <span className="slider round"></span>
        </label>
      </div>

      {isEnabled && (
        <div className="panel-controls">
          <div className="control-group">
            <label>Shadow Luminance Cutoff: {shadowThreshold}</label>
            <input
              type="range"
              min="50"
              max="180"
              value={shadowThreshold}
              onChange={(e) => setShadowThreshold(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Brightness Compensation: {boostFactor}x</label>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={boostFactor}
              onChange={(e) => setBoostFactor(Number(e.target.value))}
            />
          </div>

          <button
            className="apply-btn"
            onClick={handleApply}
            data-testid="apply-shadow-btn"
          >
            Apply Shadow Suppression
          </button>
        </div>
      )}
    </div>
  );
}
