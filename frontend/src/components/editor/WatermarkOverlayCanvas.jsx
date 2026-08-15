import React from 'react';
import './WatermarkOverlayCanvas.css';

export default function WatermarkOverlayCanvas({ text }) {
  return (
    <div className="watermark-overlay-text">
      {text || 'PREVIEW STAMP'}
    </div>
  );
}
