import React, { useState } from 'react';
import { calculatePrintBleedDimensions } from '../utils/printBleedCalculator';
import './PrintBleedMarginAdjuster.css';

export default function PrintBleedMarginAdjuster({ onUpdateBleed }) {
  const [paperWidthMm, setPaperWidthMm] = useState(101.6); // 4 inches
  const [paperHeightMm, setPaperHeightMm] = useState(152.4); // 6 inches
  const [bleedMm, setBleedMm] = useState(3);

  const dims = calculatePrintBleedDimensions(paperWidthMm, paperHeightMm, bleedMm);

  const handleBleedChange = (val) => {
    setBleedMm(val);
    if (onUpdateBleed) {
      onUpdateBleed(calculatePrintBleedDimensions(paperWidthMm, paperHeightMm, val));
    }
  };

  return (
    <div className="bleed-adjuster-card" data-testid="bleed-margin-adjuster">
      <div className="card-header">
        <h4>Print Bleed & Cut Line Adjuster</h4>
        <span className="dpi-tag">300 DPI High-Res</span>
      </div>

      <div className="control-row">
        <label>Bleed Margin: {bleedMm} mm</label>
        <input
          type="range"
          min="0"
          max="10"
          value={bleedMm}
          onChange={(e) => handleBleedChange(Number(e.target.value))}
          data-testid="bleed-range-slider"
        />
      </div>

      <div className="dim-summary">
        <div className="dim-box">
          <span className="dim-label">Total Sheet Size</span>
          <span className="dim-val">{dims.totalWidthMm} x {dims.totalHeightMm} mm</span>
        </div>
        <div className="dim-box">
          <span className="dim-label">Canvas Pixels</span>
          <span className="dim-val">{dims.widthPx300Dpi} x {dims.heightPx300Dpi} px</span>
        </div>
      </div>
    </div>
  );
}
