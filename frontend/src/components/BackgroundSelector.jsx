import React, { useCallback, useRef, useState } from 'react';
import './BackgroundSelector.css';
import { BACKGROUND_COLOURS } from '../data/backgroundColours';

function BackgroundSelector({ selected = 'white', onChange }) {
  const listRef = useRef(null);
  const colorInputRef = useRef(null);
  const [customHex, setCustomHex] = useState('#e8f4ff');

  const isCustomActive = selected && selected.startsWith('#');

  const handlePresetClick = useCallback(
    (id) => {
      if (id === 'custom') {
        colorInputRef.current?.click();
        return;
      }
      onChange && onChange(id);
    },
    [onChange]
  );

  const handleCustomHexChange = useCallback(
    (e) => {
      const hex = e.target.value;
      setCustomHex(hex);
      onChange && onChange(hex);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      const currentIndex = BACKGROUND_COLOURS.findIndex(
        (bg) => bg.id === selected || (bg.id === 'custom' && isCustomActive)
      );
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % BACKGROUND_COLOURS.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex =
          (currentIndex - 1 + BACKGROUND_COLOURS.length) %
          BACKGROUND_COLOURS.length;
      } else {
        return;
      }

      const next = BACKGROUND_COLOURS[nextIndex];
      handlePresetClick(next.id);

      const buttons = listRef.current?.querySelectorAll('[role="radio"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    },
    [selected, isCustomActive, handlePresetClick]
  );

  return (
    <div className="bg-selector">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <p className="bg-selector__heading" id="bg-selector-label" style={{ margin: 0 }}>
          Background Colour
        </p>
        <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
          ICAO Compliant
        </span>
      </div>

      <div
        className="bg-selector__list"
        role="radiogroup"
        aria-labelledby="bg-selector-label"
        ref={listRef}
        onKeyDown={handleKeyDown}
      >
        {BACKGROUND_COLOURS.map(({ id, label, hex, country }) => {
          const isActive = id === 'custom' ? isCustomActive : selected === id;
          const swatchColor =
            id === 'custom' ? (isCustomActive ? selected : customHex) : hex;

          return (
            <button
              key={id}
              className={`bg-selector__item${isActive ? ' bg-selector__item--active' : ''}`}
              style={{ '--swatch': swatchColor }}
              onClick={() => handlePresetClick(id)}
              role="radio"
              aria-checked={isActive}
              aria-label={country ? `${label} — ${country}` : label}
              title={country ? `${label} (${country})` : label}
              tabIndex={isActive ? 0 : -1}
            >
              <span
                className="bg-selector__swatch"
                style={{
                  background:
                    swatchColor ||
                    'conic-gradient(red, yellow, green, cyan, blue, magenta, red)',
                }}
              />
              <span className="bg-selector__label">{label}</span>
              {country && (
                <span className="bg-selector__country">{country}</span>
              )}
            </button>
          );
        })}
      </div>

      <input
        ref={colorInputRef}
        type="color"
        value={isCustomActive ? selected : customHex}
        onChange={handleCustomHexChange}
        aria-label="Choose a custom background colour"
        className="bg-selector__color-input"
        tabIndex={-1}
      />

      {isCustomActive && (
        <p className="bg-selector__custom-hint">
          Custom colour: <code>{selected}</code>
        </p>
      )}
    </div>
  );
}

export default BackgroundSelector;
