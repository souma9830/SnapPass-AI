import React from 'react';
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
  return (
    <div className="photo-preview">
      {/* Original */}
      {originalUrl && (
        <div className="photo-preview__panel">
          <span className="photo-preview__label">Original</span>
          <div className="photo-preview__frame">
            <img
              src={originalUrl}
              alt="Original uploaded — before processing"
              className="photo-preview__img"
            />
          </div>
        </div>
      )}

      {/* Processed */}
      <div className="photo-preview__panel">
        <span className="photo-preview__label">
          Processed
          {isProcessing && <span className="photo-preview__processing-badge">Processing…</span>}
        </span>
        <div className={`photo-preview__frame photo-preview__frame--processed${isProcessing ? ' photo-preview__frame--loading' : ''}`}>
          {processedUrl && !isProcessing ? (
            <img
              src={processedUrl}
              alt="AI-processed — background removed and centred"
              className="photo-preview__img"
            />
          ) : (
            <div className="photo-preview__empty">
              {isProcessing ? (
                <div className="photo-preview__spinner" aria-label="Processing" />
              ) : (
                <p className="photo-preview__empty-text">
                  Processed photo<br />will appear here
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhotoPreview;
