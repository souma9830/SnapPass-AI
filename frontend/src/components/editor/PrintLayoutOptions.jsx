import React from 'react';

export const PrintLayoutOptions = ({ options, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...options,
      [name]: name === 'margins' || name === 'spacing' ? parseFloat(value) : value
    });
  };

  return (
    <div className="print-layout-options" style={{ padding: '15px', borderRadius: '8px', background: '#f9f9f9', marginTop: '10px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333' }}>Print Layout Configuration</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>Paper Size</label>
          <select name="paperSize" value={options.paperSize} onChange={handleChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="4x6">4" x 6" Photo Paper</option>
            <option value="A4">A4 Standard Sheet</option>
            <option value="5x7">5" x 7" Photo Paper</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>Grid Gap (px)</label>
          <input type="number" name="spacing" min="0" max="50" value={options.spacing} onChange={handleChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>Margins (px)</label>
          <input type="number" name="margins" min="0" max="100" value={options.margins} onChange={handleChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>Orientation</label>
          <select name="orientation" value={options.orientation} onChange={handleChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      </div>
    </div>
  );
};
