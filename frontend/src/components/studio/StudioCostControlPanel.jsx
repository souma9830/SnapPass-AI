import React from 'react';

export function StudioCostControlPanel({
  customerPrice,
  paperCost,
  inkCost,
  onChangeCustomerPrice,
  onChangePaperCost,
  onChangeInkCost,
  darkMode = false,
}) {
  return (
    <div
      style={{
        marginTop: '32px',
        padding: '24px',
        borderRadius: '16px',
        background: darkMode ? '#1e293b' : '#f8fafc',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>⚙️ Live Profit Margin & Expense Control Panel</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
        Adjust pricing parameters below for instant profit recalculation across all active production runs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Customer Price / Sheet ($)</label>
          <input
            type="number"
            step="0.5"
            value={customerPrice}
            onChange={(e) => onChangeCustomerPrice(Number(e.target.value))}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Paper Cost / Sheet ($)</label>
          <input
            type="number"
            step="0.05"
            value={paperCost}
            onChange={(e) => onChangePaperCost(Number(e.target.value))}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Ink / Overhead / Sheet ($)</label>
          <input
            type="number"
            step="0.05"
            value={inkCost}
            onChange={(e) => onChangeInkCost(Number(e.target.value))}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default StudioCostControlPanel;
