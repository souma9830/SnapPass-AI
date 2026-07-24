import React from 'react';
import './VisualCropOverlay.css';

const VisualCropOverlay = ({ visible = true, title = 'ICAO 70%-80% Face Guide' }) => {
  if (!visible) return null;

  return (
    <div className="visual-crop-overlay" aria-label="Visual Crop Alignment Overlay">
      <div className="visual-crop-overlay__guide-box">
        <span className="visual-crop-overlay__label">{title}</span>
      </div>
    </div>
  );
};

export default VisualCropOverlay;
