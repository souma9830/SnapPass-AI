import React, { useState } from 'react';
import './PrintCostEstimator.css';

function PrintCostEstimator({ photoCount, darkMode }) {
  const [paperCost, setPaperCost] = useState(0.25);
  const [inkCost, setInkCost] = useState(0.15);
  const [currency, setCurrency] = useState('$');

  const sheetCount = Math.ceil(photoCount / 6) || 1;
  const totalCost = (sheetCount * paperCost + sheetCount * inkCost).toFixed(2);
  const costPerPhoto = (totalCost / (photoCount || 1)).toFixed(2);
  const studioCommercialCost = (photoCount * 2.50).toFixed(2);
  const savings = Math.max(0, (studioCommercialCost - totalCost)).toFixed(2);

  return (
    <div className={`print-cost-estimator ${darkMode ? 'print-cost-estimator-dark' : ''}`}>
      <h4 className="cost-title">💡 Print Cost & Savings Estimator</h4>

      <div className="cost-settings-grid">
        <div className="cost-field">
          <label className="cost-label">Paper Cost / Sheet ({currency})</label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={paperCost}
            onChange={(e) => setPaperCost(Number(e.target.value))}
            className="cost-input"
          />
        </div>

        <div className="cost-field">
          <label className="cost-label">Ink Cost / Sheet ({currency})</label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={inkCost}
            onChange={(e) => setInkCost(Number(e.target.value))}
            className="cost-input"
          />
        </div>
      </div>

      <div className="cost-summary-box">
        <div className="cost-row">
          <span>Est. DIY Printing Cost:</span>
          <strong>{currency}{totalCost}</strong>
        </div>
        <div className="cost-row">
          <span>Retail Commercial Studio Cost:</span>
          <span className="strike-cost">{currency}{studioCommercialCost}</span>
        </div>
        <div className="cost-savings-badge">
          🎉 Total Estimated Savings: {currency}{savings}! ({costPerPhoto} {currency}/photo)
        </div>
      </div>
    </div>
  );
}

export default PrintCostEstimator;
