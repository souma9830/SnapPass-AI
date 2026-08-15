import React from 'react';

export function StudioKpiOverview({
  photosPrepared = 0,
  sheetsPrinted = 0,
  grossRevenue = 0,
  netProfit = 0,
  profitMargin = 0,
  currency = '$',
}) {
  const cards = [
    { label: 'Photos Prepared Today', value: photosPrepared, icon: '🖼️', color: '#3b82f6' },
    { label: 'A4 Sheets Printed', value: sheetsPrinted, icon: '📄', color: '#8b5cf6' },
    { label: 'Gross Revenue', value: `${currency}${grossRevenue.toFixed(2)}`, icon: '💰', color: '#f59e0b' },
    { label: `Net Profit (${profitMargin}%)`, value: `${currency}${netProfit.toFixed(2)}`, icon: '📈', color: '#10b981' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${card.color}33`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>{card.icon}</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color }}>{card.value}</span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{card.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StudioKpiOverview;
