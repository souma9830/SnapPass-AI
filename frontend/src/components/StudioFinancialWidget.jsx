import React, { useState } from 'react';
import { calculateStudioFinancials } from '../utils/studioFinancialCalculator';
import './StudioFinancialWidget.css';

export default function StudioFinancialWidget() {
  const [sellingPrice, setSellingPrice] = useState(2.50);
  const [monthlyVolume, setMonthlyVolume] = useState(500);

  const financials = calculateStudioFinancials({
    sellingPricePerPhoto: sellingPrice,
    monthlyVolumePhotos: monthlyVolume
  });

  return (
    <div className="financial-widget-container" data-testid="studio-financial-widget">
      <h4 className="financial-widget-title">Commercial Studio Revenue & Cost Estimator</h4>

      <div className="financial-metrics-row">
        <div className="metric-box">
          <span className="box-label">Profit / Photo</span>
          <span className="box-val positive">${financials.profitPerPhoto}</span>
        </div>

        <div className="metric-box">
          <span className="box-label">Profit Margin</span>
          <span className="box-val highlight">{financials.profitMarginPercent}%</span>
        </div>

        <div className="metric-box">
          <span className="box-label">Monthly Net</span>
          <span className="box-val positive">${financials.monthlyProfit}</span>
        </div>
      </div>

      <div className="controls-section">
        <div className="control-item">
          <label className="ctrl-label">Retail Price per Photo ($):</label>
          <input
            type="number"
            step="0.25"
            min="0.5"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className="ctrl-input"
          />
        </div>

        <div className="control-item">
          <label className="ctrl-label">Monthly Photo Volume:</label>
          <input
            type="number"
            step="50"
            min="50"
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(Number(e.target.value))}
            className="ctrl-input"
          />
        </div>
      </div>
    </div>
  );
}
