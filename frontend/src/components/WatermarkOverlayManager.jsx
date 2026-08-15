import React, { useState } from 'react';
import './WatermarkOverlayManager.css';

export function applyWatermarkToCanvas(canvas, watermarkText, opacity = 0.35, position = 'diagonal') {
  if (!canvas || !watermarkText) return;
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `900 ${Math.max(16, Math.round(width / 20))}px sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (position === 'diagonal') {
    ctx.translate(width / 2, height / 2);
    ctx.rotate((-45 * Math.PI) / 180);
    ctx.strokeText(watermarkText, 0, 0);
    ctx.fillText(watermarkText, 0, 0);
  } else if (position === 'bottom-right') {
    ctx.textAlign = 'right';
    ctx.strokeText(watermarkText, width - 20, height - 20);
    ctx.fillText(watermarkText, width - 20, height - 20);
  } else if (position === 'tiled') {
    const stepX = width / 3;
    const stepY = height / 4;
    ctx.rotate((-30 * Math.PI) / 180);
    for (let x = -width; x < width * 2; x += stepX) {
      for (let y = -height; y < height * 2; y += stepY) {
        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
      }
    }
  }

  ctx.restore();
}

function WatermarkOverlayManager({ watermarkText, onWatermarkChange, isEnabled, onToggleEnable, darkMode }) {
  const [position, setPosition] = useState('diagonal');
  const [opacity, setOpacity] = useState(35);

  return (
    <div className={`watermark-overlay-manager ${darkMode ? 'watermark-overlay-manager-dark' : ''}`}>
      <div className="watermark-header">
        <label className="watermark-toggle-label">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggleEnable(e.target.checked)}
            className="watermark-checkbox"
          />
          <span className="watermark-title">🔒 Proof Watermark Protection</span>
        </label>
      </div>

      {isEnabled && (
        <div className="watermark-options">
          <div className="watermark-field">
            <label className="field-label">Custom Watermark Text</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => onWatermarkChange(e.target.value)}
              placeholder="e.g. DRAFT PROOF - SAMPLE ONLY"
              className="watermark-input"
            />
          </div>

          <div className="watermark-field-row">
            <div className="watermark-field">
              <label className="field-label">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="watermark-select"
              >
                <option value="diagonal">Center Diagonal</option>
                <option value="bottom-right">Bottom Right Corner</option>
                <option value="tiled">Full Tiled Grid</option>
              </select>
            </div>

            <div className="watermark-field">
              <label className="field-label">Opacity ({opacity}%)</label>
              <input
                type="range"
                min="10"
                max="80"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="watermark-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WatermarkOverlayManager;
