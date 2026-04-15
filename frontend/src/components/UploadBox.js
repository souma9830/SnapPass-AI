import React, { useRef, useState } from 'react';
import './UploadBox.css';

/**
 * UploadBox — drag-and-drop + click-to-browse photo uploader.
 *
 * Props:
 *   onFileSelect(file) — called when a valid image file is chosen
 */
function UploadBox({ onFileSelect }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 10;

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are accepted.');
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be smaller than ${MAX_SIZE_MB} MB.`);
      return false;
    }
    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (file && validateFile(file)) {
      onFileSelect && onFileSelect(file);
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

      <div className="upload-box__icon" aria-hidden="true">📤</div>
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
