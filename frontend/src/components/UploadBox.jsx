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
 */
function UploadBox({ onFileSelect, isUploading, progress = 0 }) {
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

  if (isUploading) {
    return (
      <div className="upload-box upload-box--uploading">
        <div className="upload-progress">
          <div className="upload-progress__bar">
            <div 
              className="upload-progress__fill" 
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <p className="upload-progress__text">Uploading... {progress}%</p>
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
