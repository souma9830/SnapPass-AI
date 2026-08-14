import React, { useState } from 'react';
import { blendBackgroundColor } from '../utils/backgroundBlender';
import './BackgroundBlenderControl.css';

export default function BackgroundBlenderControl({ canvasRef, onBlendComplete }) {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [feather, setFeather] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = [
    { label: 'White (US/EU)', hex: '#ffffff' },
    { label: 'Off-White', hex: '#f8fafc' },
    { label: 'Light Blue', hex: '#e0f2fe' },
    { label: 'Light Grey', hex: '#f3f4f6' }
  ];

  const handleApplyBlend = () => {
    if (!canvasRef || !canvasRef.current) return;
    setIsProcessing(true);
    setTimeout(() => {
      blendBackgroundColor(canvasRef.current, selectedColor, feather);
      setIsProcessing(false);
      if (onBlendComplete) onBlendComplete(selectedColor);
    }, 50);
  };

  return (
    <div className="bg-blender-container" data-testid="bg-blender-control">
      <h4 className="blender-title">Background Color Standardization & Blending</h4>
      
      <div className="preset-buttons-group">
        {presets.map(p => (
          <button
            key={p.hex}
            type="button"
            className={`preset-color-btn ${selectedColor === p.hex ? 'active' : ''}`}
            style={{ backgroundColor: p.hex }}
            onClick={() => setSelectedColor(p.hex)}
            title={p.label}
          />
        ))}
      </div>

      <div className="feather-slider-group">
        <label className="slider-label">Edge Softening (Feather): {feather}px</label>
        <input
          type="range"
          min="1"
          max="10"
          value={feather}
          onChange={(e) => setFeather(Number(e.target.value))}
          className="feather-range"
        />
      </div>

      <button
        type="button"
        className="apply-blend-btn"
        onClick={handleApplyBlend}
        disabled={isProcessing}
      >
        {isProcessing ? 'Blending...' : 'Apply Background Blend'}
      </button>
    </div>
  );
}
