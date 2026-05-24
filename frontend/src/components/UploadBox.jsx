import React, { useRef, useState } from 'react';
import './UploadBox.css';
import { validateImageFile } from '../utils/fileValidation';

/**
 * UploadBox — drag-and-drop + click-to-browse photo uploader.
 *
 * Props:
 *   onFileSelect(file) — called when a valid image file is chosen
 *   isUploading(bool) — when true, shows progress bar instead of drop zone
 *   progress(number) — upload progress percentage (0-100)
 *   fileName(string) — name of the file being uploaded
 */
function UploadBox({ onFileSelect, isUploading, progress = 0, fileName }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    const result = validateImageFile(file);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError('');
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  /* Drag handlers */
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = ()  => setIsDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  /* Input change */
  const onChange = (e) => handleFile(e.target.files[0]);

  /* Determine status text based on progress */
  const getStatusText = (pct) => {
    if (pct >= 100) return 'Upload complete!';
    if (pct >= 75)  return 'Almost there…';
    if (pct >= 40)  return 'Processing your photo…';
    return 'Uploading your photo…';
  };

  const isDone = progress >= 100;

  if (isUploading) {
    return (
      <div className="upload-box upload-box--uploading" id="upload-progress-container">
        <div className="upload-progress">
          {/* Animated icon */}
          <div
            className={`upload-progress__icon ${isDone ? 'upload-progress__icon--done' : ''}`}
            aria-hidden="true"
          >
            {isDone ? '✅' : '☁️'}
          </div>

          {/* Progress bar track */}
          <div className="upload-progress__bar">
            <div
              className={`upload-progress__fill ${isDone ? 'upload-progress__fill--done' : ''}`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              id="upload-progress-bar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Upload progress: ${progress}%`}
            />
          </div>

          {/* Percentage readout */}
          <p className="upload-progress__percentage">{Math.round(progress)}%</p>

          {/* Status message */}
          <p className={`upload-progress__text ${isDone ? 'upload-progress__text--done' : ''}`}>
            {getStatusText(progress)}
          </p>

          {/* File name pill */}
          {fileName && (
            <span className="upload-progress__filename" title={fileName}>
              📄 {fileName}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-box${isDragging ? ' upload-box--dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      aria-label="Click or drag a photo to upload"
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="upload-box__input"
        onChange={onChange}
        aria-hidden="true"
      />

      <div className="upload-box__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 16V5" />
          <path d="M8 9l4-4 4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      </div>
      <p className="upload-box__title">Drag & drop your photo here</p>
      <p className="upload-box__subtitle">or <span className="upload-box__browse">browse files</span></p>
      <p className="upload-box__hint">JPEG, PNG, WebP · Max 10 MB</p>

      {error && (
        <p className="upload-box__error" role="alert">{error}</p>
      )}
    </div>
  );
}

export default UploadBox;
