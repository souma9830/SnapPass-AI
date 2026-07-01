import React from 'react';
import './PrintLayoutSelector.css';

function PrintLayoutSelector({ selectedLayout, onChange, darkMode }) {
  const layouts = [
    { id: 'a4', name: 'A4 Page (210 x 297 mm)', desc: 'Standard international document layout' },
    { id: 'letter', name: 'US Letter (8.5" x 11")', desc: 'Standard North American document layout' },
    { id: '4x6', name: 'Photo Card (4" x 6")', desc: 'Perfect for printing on glossy photo paper' },
  ];

  return (
    <div className={`layout-selector-wrap ${darkMode ? 'layout-selector-wrap--dark' : ''}`}>
      <label className="layout-selector-label">Print Sheet Dimensions</label>
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
    </div>
  );
}

export default PrintLayoutSelector;
