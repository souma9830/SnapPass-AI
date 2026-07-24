import React from 'react';
import './AttireManualAdjuster.css';

export const AttireManualAdjuster = ({ scale, xOffset, yOffset, onChangeScale, onChangeX, onChangeY }) => {
  return (
    <div className="attire-manual-adjuster">
      <h4 className="attire-adjuster-title">Manual Attire Fitting</h4>
      
      <div className="attire-adjuster-group">
        <div className="attire-adjuster-row">
          <div className="attire-adjuster-label-bar">
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
            className="attire-adjuster-slider"
          />
        </div>

        <div className="attire-adjuster-row">
          <div className="attire-adjuster-label-bar">
            <span>Horizontal Position (X)</span>
            <span>{xOffset}px</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="2"
            value={xOffset}
            onChange={(e) => onChangeX(parseInt(e.target.value, 10))}
            className="attire-adjuster-slider"
          />
        </div>

        <div className="attire-adjuster-row">
          <div className="attire-adjuster-label-bar">
            <span>Vertical Position (Y)</span>
            <span>{yOffset}px</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="2"
            value={yOffset}
            onChange={(e) => onChangeY(parseInt(e.target.value, 10))}
            className="attire-adjuster-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AttireManualAdjuster;

