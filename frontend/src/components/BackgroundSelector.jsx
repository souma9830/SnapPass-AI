import React, { useCallback, useRef } from 'react';
import './BackgroundSelector.css';

/**
 * BackgroundSelector - lets the user pick a background colour for the passport photo.
 *
 * Implements WAI-ARIA radio group pattern with arrow key navigation:
 * - Left/Up arrow: move to previous swatch
 * - Right/Down arrow: move to next swatch
 * - Only the selected swatch is in the tab order (roving tabindex)
 *
 * Props:
 *   selected  (string)          - currently selected colour id
 *   onChange  (fn(colourId))    - called when user picks a colour
 */

const BACKGROUNDS = [
  { id: 'white',    label: 'White',      hex: '#ffffff' },
  { id: 'off-white', label: 'Off-White',  hex: '#f5f0e8' },
  { id: 'light-grey', label: 'Light Grey', hex: '#d1d5db' },
  { id: 'light-blue', label: 'Light Blue', hex: '#bfdbfe' },
  { id: 'light-red',  label: 'Light Red',  hex: '#fecaca' },
];

function BackgroundSelector({ selected = 'white', onChange }) {
  const listRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    const currentIndex = BACKGROUNDS.findIndex((bg) => bg.id === selected);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % BACKGROUNDS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + BACKGROUNDS.length) % BACKGROUNDS.length;
    } else {
      return;
    }

    const nextId = BACKGROUNDS[nextIndex].id;
    onChange && onChange(nextId);

    const buttons = listRef.current?.querySelectorAll('[role="radio"]');
    if (buttons && buttons[nextIndex]) {
      buttons[nextIndex].focus();
    }
  }, [selected, onChange]);

  return (
    <div className="bg-selector">
      <p className="bg-selector__heading" id="bg-selector-label">Background Colour</p>
      <div
        className="bg-selector__list"
        role="radiogroup"
        aria-labelledby="bg-selector-label"
        ref={listRef}
        onKeyDown={handleKeyDown}
      >
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
            tabIndex={selected === id ? 0 : -1}
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
