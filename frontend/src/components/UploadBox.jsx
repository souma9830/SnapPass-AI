import React, { useRef, useState } from 'react';
import './UploadBox.css';
import {
  validateImageFile,
  validateImageMagicBytes,
  validateImageDimensions,
} from '../utils/fileValidation';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useToast } from '../context/ToastContext';

/**
 * UploadBox — drag-and-drop + click-to-browse photo uploader.
 *
 * Runs a three-stage validation pipeline before forwarding the file:
 *   1. MIME type, extension, and size limit (synchronous)
 *   2. Binary magic-byte signature check (async)
 *   3. Pixel dimension check — enforces the minimum resolution needed for
 *      high-quality 300 DPI passport photo output (async)
 *
 * Props:
 *   onFileSelect(file) — called only when all checks pass
 */
function UploadBox({ onFileSelect }) {
  const { language } = useLanguage();
  const t = translations[language];
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleFile = async (file) => {
    if (!file) {
      showToast('Please select an image file.', 'error');
      return;
    }

    setIsValidating(true);

    try {
      // Stage 1 — synchronous: MIME type, extension, file size, empty-file guard
      const basicResult = validateImageFile(file);
      if (!basicResult.valid) {
        showToast(basicResult.error, 'error');
        return;
      }

      // Stage 2 — async: binary magic-byte signature verification
      const isMagicValid = await validateImageMagicBytes(file);
      if (!isMagicValid) {
        showToast(
          'Invalid file structure. The file signature does not match a valid JPG, PNG, or WebP image.',
          'error',
        );
        return;
      }

      // Stage 3 — async: pixel dimension gate for 300 DPI print quality
      const dimResult = await validateImageDimensions(file);
      if (!dimResult.valid) {
        showToast(dimResult.error, 'error');
        return;
      }

      // All checks passed — hand off to parent
      if (onFileSelect) {
        onFileSelect(file);
      }
    } finally {
      setIsValidating(false);
    }
  };

  /* Drag handlers */
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* Input change */
  const onChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
  };

  return (
    <div
      className={`upload-box${isDragging ? ' upload-box--dragging' : ''}${isValidating ? ' upload-box--validating' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !isValidating && inputRef.current.click()}
      role="button"
      tabIndex={0}
      aria-label="Click or drag a photo to upload"
      aria-busy={isValidating}
      onKeyDown={(e) => e.key === 'Enter' && !isValidating && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="upload-box__input"
        onChange={onChange}
        aria-hidden="true"
        disabled={isValidating}
      />

      <div className="upload-box__icon" aria-hidden="true">
        {isValidating ? (
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="upload-box__spinner">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 16V5" />
            <path d="M8 9l4-4 4 4" />
            <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
        )}
      </div>

      <p className="upload-box__title">
        {isValidating ? 'Checking image…' : t.dragDropPhoto}
      </p>
      <p className="upload-box__subtitle">
        {isValidating ? 'Validating format, size, and quality' : (
          <>or <span className="upload-box__browse">{t.browseFiles}</span></>
        )}
      </p>
      <p className="upload-box__hint">{t.uploadFormatsLimit}</p>
    </div>
  );
}

export default UploadBox;
