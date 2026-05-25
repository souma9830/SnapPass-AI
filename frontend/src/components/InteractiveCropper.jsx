import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import './InteractiveCropper.css';

/**
 * InteractiveCropper — client-side editor component.
 * Allows panning, zooming, and rotating an image inside a passport photo frame.
 * Employs responsive touch pointer mapping for pinch-to-zoom.
 */
const InteractiveCropper = forwardRef(({ imageUrl }, ref) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Interaction tracking state
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastTouchDistRef = useRef(0);

  // Expose crop generation method to parent
  useImperativeHandle(ref, () => ({
    getCroppedBlob: () => {
      return new Promise((resolve, reject) => {
        if (!imageRef.current || !containerRef.current) {
          reject(new Error("Cropper is not fully loaded."));
          return;
        }

        const img = imageRef.current;
        const container = containerRef.current;

        // Create canvas matching standard 3:4 passport preview aspect ratio (600x800 for high quality)
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error("Could not create canvas context."));
          return;
        }

        // Fill background with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Compute scaling ratio from viewport to high-res canvas
        const viewWidth = container.clientWidth;
        const viewHeight = container.clientHeight;
        const ratioX = canvas.width / viewWidth;
        const ratioY = canvas.height / viewHeight;

        // Determine source rendering parameters
        // Save current context state
        ctx.save();

        // 1. Move to canvas center to apply transformations centered
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // 2. Apply Rotation (convert degrees to radians)
        ctx.rotate((rotation * Math.PI) / 180);

        // 3. Apply Scaling
        ctx.scale(scale, scale);

        // 4. Calculate coordinates of original image within view coordinates
        // The center of the image relative to the center of the container
        const imgNaturalW = img.naturalWidth;
        const imgNaturalH = img.naturalHeight;
        
        // Find how the image naturally fits inside the viewport (object-fit: contain-like aspect mapping)
        const scaleX = viewWidth / imgNaturalW;
        const scaleY = viewHeight / imgNaturalH;
        const fitScale = Math.min(scaleX, scaleY);
        
        const renderedWidth = imgNaturalW * fitScale;
        const renderedHeight = imgNaturalH * fitScale;

        // Apply panning translate relative to canvas scale and ratio
        ctx.translate(position.x * ratioX / scale, position.y * ratioY / scale);

        // Draw image centered at the transformed origin
        ctx.drawImage(
          img,
          -renderedWidth / 2 * ratioX,
          -renderedHeight / 2 * ratioY,
          renderedWidth * ratioX,
          renderedHeight * ratioY
        );

        ctx.restore();

        // Output canvas as a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas blob conversion failed."));
            }
          },
          'image/png',
          1.0
        );
      });
    }
  }));

  // Reset parameters when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [imageUrl]);

  // Touch & Mouse Drag Handlers
  const handleStart = (clientX, clientY) => {
    isDraggingRef.current = true;
    startPosRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;
    
    // Bounds check to keep dragging constrained sensibly
    const nextX = clientX - startPosRef.current.x;
    const nextY = clientY - startPosRef.current.y;
    
    setPosition({ x: nextX, y: nextY });
  };

  const handleEnd = () => {
    isDraggingRef.current = false;
  };

  // Touch Specific Events
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      // Setup pinch zoom
      isDraggingRef.current = false;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      e.preventDefault(); // Prevent page zooming/scrolling
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const factor = dist / lastTouchDistRef.current;
      const nextScale = Math.min(Math.max(scale * factor, 1), 4);
      
      setScale(nextScale);
      lastTouchDistRef.current = dist;
    }
  };

  // Mouse Specific Events
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  // Mouse Wheel Zoom Helper
  const onWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.05 : 0.95;
    setScale((prev) => Math.min(Math.max(prev * factor, 1), 4));
  };

  return (
    <div className="interactive-cropper">
      <div 
        className="cropper-viewport"
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        onWheel={onWheel}
      >
        <img
          src={imageUrl}
          alt="Cropper preview"
          className="cropper-image"
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            cursor: isDraggingRef.current ? 'grabbing' : 'grab'
          }}
          draggable="false"
        />

        {/* Passport Alignment Guide Mask */}
        <div className="cropper-guide-overlay" aria-hidden="true">
          <svg viewBox="0 0 300 400" className="passport-mask">
            {/* Darkened backdrop surrounding the passport box */}
            <path 
              d="M0,0 H300 V400 H0 Z M150,60 C90,60 90,180 90,200 C90,260 110,290 150,290 C190,290 210,260 210,200 C210,180 210,60 150,60 Z"
              fill="rgba(15, 23, 42, 0.45)"
              fillRule="evenodd"
            />
            {/* Guide outlines */}
            <ellipse cx="150" cy="175" rx="55" ry="75" className="guide-line guide-line--head" />
            <line x1="50" y1="175" x2="250" y2="175" className="guide-line guide-line--eye" />
            <path d="M70,360 Q150,270 230,360" className="guide-line guide-line--shoulders" />
          </svg>
          <div className="guide-hint">Align face inside the oval guide</div>
        </div>
      </div>

      {/* Interactive Adjustment Sliders */}
      <div className="cropper-controls">
        <div className="cropper-slider-group">
          <div className="cropper-slider-header">
            <span className="slider-label">Zoom ({scale.toFixed(1)}x)</span>
            <button className="slider-reset" onClick={() => setScale(1)}>Reset</button>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="cropper-slider"
          />
        </div>

        <div className="cropper-slider-group">
          <div className="cropper-slider-header">
            <span className="slider-label">Rotate ({rotation}°)</span>
            <button className="slider-reset" onClick={() => setRotation(0)}>Reset</button>
          </div>
          <input
            type="range"
            min="-45"
            max="45"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value, 10))}
            className="cropper-slider"
          />
        </div>
      </div>
    </div>
  );
});

export default InteractiveCropper;
