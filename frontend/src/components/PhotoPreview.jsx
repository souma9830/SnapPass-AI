import React from 'react';
import './PhotoPreview.css';

function PhotoPreview({
  imageUrl,
  filename,
  onReset,
  onProceed,
  isUploading,
  darkMode,
  showOverlay = false,
}) {
  return (
    <div className="photo-preview">
      <div className="photo-preview__panel">
        <div className="photo-preview__label">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="4" y="6" width="16" height="12" rx="3" />
            <path d="M8 12h8" />
            <path d="M12 9v6" />
          </svg>
          Uploaded Photo
          {isUploading && (
            <span className="photo-preview__processing-badge">
              Processing...
            </span>
          )}
        </div>
        <div
          className={`photo-preview__frame ${isUploading ? 'photo-preview__frame--loading' : ''}`}
        >
          <img src={imageUrl} alt={filename} className="photo-preview__img" />
          {showOverlay && (
            <div className="photo-preview__overlay-grid" aria-hidden="true">
              <div className="photo-preview__corner photo-preview__corner--tl" />
              <div className="photo-preview__corner photo-preview__corner--tr" />
              <div className="photo-preview__corner photo-preview__corner--bl" />
              <div className="photo-preview__corner photo-preview__corner--br" />
              <div className="photo-preview__guide--center-line" />
            </div>
          )}
        </div>
        <div
          className="photo-preview__actions"
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-sm)',
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={onReset}
            disabled={isUploading}
            aria-label="Reset and choose another photo"
            style={{ flex: 1 }}
          >
            Re-upload
          </button>
          <button
            className="btn btn-primary"
            onClick={onProceed}
            disabled={isUploading}
            aria-label="Proceed to editor"
            style={{ flex: 1 }}
          >
            {isUploading ? 'Processing...' : 'Edit Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhotoPreview;
