import React, { useState } from 'react';
import './CustomPaperSizeCalculator.css';

function CustomPaperSizeCalculator({ onApplyCustomPaper, darkMode }) {
  const [widthMm, setWidthMm] = useState(210);
  const [heightMm, setHeightMm] = useState(297);
  const [dpi, setDpi] = useState(300);
  const [preset, setPreset] = useState('custom');

  const pxWidth = Math.round((widthMm / 25.4) * dpi);
  const pxHeight = Math.round((heightMm / 25.4) * dpi);

  const presets = [
    { label: 'Custom Customizer', w: 210, h: 297 },
    { label: 'Standard A4 (210 × 297 mm)', w: 210, h: 297 },
    { label: 'US Letter (215.9 × 279.4 mm)', w: 215.9, h: 279.4 },
    { label: 'US Legal (215.9 × 355.6 mm)', w: 215.9, h: 355.6 },
    { label: 'Photo 4×6 in (101.6 × 152.4 mm)', w: 101.6, h: 152.4 },
    { label: 'Photo 5×7 in (127 × 177.8 mm)', w: 127, h: 177.8 },
  ];

  const handleSelectPreset = (idx) => {
    if (idx === 'custom') return;
    const selected = presets[idx];
    if (selected) {
      setWidthMm(selected.w);
      setHeightMm(selected.h);
      setPreset(idx);
    }
  };

  const handleApply = () => {
    if (onApplyCustomPaper) {
      onApplyCustomPaper({
        widthMm,
        heightMm,
        dpi,
        pxWidth,
        pxHeight,
        label: `Custom (${widthMm}×${heightMm}mm @ ${dpi}DPI)`,
      });
    }
  };

  return (
    <div className={`custom-paper-calculator ${darkMode ? 'custom-paper-calculator-dark' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="calc-title m-0">📄 Custom Paper & Dimension Calculator</h4>
        <select
          value={preset}
          onChange={(e) => handleSelectPreset(e.target.value)}
          className="calc-select text-xs font-medium"
        >
          <option value="custom">Preset Quick Select...</option>
          {presets.slice(1).map((p, i) => (
            <option key={i} value={i + 1}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="calc-inputs-grid">
        <div className="calc-field">
          <label className="calc-label">Width (mm)</label>
          <input
            type="number"
            min="20"
            max="1500"
            value={widthMm}
            onChange={(e) => {
              setWidthMm(Number(e.target.value));
              setPreset('custom');
            }}
            className="calc-input"
          />
        </div>

        <div className="calc-field">
          <label className="calc-label">Height (mm)</label>
          <input
            type="number"
            min="20"
            max="1500"
            value={heightMm}
            onChange={(e) => {
              setHeightMm(Number(e.target.value));
              setPreset('custom');
            }}
            className="calc-input"
          />
        </div>

        <div className="calc-field">
          <label className="calc-label">Target DPI</label>
          <select
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            className="calc-select"
          >
            <option value="150">150 DPI (Fast Draft)</option>
            <option value="300">300 DPI (High Quality Print)</option>
            <option value="600">600 DPI (Ultra Fine Studio)</option>
          </select>
        </div>
      </div>

      <div className="calc-summary flex justify-between items-center">
        <span className="text-xs">
          Target Canvas: <strong className="font-mono">{pxWidth} × {pxHeight} px</strong>
        </span>
        <button
          type="button"
          onClick={handleApply}
          className="calc-apply-btn"
        >
          Apply Dimensions
        </button>
      </div>
    </div>
  );
}

export default CustomPaperSizeCalculator;
