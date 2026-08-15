import React, { useState, useEffect } from 'react';
import './StudioAnalyticsDashboard.css';
import { exportStudioFinancialPdf } from '../utils/exportStudioFinancialPdf';

function StudioAnalyticsDashboard({ darkMode }) {
  const [customerPrice, setCustomerPrice] = useState(12);
  const [paperCost, setPaperCost] = useState(0.40);
  const [inkCost, setInkCost] = useState(0.20);

  const [metrics, setMetrics] = useState({
    photosPrepared: 48,
    sheetsPrinted: 8,
    grossRevenue: 96.00,
    netProfit: 91.20,
    profitMargin: 95.0,
  });

  useEffect(() => {
    const gross = metrics.sheetsPrinted * customerPrice;
    const totalCost = metrics.sheetsPrinted * (Number(paperCost) + Number(inkCost));
    const profit = gross - totalCost;
    const margin = gross > 0 ? (profit / gross) * 100 : 0;

    setMetrics((prev) => ({
      ...prev,
      grossRevenue: Number(gross.toFixed(2)),
      netProfit: Number(profit.toFixed(2)),
      profitMargin: Number(margin.toFixed(1)),
    }));
  }, [customerPrice, paperCost, inkCost, metrics.sheetsPrinted]);

  return (
    <div className={`studio-dashboard-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="studio-header">
        <h1>📸 Studio Business & Profit Analytics</h1>
        <p>Monitor daily passport photo production, printing overheads, and net studio revenue.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">🖼️</span>
          <span className="kpi-value">{metrics.photosPrepared}</span>
          <span className="kpi-label">Photos Prepared Today</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📄</span>
          <span className="kpi-value">{metrics.sheetsPrinted}</span>
          <span className="kpi-label">A4 Sheets Printed</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">💰</span>
          <span className="kpi-value">${metrics.grossRevenue}</span>
          <span className="kpi-label">Gross Revenue</span>
        </div>

        <div className="kpi-card profit-card">
          <span className="kpi-icon">📈</span>
          <span className="kpi-value">${metrics.netProfit}</span>
          <span className="kpi-label">Net Profit ({metrics.profitMargin}%)</span>
        </div>
      </div>

      <div className="controls-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>⚙️ Live Studio Expense & Pricing Configurator</h3>
          <button
            onClick={() => exportStudioFinancialPdf({
              photosPrepared: metrics.photosPrepared,
              sheetsPrinted: metrics.sheetsPrinted,
              grossRevenue: metrics.grossRevenue,
              totalExpense: (metrics.sheetsPrinted * (Number(paperCost) + Number(inkCost))).toFixed(2),
              netProfit: metrics.netProfit,
              profitMargin: metrics.profitMargin,
              currencySymbol: '$',
            })}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            }}
          >
            📄 Download Daily Financial Report (PDF)
          </button>
        </div>
        <div className="inputs-grid">
          <div className="input-group">
            <label>Customer Price / Sheet ($)</label>
            <input
              type="number"
              step="0.5"
              value={customerPrice}
              onChange={(e) => setCustomerPrice(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Paper Cost / Sheet ($)</label>
            <input
              type="number"
              step="0.05"
              value={paperCost}
              onChange={(e) => setPaperCost(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Ink / Overhead / Sheet ($)</label>
            <input
              type="number"
              step="0.05"
              value={inkCost}
              onChange={(e) => setInkCost(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioAnalyticsDashboard;
