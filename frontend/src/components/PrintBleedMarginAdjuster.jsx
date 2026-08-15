import React from 'react';
import './PrintBleedMarginAdjuster.css';

function PrintBleedMarginAdjuster({ bleedMm, marginMm, onChangeBleed, onChangeMargin, darkMode }) {
  return (
    <div className={`print-bleed-margin-adjuster ${darkMode ? 'print-bleed-margin-adjuster-dark' : ''}`}>
      <h4 className="bleed-adjuster-title">📏 Print Bleed & Page Margins</h4>
      
      <div className="bleed-controls-grid">
        <div className="bleed-control-group">
          <label className="bleed-label">
            Photo Bleed ({bleedMm} mm)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={bleedMm}
            onChange={(e) => onChangeBleed(Number(e.target.value))}
            className="bleed-slider"
          />
          <span className="bleed-hint">Extra border space for paper trimming cutter.</span>
        </div>

        <div className="bleed-control-group">
          <label className="bleed-label">
            Page Outer Margin ({marginMm} mm)
          </label>
          <input
            type="range"
            min="5"
            max="25"
            step="1"
            value={marginMm}
            onChange={(e) => onChangeMargin(Number(e.target.value))}
            className="bleed-slider"
          />
          <span className="bleed-hint">Unprinted border around the photo print grid sheet.</span>
        </div>
      </div>
    </div>
  );
}

export default PrintBleedMarginAdjuster;
