import React from 'react';
import './ImageAdjustments.css';

export const ImageAdjustments = ({ filters, onChange, onReset }) => {
  const handleSliderChange = (name, value) => {
    onChange({
      ...filters,
      [name]: parseInt(value, 10),
    });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hueRotate: 0,
        sepia: 0,
      });
    }
  };

  return (
    <div className="image-adjustments-card">
      <div className="image-adjustments-header">
        <h4 className="image-adjustments-title">Image Adjustments</h4>
        <button
          type="button"
          className="image-adjustments-reset-btn"
          onClick={handleReset}
          title="Reset filters to default"
        >
          Reset
        </button>
      </div>

      <div className="adjustment-field">
        <div className="adjustment-label-row">
          <label htmlFor="brightness-slider">Brightness</label>
          <span>{filters?.brightness ?? 100}%</span>
        </div>
        <input
          id="brightness-slider"
          type="range"
          min="50"
          max="150"
          value={filters?.brightness ?? 100}
          onChange={(e) => handleSliderChange('brightness', e.target.value)}
          className="adjustment-slider"
        />
      </div>

      <div className="adjustment-field">
        <div className="adjustment-label-row">
          <label htmlFor="contrast-slider">Contrast</label>
          <span>{filters?.contrast ?? 100}%</span>
        </div>
        <input
          id="contrast-slider"
          type="range"
          min="50"
          max="150"
          value={filters?.contrast ?? 100}
          onChange={(e) => handleSliderChange('contrast', e.target.value)}
          className="adjustment-slider"
        />
      </div>

      <div className="adjustment-field">
        <div className="adjustment-label-row">
          <label htmlFor="saturation-slider">Saturation</label>
          <span>{filters?.saturation ?? 100}%</span>
        </div>
        <input
          id="saturation-slider"
          type="range"
          min="50"
          max="150"
          value={filters?.saturation ?? 100}
          onChange={(e) => handleSliderChange('saturation', e.target.value)}
          className="adjustment-slider"
        />
      </div>
    </div>
  );
};

export default ImageAdjustments;

