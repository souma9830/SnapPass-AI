/**
 * Canvas utility for drawing real-time ICAO passport face alignment oval guidelines.
 */

export const drawFaceGuideOval = (canvas, isAligned = false) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);

  // Draw semi-transparent dark backdrop mask
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(0, 0, width, height);

  // Clear out center oval for face target
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.ellipse(width / 2, height / 2, width * 0.28, height * 0.38, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();

  // Draw oval outline guide
  ctx.beginPath();
  ctx.ellipse(width / 2, height / 2, width * 0.28, height * 0.38, 0, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = isAligned ? '#10b981' : '#f59e0b';
  ctx.stroke();

  // Eye line indicator
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.42);
  ctx.lineTo(width * 0.8, height * 0.42);
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
};
