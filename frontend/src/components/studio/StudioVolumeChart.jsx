import React from 'react';

export function StudioVolumeChart({ data = [], darkMode = false }) {
  const maxVolume = Math.max(...data.map((d) => d.sheetsPrinted || 1), 1);

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: darkMode ? '#1e293b' : '#ffffff',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        marginTop: '24px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>📊 Production Volume & Sheet Output Trends</h3>
      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Daily printed A4 sheet quantities over time</span>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', height: '180px', marginTop: '24px' }}>
        {data.map((item) => {
          const heightPercent = Math.round((item.sheetsPrinted / maxVolume) * 100);
          return (
            <div key={item.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{item.sheetsPrinted}</span>
              <div style={{ width: '100%', maxWidth: '36px', flex: 1, background: 'rgba(226, 232, 240, 0.5)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: `${Math.max(12, heightPercent)}%`, background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: '8px', transition: 'height 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudioVolumeChart;
