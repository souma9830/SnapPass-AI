import React, { useState } from 'react';
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
  { id: 'off-white', label: 'Off-White',  hex: '#f5f0e8' },
  { id: 'light-grey', label: 'Light Grey', hex: '#d1d5db' },
  { id: 'light-blue', label: 'Light Blue', hex: '#bfdbfe' },
  { id: 'light-red',  label: 'Light Red',  hex: '#fecaca' },
];

function BackgroundSelector({ selected = 'white', onChange }) {
  const [announcement, setAnnouncement] = useState('');

  const handleSelect = (id, label) => {
    if (onChange) {
      onChange(id);
      setAnnouncement(`Background color changed to ${label}`);
    }
  };

  return (
    <div className="bg-selector">
      <p className="bg-selector__heading">Background Colour</p>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="bg-selector__list" role="radiogroup" aria-label="Background colour">
        {BACKGROUNDS.map(({ id, label, hex }) => (
          <button
            key={id}
            className={`bg-selector__item${selected === id ? ' bg-selector__item--active' : ''}`}
            style={{ '--swatch': hex }}
            onClick={() => handleSelect(id, label)}
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
