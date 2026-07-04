import React from 'react';

const GuidelinesCustomizer = ({ guideColor, onColorChange }) => (
  <div>
    <label>Guide Color:</label>
    <input type="color" value={guideColor} onChange={(e) => onColorChange(e.target.value)} />
  </div>
);

export default GuidelinesCustomizer;