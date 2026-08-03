import React from 'react';

/**
 * GuidelinesCustomizer Component
 * Allows user to choose a color for canvas guides
 */
const GuidelinesCustomizer = ({ guideColor, onColorChange }) => (
  <div>
    <label htmlFor="guide-color">Guide Color:</label>
    <input id="guide-color" name="guide-color" type="color" value={guideColor} onChange={(e) => onColorChange(e.target.value)} />
  </div>
);

export default GuidelinesCustomizer;