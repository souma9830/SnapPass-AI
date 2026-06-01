import React, { useState } from 'react';
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
  { id: '35x45', label: 'Passport Size Photo — India / UK', width: 35, height: 45 },
  { id: '51x51', label: 'Passport Size Photo — USA Visa', width: 51, height: 51 },
  { id: '33x48', label: 'Passport Size Photo — Schengen Visa', width: 33, height: 48 },
  { id: '40x60', label: 'Passport Size Photo — China Visa', width: 40, height: 60 },
  { id: '2x2in', label: 'Passport Size Photo — US Passport', width: 50.8, height: 50.8 },
  { id: '100x150', label: 'Postcard Size Photo', width: 100, height: 150 },
  { id: '25x25', label: 'Stamp Size Photo', width: 25, height: 25 },
  { id: '50x70', label: 'Passport Size Photo — Canada Passport', width: 50, height: 70 },
  { id: '45x45', label: 'Passport Size Photo — Japan Passport / Visa', width: 45, height: 45 },
  { id: '35x50', label: 'Passport Size Photo — Malaysia Passport', width: 35, height: 50 },
];

function SizeSelector({ selected = '35x45', onChange, presets = DEFAULT_PRESETS }) {
  const [unit, setUnit] = useState('mm');

  const convertDimension = (value) => {
    switch (unit) {
      case 'cm':
        return (value / 10).toFixed(1);

      case 'in':
        return (value / 25.4).toFixed(2);

      default:
        return value;
    }
  };

  const currentPreset =
    presets.find((preset) => preset.id === selected) || presets[0];

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

      <div className="size-selector__controls">
        <select
          id="size-preset-select"
          className="size-selector__select"
          value={selected}
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          {presets.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="size-selector__select size-selector__unit-select"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          aria-label="Measurement unit"
        >
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="in">in</option>
        </select>
      </div>

      <p className="size-selector__dimensions">
        📏 Dimensions:{' '}
        {convertDimension(currentPreset.width)}
        ×
        {convertDimension(currentPreset.height)} {unit}
      </p>

      <p className="size-selector__hint">
        Select the country/visa standard that matches your requirement.
      </p>
    </div>
  );
}

export default SizeSelector;