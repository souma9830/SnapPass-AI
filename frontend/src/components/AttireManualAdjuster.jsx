import React from 'react';
import './AttireManualAdjuster.css';

export const AttireManualAdjuster = ({
  scale = 1,
  xOffset = 0,
  yOffset = 0,
  rotation = 0,
  onChangeScale,
  onChangeX,
  onChangeY,
  onChangeRotation,
  onReset,
}) => {
  return (
    <div className="attire-manual-adjuster">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 className="attire-adjuster-title" style={{ margin: 0 }}>Manual Attire Fitting</h4>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Reset Fitting
          </button>
        )}
      </div>

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
            onChange={(e) => onChangeScale && onChangeScale(parseFloat(e.target.value))}
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
            onChange={(e) => onChangeX && onChangeX(parseInt(e.target.value, 10))}
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
            onChange={(e) => onChangeY && onChangeY(parseInt(e.target.value, 10))}
            className="attire-adjuster-slider"
          />
        </div>

        {onChangeRotation && (
          <div className="attire-adjuster-row">
            <div className="attire-adjuster-label-bar">
              <span>Rotation Angle</span>
              <span>{rotation}°</span>
            </div>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={rotation}
              onChange={(e) => onChangeRotation(parseInt(e.target.value, 10))}
              className="attire-adjuster-slider"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttireManualAdjuster;
