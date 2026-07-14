import React from 'react';

export const AttireManualAdjuster = ({ scale, xOffset, yOffset, onChangeScale, onChangeX, onChangeY }) => {
  return (
    <div className="attire-manual-adjuster" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '12px' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Manual Attire Fitting</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>
            <span>Scale</span>
            <span>{Math.round(scale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={scale}
            onChange={(e) => onChangeScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>
            <span>Horizontal Position (X)</span>
            <span>{xOffset}px</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="2"
            value={xOffset}
            onChange={(e) => onChangeX(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>
            <span>Vertical Position (Y)</span>
            <span>{yOffset}px</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="2"
            value={yOffset}
            onChange={(e) => onChangeY(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AttireManualAdjuster;
