import React, { useState } from 'react';

export const OFFICIAL_BG_PRESETS = [
  { id: 'white', name: 'Plain White (#FFFFFF)', hex: '#FFFFFF', isCompliant: true },
  { id: 'offwhite', name: 'Off-White (#F8FAFC)', hex: '#F8FAFC', isCompliant: true },
  { id: 'light_blue', name: 'Light Blue (#E0F2FE)', hex: '#E0F2FE', isCompliant: true },
  { id: 'light_grey', name: 'Light Grey (#F1F5F9)', hex: '#F1F5F9', isCompliant: true },
  { id: 'royal_blue', name: 'Royal Blue (#1D4ED8)', hex: '#1D4ED8', isCompliant: false },
  { id: 'red', name: 'Red (#DC2626)', hex: '#DC2626', isCompliant: false },
];

/**
 * BackgroundColorPalettePicker — Passport background color selector supporting
 * official embassy compliant presets and custom HEX entry.
 */
export function BackgroundColorPalettePicker({ selectedColor = '#FFFFFF', onChangeColor }) {
  const [customHex, setCustomHex] = useState('');

  const handleHexSubmit = (e) => {
    e.preventDefault();
    if (/^#([0-9A-F]{3}){1,2}$/i.test(customHex)) {
      onChangeColor(customHex);
    }
  };

  return (
    <div
      className="bg-color-palette-picker"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>
          🎨 Official Background Color Studio
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {OFFICIAL_BG_PRESETS.map((preset) => {
          const isActive = selectedColor.toUpperCase() === preset.hex.toUpperCase();
          return (
            <button
              key={preset.id}
              onClick={() => onChangeColor(preset.hex)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem',
                borderRadius: '6px',
                border: isActive ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: preset.hex,
                  border: '1px solid #cbd5e1',
                  marginBottom: '0.3rem',
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
                {preset.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleHexSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <input
          type="text"
          placeholder="Custom HEX e.g. #F0F4F8"
          value={customHex}
          onChange={(e) => setCustomHex(e.target.value)}
          style={{
            flex: 1,
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            color: '#f8fafc',
            fontSize: '0.8rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </form>
    </div>
  );
}

export default BackgroundColorPalettePicker;
