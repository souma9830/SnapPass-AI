import React, { useState } from 'react';
import { applyColorTemperatureAndTint } from '../utils/colorTemperatureAdjuster';
import './ColorTemperatureControl.css';

export default function ColorTemperatureControl({ canvasRef }) {
  const [temperature, setTemperature] = useState(0);
  const [tint, setTint] = useState(0);

  const handleApply = () => {
    if (!canvasRef || !canvasRef.current) return;
    applyColorTemperatureAndTint(canvasRef.current, temperature, tint);
  };

  const handleReset = () => {
    setTemperature(0);
    setTint(0);
  };

  return (
    <div className="color-temp-container" data-testid="color-temp-control">
      <h4 className="color-temp-title">Color Temperature & Skin Tone Balance</h4>

      <div className="slider-group">
        <label className="slider-label">Temperature: {temperature > 0 ? `+${temperature} (Warm)` : `${temperature} (Cool)`}</label>
        <input
          type="range"
          min="-50"
          max="50"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="color-slider"
        />
      </div>

      <div className="slider-group">
        <label className="slider-label">Tint: {tint > 0 ? `+${tint} (Green)` : `${tint} (Magenta)`}</label>
        <input
          type="range"
          min="-50"
          max="50"
          value={tint}
          onChange={(e) => setTint(Number(e.target.value))}
          className="color-slider"
        />
      </div>

      <div className="button-row">
        <button type="button" className="btn-reset" onClick={handleReset}>
          Reset
        </button>
        <button type="button" className="btn-apply" onClick={handleApply}>
          Apply Color Balance
        </button>
      </div>
    </div>
  );
}
