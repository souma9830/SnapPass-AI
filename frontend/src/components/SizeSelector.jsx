import React from 'react';
import './SizeSelector.css';

/**
 * SizeSelector — dropdown to pick a passport photo size preset.
 *
 * Props:
 *   selected  (string)        — currently selected preset id
 *   onChange  (fn(presetId))  — called on selection change
 *   presets   (array)         — optional array of preset objects;
 *                               defaults to built-in list
 */

const DEFAULT_PRESETS = [
  { id: '35x45',  label: '35×45 mm — India / UK' },
  { id: '51x51',  label: '51×51 mm — USA Visa' },
  { id: '33x48',  label: '33×48 mm — Schengen Visa' },
  { id: '40x60',  label: '40×60 mm — China Visa' },
  { id: '2x2in',  label: '2×2 inch — US Passport' },
];

function SizeSelector({ selected = '35x45', onChange, presets = DEFAULT_PRESETS }) {
  return (
    <div className="size-selector">
      <label className="size-selector__label" htmlFor="size-preset-select">
        <span className="size-selector__label-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <rect x="4" y="5" width="8" height="12" rx="2" />
            <rect x="12" y="7" width="8" height="12" rx="2" />
            <path d="M7 9h2M7 12h2M15 11h2M15 14h2" />
          </svg>
        </span>
        Photo Size Preset
      </label>
      <select
        id="size-preset-select"
        className="size-selector__select"
        value={selected}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        {presets.map(({ id, label }) => (
          <option key={id} value={id}>{label}</option>
        ))}
      </select>
      <p className="size-selector__hint">
        Select the country/visa standard that matches your requirement.
      </p>
    </div>
  );
}

export default SizeSelector;
