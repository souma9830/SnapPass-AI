/**
 * imageProcessingService.js
 * Image manipulation service providing client-side canvas transformations,
 * background tinting, and attire overlay composition routines.
 */

export function applyBackgroundTint(canvas, targetHex = '#FFFFFF') {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = targetHex;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.95);
}

export function drawAttireOverlay(canvas, attireImage, position = { x: 0, y: 0, scale: 1.0 }) {
  if (!canvas || !attireImage) return null;
  const ctx = canvas.getContext('2d');
  const w = attireImage.width * position.scale;
  const h = attireImage.height * position.scale;

  ctx.drawImage(attireImage, position.x, position.y, w, h);
  return canvas.toDataURL('image/png');
}

export default {
  applyBackgroundTint,
  drawAttireOverlay,
};
