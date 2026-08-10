import React from 'react';
import './PresetFilterManager.css';

export const COMPLIANCE_PRESETS = [
  {
    id: 'us_passport',
    name: 'US Passport Clean',
    description: 'Auto-adjust contrast +20% and brightness +5% for US State Dept guidelines.',
    settings: { brightness: 105, contrast: 120, saturation: 100, sharpness: 10, gamma: 1.0 },
    badge: 'US Recommended',
  },
  {
    id: 'uk_passport',
    name: 'UK / EU Balanced Neutral',
    description: 'Neutral color temperature with enhanced edge sharpness for biometric scanning.',
    settings: { brightness: 100, contrast: 110, saturation: 95, sharpness: 15, gamma: 1.05 },
    badge: 'ICAO Compliant',
  },
  {
    id: 'schengen_visa',
    name: 'Schengen High Contrast',
    description: 'High facial border contrast with reduced shadows under chin.',
    settings: { brightness: 108, contrast: 125, saturation: 100, sharpness: 12, gamma: 0.95 },
    badge: 'EU Visa',
  },
  {
    id: 'studio_portrait',
    name: 'Soft Studio Lighting',
    description: 'Softens facial harsh shadows while retaining neutral background white.',
    settings: { brightness: 102, contrast: 105, saturation: 105, sharpness: 5, gamma: 1.1 },
    badge: 'Studio Polish',
  },
  {
    id: 'india_passport',
    name: 'India Passport Matte',
    description: 'Optimized RGB tonal distribution for Indian passport print specification.',
    settings: { brightness: 104, contrast: 115, saturation: 102, sharpness: 10, gamma: 1.0 },
    badge: 'India Standard',
  },
];

function PresetFilterManager({ activePresetId, onSelectPreset, onResetPreset, darkMode }) {
  return (
    <div className={`preset-filter-manager ${darkMode ? 'preset-filter-manager-dark' : ''}`}>
      <div className="preset-filter-header">
        <h4 className="preset-filter-title">✨ Compliance Photo Presets</h4>
        {activePresetId && (
          <button
            type="button"
            className="preset-reset-btn"
            onClick={onResetPreset}
            aria-label="Reset photo adjustments to default"
          >
            Reset Custom Adjustments
          </button>
        )}
      </div>

      <div className="preset-grid">
        {COMPLIANCE_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-card ${isActive ? 'preset-card-active' : ''} ${darkMode ? 'preset-card-dark' : ''}`}
              onClick={() => onSelectPreset(preset)}
              aria-pressed={isActive}
            >
              <div className="preset-card-header">
                <span className="preset-card-name">{preset.name}</span>
                <span className="preset-card-badge">{preset.badge}</span>
              </div>
              <p className="preset-card-desc">{preset.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetFilterManager;
