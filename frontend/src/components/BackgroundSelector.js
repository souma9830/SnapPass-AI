import React from 'react';
import './BackgroundSelector.css';

/**
 * BackgroundSelector — lets the user pick a background colour for the passport photo.
 *
 * Props:
 *   selected  (string)          — currently selected colour id
 *   onChange  (fn(colourId))    — called when user picks a colour
 */

const BACKGROUNDS = [
  { id: 'white',    label: 'White',      hex: '#ffffff' },
  { id: 'offwhite', label: 'Off-White',  hex: '#f5f0e8' },
  { id: 'light-grey', label: 'Light Grey', hex: '#d1d5db' },
  { id: 'blue',     label: 'Light Blue', hex: '#bfdbfe' },
  { id: 'red',      label: 'Light Red',  hex: '#fecaca' },
];

function BackgroundSelector({ selected = 'white', onChange }) {
  return (
    <div className="bg-selector">
      <p className="bg-selector__heading">Background Colour</p>
      <div className="bg-selector__list" role="radiogroup" aria-label="Background colour">
        {BACKGROUNDS.map(({ id, label, hex }) => (
          <button
            key={id}
            className={`bg-selector__item${selected === id ? ' bg-selector__item--active' : ''}`}
            style={{ '--swatch': hex }}
            onClick={() => onChange && onChange(id)}
            role="radio"
            aria-checked={selected === id}
            aria-label={label}
            title={label}
          >
            <span className="bg-selector__swatch" style={{ background: hex }} />
            <span className="bg-selector__label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BackgroundSelector;
