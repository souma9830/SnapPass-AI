import React from 'react';
import './UploadProgressOverlay.css';

export default function UploadProgressOverlay({ progress, isRetrying }) {
  if (progress === null) return null;

  return (
    <div className="upload-progress-overlay">
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p>{isRetrying ? 'Network unstable, retrying upload...' : `Uploading: ${progress}%`}</p>
    </div>
  );
}
