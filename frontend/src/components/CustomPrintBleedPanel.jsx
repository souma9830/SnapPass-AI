import React, { useState } from 'react';
import { calculatePrintBleedGrid } from '../utils/customPrintBleedCalculator';
import './CustomPrintBleedPanel.css';

export default function CustomPrintBleedPanel({ onGridChange }) {
  const [bleedMarginMm, setBleedMarginMm] = useState(3.0);
  const [spacingMm, setSpacingMm] = useState(2.0);

  const grid = calculatePrintBleedGrid({
    paperWidthMm: 152.4, // 4x6"
    paperHeightMm: 101.6,
    photoWidthMm: 51.0,
    photoHeightMm: 51.0,
    bleedMarginMm,
    spacingMm
  });

  return (
    <div className="bleed-panel-container" data-testid="bleed-panel">
      <h4 className="bleed-panel-title">Print Bleed & Cutting Margin Configurator</h4>

      <div className="grid-summary-bar">
        <span className="summary-item">Max Yield: <strong>{grid.maxPhotos} Photos</strong></span>
        <span className="summary-item">Layout: <strong>{grid.columns}x{grid.rows} Grid</strong></span>
      </div>

      <div className="control-field">
        <label className="field-label">Bleed Margin Offset ({bleedMarginMm} mm)</label>
        <input
          type="range"
          min="0"
          max="6"
          step="0.5"
          value={bleedMarginMm}
          onChange={(e) => setBleedMarginMm(Number(e.target.value))}
          className="field-slider"
        />
      </div>

      <div className="control-field">
        <label className="field-label">Tile Inter-Spacing ({spacingMm} mm)</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={spacingMm}
          onChange={(e) => setSpacingMm(Number(e.target.value))}
          className="field-slider"
        />
      </div>
    </div>
  );
}
