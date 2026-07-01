import React from 'react';
import './GuidelinesCustomizer.css';

function GuidelinesCustomizer({
  guideColor,
  onColorChange,
  guideOpacity,
  onOpacityChange,
  gridType,
  onGridTypeChange,
  darkMode,
}) {
  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Gold', value: '#eab308' },
  ];

  return (
    <div className={`guidelines-customizer ${darkMode ? 'guidelines-customizer--dark' : ''}`}>
      <h3 className="customizer-title">📐 Customize Guidelines</h3>

      <div className="customizer-group">
        <label className="customizer-label">Guide Line Color</label>
        <div className="color-presets-grid">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`color-preset-btn ${guideColor === c.value ? 'active' : ''}`}
              style={{ '--preset-color': c.value }}
              onClick={() => onColorChange(c.value)}
              title={`Use ${c.name} guidelines`}
            />
          ))}
        </div>
      </div>

      <div className="customizer-group">
        <label className="customizer-label">Overlay Opacity: {Math.round(guideOpacity * 100)}%</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={guideOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="opacity-slider"
        />
      </div>

      <div className="customizer-group">
        <label className="customizer-label">Alignment Grid Overlay</label>
        <div className="grid-toggle-container">
          <button
            type="button"
            className={`grid-toggle-btn ${gridType === 'none' ? 'active' : ''}`}
            onClick={() => onGridTypeChange('none')}
          >
            Biometric Silhouette
          </button>
          <button
            type="button"
            className={`grid-toggle-btn ${gridType === 'thirds' ? 'active' : ''}`}
            onClick={() => onGridTypeChange('thirds')}
          >
            Rule of Thirds
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuidelinesCustomizer;
