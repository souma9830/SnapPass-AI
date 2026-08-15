import React, { useState, useRef, useCallback } from 'react';
import useZoomPan from '../hooks/useZoomPan';
import './ComparisonSlider.css';

function ComparisonSlider({ beforeSrc, afterSrc, alt = 'Comparison' }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const { zoom, position, zoomIn, zoomOut, resetView, setZoomLevel, handleMouseDown, handleMouseMove, handleMouseUp } = useZoomPan();

  const getClientX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

  const onDragStart = useCallback((e) => {
    dragging.current = true;
  }, []);

  const onDragMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = getClientX(e) - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onDragEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="comparison-wrapper">
      <div className="comparison-zoom-controls">
        <button onClick={zoomOut} title="Zoom out" className="comparison-zoom-btn">−</button>
        <span className="comparison-zoom-level">{Math.round(zoom * 100)}%</span>
        <button onClick={zoomIn} title="Zoom in" className="comparison-zoom-btn">+</button>
        <button onClick={resetView} title="Reset view" className="comparison-zoom-btn">⟲</button>
        <select
          className="comparison-zoom-select"
          value={zoom}
          onChange={(e) => setZoomLevel(e.target.value)}
        >
          {[0.5, 0.75, 1, 1.5, 2, 3, 4, 5].map((z) => (
            <option key={z} value={z}>{Math.round(z * 100)}%</option>
          ))}
        </select>
      </div>

      <div
        ref={containerRef}
        className="comparison-container"
        onMouseDown={(e) => { handleMouseDown(e); onDragStart(e); }}
        onMouseMove={(e) => { handleMouseMove(e); onDragMove(e); }}
        onMouseUp={() => { handleMouseUp(); onDragEnd(); }}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        role="slider"
        aria-label="Compare original and processed image"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={sliderPos}
        tabIndex={0}
      >
        <div
          className="comparison-image comparison-image--after"
          style={{
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }}
        >
          <img
            src={afterSrc}
            alt={`${alt} (processed)`}
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
        <div className="comparison-image comparison-image--before">
          <img
            src={beforeSrc}
            alt={`${alt} (original)`}
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
        <div className="comparison-handle" style={{ left: `${sliderPos}%` }}>
          <div className="comparison-handle__line" />
          <div className="comparison-handle__circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonSlider;
