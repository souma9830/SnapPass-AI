import React, { useState } from 'react';
import './PrintLayoutSelector.css';
import PrintGridCustomizer from './PrintGridCustomizer';

function PrintLayoutSelector({ selectedLayout, onChange, darkMode, selectedDpi = 300, onChangeDpi }) {
  const [paperFormat, setPaperFormat] = useState('A4');
  const [spacing, setSpacing] = useState(5);

  const layouts = [
    { id: 'a4', name: 'A4 Page (210 x 297 mm)', desc: 'Standard international document layout' },
    { id: 'letter', name: 'US Letter (8.5" x 11")', desc: 'Standard North American document layout' },
    { id: '4x6', name: 'Photo Card (4" x 6")', desc: 'Perfect for printing on glossy photo paper' },
  ];

  const dpiOptions = [150, 300, 600];

  return (
    <div className={`layout-selector-wrap ${darkMode ? 'layout-selector-wrap--dark' : ''} flex flex-col gap-4`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label className="layout-selector-label" style={{ margin: 0 }}>Print Sheet Dimensions</label>
        {onChangeDpi && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Target Quality:</span>
            {dpiOptions.map((dpi) => (
              <button
                key={dpi}
                type="button"
                onClick={() => onChangeDpi(dpi)}
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  background: selectedDpi === dpi ? '#3b82f6' : 'transparent',
                  color: selectedDpi === dpi ? '#ffffff' : '#64748b',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {dpi} DPI
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="layout-selector-grid">
        {layouts.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`layout-selector-card ${selectedLayout === l.id ? 'active' : ''}`}
            onClick={() => onChange(l.id)}
          >
            <span className="layout-selector-card__icon">📄</span>
            <div className="layout-selector-card__details">
              <span className="layout-selector-card__name">{l.name}</span>
              <span className="layout-selector-card__desc">{l.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <PrintGridCustomizer
        paperSize={paperFormat}
        spacingMm={spacing}
        onChange={({ paperSize, spacingMm }) => {
          setPaperFormat(paperSize);
          setSpacing(spacingMm);
        }}
      />
    </div>
  );
}

export default PrintLayoutSelector;
