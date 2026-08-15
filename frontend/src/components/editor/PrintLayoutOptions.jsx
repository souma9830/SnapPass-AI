import React from 'react';
import './PrintLayoutOptions.css';
import { calculatePrintCapacity } from '../../utils/presetCalculator';

export const PrintLayoutOptions = ({ options, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...options,
      [name]: name === 'margins' || name === 'spacing' ? parseFloat(value) : value
    });
  };

  const capacity = calculatePrintCapacity(
    options.paperSize || '4x6',
    35,
    45,
    options.spacing || 2,
    options.margins || 5
  );

  return (
    <div className="print-layout-options">
      <div className="print-layout-header">
        <h3 className="print-layout-title">Print Layout Configuration</h3>
        <span className="print-capacity-badge">{capacity.totalCapacity} Photos ({capacity.cols}x{capacity.rows} Grid)</span>
      </div>
      <div className="print-layout-grid">
        <div>
          <label htmlFor="paper-size-select">Paper Size</label>
          <select id="paper-size-select" name="paperSize" value={options.paperSize} onChange={handleChange}>
            <option value="4x6">4" x 6" Photo Paper</option>
            <option value="A4">A4 Standard Sheet</option>
            <option value="5x7">5" x 7" Photo Paper</option>
          </select>
        </div>
        <div>
          <label htmlFor="spacing-input">Grid Gap (px)</label>
          <input id="spacing-input" type="number" name="spacing" min="0" max="50" value={options.spacing} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="margins-input">Margins (px)</label>
          <input id="margins-input" type="number" name="margins" min="0" max="100" value={options.margins} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="orientation-select">Orientation</label>
          <select id="orientation-select" name="orientation" value={options.orientation} onChange={handleChange}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PrintLayoutOptions;

