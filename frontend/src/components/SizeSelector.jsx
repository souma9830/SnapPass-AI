import React from 'react';
import './SizeSelector.css';

function SizeSelector({ presets = [], selected, onChange }) {
  return (
    <div className="size-selector">
      <span className="size-selector__label">
        <span className="size-selector__label-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <rect x="4" y="5" width="8" height="12" rx="2" />
            <rect x="12" y="7" width="8" height="12" rx="2" />
          </svg>
        </span>
        Photo Size Preset
      </span>
      <div className="size-selector__controls">
        <select
          className="size-selector__select"
          value={selected}
          onChange={(e) => onChange && onChange(e.target.value)}
          aria-label="Select passport photo size preset"
        >
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>
      {presets.find((p) => p.id === selected) && (
        <div className="size-selector__dimensions">
          {presets.find((p) => p.id === selected).dimensions}
        </div>
      )}
      <div className="size-selector__hint">
        Select the standard that matches your destination country
      </div>
    </div>
  );
}

export default SizeSelector;
