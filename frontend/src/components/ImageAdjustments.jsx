import React from 'react';

export const ImageAdjustments = ({ filters, onChange }) => {
  const handleSliderChange = (name, value) => {
    onChange({
      ...filters,
      [name]: parseInt(value, 10),
    });
  };

  return (
    <div className="image-adjustments-card" style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.02)', marginTop: '15px' }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Image Adjustments</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
          <label>Brightness</label>
          <span>{filters.brightness}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="150"
          value={filters.brightness}
          onChange={(e) => handleSliderChange('brightness', e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
          <label>Contrast</label>
          <span>{filters.contrast}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="150"
          value={filters.contrast}
          onChange={(e) => handleSliderChange('contrast', e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
          <label>Saturation</label>
          <span>{filters.saturation}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="150"
          value={filters.saturation}
          onChange={(e) => handleSliderChange('saturation', e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
export default ImageAdjustments;
