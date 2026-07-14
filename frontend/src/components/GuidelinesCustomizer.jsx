import React from 'react';

/**
 * GuidelinesCustomizer Component
 * Allows user to choose a color for canvas guides
 */
const GuidelinesCustomizer = ({ guideColor, onColorChange }) => (
  <div>
    <label>Guide Color:</label>
    <input type="color" value={guideColor} onChange={(e) => onColorChange(e.target.value)} />
  </div>
);

export default GuidelinesCustomizer;