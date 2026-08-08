import React, { useState } from 'react';
import './SizeSelector.css';

function SizeSelector({ presets = [], selected, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Americas', 'Asia', 'Europe', 'Middle East', 'Oceania'];

  const filteredPresets = presets.filter((preset) => {
    const matchesSearch =
      !searchTerm ||
      preset.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (preset.dimensions && preset.dimensions.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion =
      selectedRegion === 'All' || preset.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const selectedPresetObj = presets.find((p) => p.id === selected);

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

      <div className="size-selector__filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          placeholder="Search country or dimensions (e.g., Germany, 35x45)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Filter photo presets"
          className="size-selector__search-input"
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            color: '#f8fafc',
            fontSize: '0.8rem',
          }}
        />
        <div className="size-selector__region-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              style={{
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRegion === region ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
                color: selectedRegion === region ? '#ffffff' : '#94a3b8',
                transition: 'all 200ms ease',
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="size-selector__controls">
        <select
          className="size-selector__select"
          value={selected}
          onChange={(e) => onChange && onChange(e.target.value)}
          aria-label="Select passport photo size preset"
        >
          {filteredPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {selectedPresetObj && (
        <div className="size-selector__dimensions">
          {selectedPresetObj.dimensions || `${selectedPresetObj.width || 35} x ${selectedPresetObj.height || 45} mm`}
        </div>
      )}
      <div className="size-selector__hint">
        Select the standard that matches your destination country requirements
      </div>
    </div>
  );
}

export default SizeSelector;

