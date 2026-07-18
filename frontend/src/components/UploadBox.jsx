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
import { correctImageOrientation } from '../utils/exifRotation';

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
 *   onFileSelect(file) — called when a valid image file is chosen
 *   queue — optional upload queue array from useUploadQueue
 *   addToQueue — function to add files to the queue
 */
function UploadBox({ onFileSelect, queue, addToQueue }) {
  const { language } = useLanguage();
  const t = translations[language];
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleFile = async (file) => {
    setError('');

    if (!file) {
      showToast('Please select an image file.', 'error');
      return;
    }

    setIsValidating(true);
    try {
      // Auto-rotate the image if EXIF orientation is present
      const processedFile = await correctImageOrientation(file);

      const result = validateImageFile(processedFile);
      if (!result.valid) {
        showToast(result.error, 'error');
        return;
      }

      if (addToQueue) {
        addToQueue([processedFile]);
        return;
      }

      // Stage 2 — async: binary magic-byte signature verification
      const isMagicValid = await validateImageMagicBytes(processedFile);
      if (!isMagicValid) {
        showToast(
          'Invalid file structure. The file signature does not match a valid JPG, PNG, or WebP image.',
          'error'
        );
        return;
      }

      // Stage 3 — async: pixel dimension gate for 300 DPI print quality
      const dimResult = await validateImageDimensions(processedFile);
      if (!dimResult.valid) {
        showToast(dimResult.error, 'error');
        return;
      }

      // All checks passed — hand off to parent
      if (onFileSelect) {
        onFileSelect(processedFile);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 1 && addToQueue) {
      addToQueue(files);
    } else {
      handleFile(files[0]);
    }
  };

  const onChange = (e) => {
    const files = e.target.files;
    if (files.length > 1 && addToQueue) {
      addToQueue(files);
    } else {
      handleFile(files[0]);
    }
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
      onKeyDown={(e) =>
        e.key === 'Enter' && !isValidating && inputRef.current.click()
      }
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
          <svg
            viewBox="0 0 24 24"
            focusable="false"
            aria-hidden="true"
            className="upload-box__spinner"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="31.4"
              strokeDashoffset="10"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 16V5" />
            <path d="M8 9l4-4 4 4" />
            <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
        )}
      </div>

      {error && (
        <p className="upload-box__error" role="alert">{error}</p>
      )}

      {queue && queue.length > 0 && (
        <div className="upload-queue">
          <div className="upload-queue__header">
            <span>{queue.length} file{queue.length !== 1 ? 's' : ''}</span>
            <span className="upload-queue__badge">{queue.filter(f => f.status === 'done').length}/{queue.length}</span>
          </div>
          <div className="upload-queue__items">
            {queue.slice(0, 5).map((item) => (
              <div key={item.id} className={`upload-queue__item upload-queue__item--${item.status}`}>
                <span className="upload-queue__name">{item.name}</span>
                <span className="upload-queue__status">
                  {item.status === 'queued' && 'Waiting'}
                  {item.status === 'uploading' && `${item.progress}%`}
                  {item.status === 'done' && 'Done'}
                  {item.status === 'failed' && 'Failed'}
                  {item.status === 'cancelled' && 'Cancelled'}
                </span>
              </div>
            ))}
            {queue.length > 5 && (
              <div className="upload-queue__more">+{queue.length - 5} more</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadBox;
