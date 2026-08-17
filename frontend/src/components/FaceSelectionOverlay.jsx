import React, { useRef, useState, useEffect, useCallback } from 'react';
import './FaceSelectionOverlay.css';

function FaceSelectionOverlay({
  imageUrl,
  faces,
  imageWidth,
  imageHeight,
  onSelectFace,
  onDismiss,
  darkMode,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const getScale = useCallback(() => {
    if (!containerRef.current || !imageWidth || !imageHeight) return { sx: 1, sy: 1 };
    const rect = containerRef.current.getBoundingClientRect();
    const sx = rect.width / imageWidth;
    const sy = rect.height / imageHeight;
    return { sx, sy };
  }, [imageWidth, imageHeight]);

  const drawBoxes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !faces || faces.length === 0) return;

    const { sx, sy } = getScale();
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const containerRect = containerRef.current.getBoundingClientRect();
    canvas.width = containerRect.width * dpr;
    canvas.height = containerRect.height * dpr;
    canvas.style.width = containerRect.width + 'px';
    canvas.style.height = containerRect.height + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      const fx = face.x * sx;
      const fy = face.y * sy;
      const fw = face.w * sx;
      const fh = face.h * sy;

      const isHovered = hoveredIndex === face.index;
      const isSelected = selectedLabel === face.index;

      ctx.strokeStyle = isSelected ? '#22c55e' : isHovered ? '#facc15' : '#3b82f6';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash(isSelected ? [] : [6, 4]);
      ctx.strokeRect(fx, fy, fw, fh);
      ctx.setLineDash([]);

      const pad = 6;
      ctx.fillStyle = isSelected
        ? 'rgba(34, 197, 94, 0.75)'
        : isHovered
          ? 'rgba(250, 204, 21, 0.85)'
          : 'rgba(59, 130, 246, 0.75)';
      const label = `Face ${face.index + 1}`;
      ctx.font = `600 13px system-ui, -apple-system, sans-serif`;
      const metrics = ctx.measureText(label);
      const labelW = metrics.width + pad * 2;
      const labelH = 22;

      const labelX = Math.max(0, Math.min(fx, canvas.width / dpr - labelW));
      const labelY = fy - labelH > 0 ? fy - labelH : fy;

      ctx.beginPath();
      ctx.roundRect(labelX, labelY, labelW, labelH, 4);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.fillText(label, labelX + pad, labelY + 16);
    });
  }, [faces, hoveredIndex, selectedLabel, getScale]);

  useEffect(() => {
    drawBoxes();
  }, [drawBoxes]);

  useEffect(() => {
    const handleResize = () => drawBoxes();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawBoxes]);

  const handleCanvasClick = useCallback(
    (e) => {
      if (!containerRef.current || !faces || faces.length === 0) return;

      const { sx, sy } = getScale();
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let hitFace = null;
      for (let i = faces.length - 1; i >= 0; i--) {
        const f = faces[i];
        const fx = f.x * sx;
        const fy = f.y * sy;
        const fw = f.w * sx;
        const fh = f.h * sy;
        if (clickX >= fx && clickX <= fx + fw && clickY >= fy && clickY <= fy + fh) {
          hitFace = f;
          break;
        }
      }

      if (hitFace) {
        setSelectedLabel(hitFace.index);
        onSelectFace(hitFace);
      }
    },
    [faces, getScale, onSelectFace]
  );

  const handleCanvasMove = useCallback(
    (e) => {
      if (!containerRef.current || !faces || faces.length === 0) return;

      const { sx, sy } = getScale();
      const rect = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      for (let i = faces.length - 1; i >= 0; i--) {
        const f = faces[i];
        const fx = f.x * sx;
        const fy = f.y * sy;
        const fw = f.w * sx;
        const fh = f.h * sy;
        if (mx >= fx && mx <= fx + fw && my >= fy && my <= fy + fh) {
          found = f.index;
          break;
        }
      }
      setHoveredIndex(found);
    },
    [faces, getScale]
  );

  return (
    <div className={`face-selection-overlay ${darkMode ? 'face-selection-overlay--dark' : ''}`}>
      <div className="face-selection-overlay__header">
        <h3 className="face-selection-overlay__title">
          {faces.length > 1
            ? `${faces.length} faces detected — select one`
            : '1 face detected — click to confirm'}
        </h3>
        <p className="face-selection-overlay__subtitle">
          Click a highlighted face to use it for your passport photo.
        </p>
      </div>

      <div
        ref={containerRef}
        className="face-selection-overlay__canvas-container"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Uploaded group photo"
          className="face-selection-overlay__image"
          draggable={false}
          crossOrigin="anonymous"
        />
        <canvas
          ref={canvasRef}
          className="face-selection-overlay__canvas"
        />
      </div>

      <div className="face-selection-overlay__actions">
        <button
          className="btn btn-ghost"
          onClick={onDismiss}
          aria-label="Upload a different photo"
        >
          Re-upload
        </button>
      </div>
    </div>
  );
}

export default FaceSelectionOverlay;
