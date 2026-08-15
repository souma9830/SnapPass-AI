import React from 'react';
import './ColorTemperatureAdjuster.css';

function ColorTemperatureAdjuster({ temperature, tint, onChangeTemperature, onChangeTint, onReset, darkMode }) {
  return (
    <div className={`color-temperature-adjuster ${darkMode ? 'color-temperature-adjuster-dark' : ''}`}>
      <div className="temp-header">
        <h4 className="temp-title">🌡️ White Balance & Color Temperature</h4>
        <button
          type="button"
          onClick={onReset}
          className="temp-reset-btn"
          aria-label="Reset color temperature and tint"
        >
          Reset
        </button>
      </div>

      <div className="temp-sliders-grid">
        <div className="temp-control-group">
          <div className="temp-label-row">
            <span className="temp-label">Temperature</span>
            <span className="temp-val">{temperature > 0 ? `+${temperature}K` : `${temperature}K`}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={temperature}
            onChange={(e) => onChangeTemperature(Number(e.target.value))}
            className="temp-slider temp-slider-warm"
          />
          <div className="temp-scale-hint">
            <span>Cool (Blue)</span>
            <span>Warm (Amber)</span>
          </div>
        </div>

        <div className="temp-control-group">
          <div className="temp-label-row">
            <span className="temp-label">Tint Balance</span>
            <span className="temp-val">{tint > 0 ? `+${tint}` : `${tint}`}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={tint}
            onChange={(e) => onChangeTint(Number(e.target.value))}
            className="temp-slider temp-slider-tint"
          />
          <div className="temp-scale-hint">
            <span>Green</span>
            <span>Magenta</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorTemperatureAdjuster;
