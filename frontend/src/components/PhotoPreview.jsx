import React, { useRef, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './PhotoPreview.css';

/**
 * PhotoPreview — displays original and processed passport photo side by side.
 *
 * Props:
 *   originalUrl  (string) — blob URL or server URL of the original photo
 *   processedUrl (string) — URL of the AI-processed photo (optional)
 *   isProcessing (bool)   — shows loading state over the processed panel
 */
function PhotoPreview({ originalUrl, processedUrl, isProcessing }) {
  const [showGuidelines, setShowGuidelines] = useState(true);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [sliderPosition, setSliderPosition] = useState(50);

const comparisonRef = useRef(null);
const handleSliderMove = (e) => {
  if (!comparisonRef.current) return;

  const rect = comparisonRef.current.getBoundingClientRect();

  const clientX =
    e.touches?.[0]?.clientX || e.clientX;

  const position =
    ((clientX - rect.left) / rect.width) * 100;

  const clamped = Math.max(0, Math.min(100, position));

  setSliderPosition(clamped);
};

  return (
  <div className="photo-preview">

    {/* Original */}
    {originalUrl && (
      <div className="photo-preview__panel">
        <span className="photo-preview__label">
          Original
        </span>

        <div className="photo-preview__frame photo-preview__frame--original">

          <img
            src={originalUrl}
            alt="Original uploaded — before processing"
            className="photo-preview__img"
          />

          {/* Floating Glassmorphic Guidelines Toggle */}
          <button
            type="button"
            className={`photo-preview__toggle-btn ${
              showGuidelines
                ? 'photo-preview__toggle-btn--active'
                : ''
            }`}
            onClick={() =>
              setShowGuidelines(!showGuidelines)
            }
            title={
              showGuidelines
                ? 'Hide Passport Guidelines Overlay'
                : 'Show Passport Guidelines Overlay'
            }
          >
            <svg
              className="photo-preview__toggle-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
              />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>

            <span className="photo-preview__toggle-text">
              Guidelines
            </span>
          </button>

          {/* Smart Compliance Guidelines Grid */}
          {showGuidelines && (
            <div className="photo-preview__overlay-grid">

              <div className="photo-preview__corner photo-preview__corner--tl" />
              <div className="photo-preview__corner photo-preview__corner--tr" />
              <div className="photo-preview__corner photo-preview__corner--bl" />
              <div className="photo-preview__corner photo-preview__corner--br" />

              <div className="photo-preview__guide photo-preview__guide--center-line" />

              <div className="photo-preview__guide photo-preview__guide--head-oval">
                <span className="photo-preview__guide-tag photo-preview__guide-tag--oval">
                  CROWN LEVEL
                </span>
              </div>

              <div className="photo-preview__guide photo-preview__guide--eye-line">
                <span className="photo-preview__guide-tag photo-preview__guide-tag--eye">
                  EYES LEVEL
                </span>
              </div>

              <div className="photo-preview__guide photo-preview__guide--chin-line">
                <span className="photo-preview__guide-tag photo-preview__guide-tag--chin">
                  CHIN LEVEL
                </span>
              </div>

            </div>
          )}

        </div>
      </div>
    )}

    {/* Processed */}
    <div className="photo-preview__panel">

      <span className="photo-preview__label">
        Processed

        {isProcessing && (
          <span className="photo-preview__processing-badge">
            Processing…
          </span>
        )}
      </span>

      <div
        className={`photo-preview__frame photo-preview__frame--processed${
          isProcessing
            ? ' photo-preview__frame--loading'
            : ''
        }`}
      >

        {processedUrl && !isProcessing ? (
          <>

            {!imageLoaded && (
              <div className="photo-preview__image-preloader">
                <LoadingSpinner size="md" />
              </div>
            )}

            {/* BEFORE / AFTER COMPARISON */}
            <div className="photo-preview__compare-container">

              {/* Original */}
              <img
                src={originalUrl}
                alt="Original"
                className="photo-preview__compare-original"
              />

              {/* Processed Overlay */}
              <div
                className="photo-preview__compare-overlay"
                style={{
                  width: `${sliderPosition}%`
                }}
              >
                <img
                  src={processedUrl}
                  alt="Processed"
                  className="photo-preview__compare-processed"
                  onLoad={() =>
                    setImageLoaded(true)
                  }
                />
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) =>
                  setSliderPosition(e.target.value)
                }
                className="photo-preview__slider"
              />

              {/* Divider */}
              <div
                className="photo-preview__divider"
                style={{
                  left: `${sliderPosition}%`
                }}
              />

            </div>

          </>
        ) : (
          <div className="photo-preview__empty">

            {isProcessing ? (
              <LoadingSpinner size="md" />
            ) : (
              <p className="photo-preview__empty-text">
                Upload and process a photo to preview the AI-generated result
              </p>
            )}

          </div>
        )}

      </div>
    </div>

  </div>
);  
export default PhotoPreview;
}
