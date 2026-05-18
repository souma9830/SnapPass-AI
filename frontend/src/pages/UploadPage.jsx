import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import './UploadPage.css';

/**
 * UploadPage — Step 1 of the flow.
 * User selects a photo; we create a local object URL and navigate to EditorPage.
 */
function UploadPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const tips = [
    { type: 'ok', text: 'Plain background preferred' },
    { type: 'ok', text: 'Face clearly visible & centred' },
    { type: 'ok', text: 'Neutral expression, eyes open' },
    { type: 'no', text: 'Avoid sunglasses or hats' },
  ];

  const iconMap = {
    ok: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="6" />
        <path d="M8 12.5l2.5 2.5L16 9" />
      </svg>
    ),
    no: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="6" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="10" width="14" height="10" rx="3" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </svg>
    ),
  };

  const handleFileSelect = async (file) => {
    setIsUploading(true);

    // Create a local preview URL immediately for snappy UX
    const localUrl = URL.createObjectURL(file);

    // TODO: Upload file to backend POST /api/upload, get back { filename, fileUrl }
    // const formData = new FormData();
    // formData.append('photo', file);
    // const res = await fetch('/api/upload', { method: 'POST', body: formData });
    // const data = await res.json();

    // Simulate a brief processing delay for demo purposes
    await new Promise((r) => setTimeout(r, 800));

    setIsUploading(false);

    // Pass file info to EditorPage via navigation state
    navigate('/editor', {
      state: {
        localUrl,
        filename: file.name,
        fileSize: file.size,
      },
    });
  };

  return (
    <div className="upload-page page-content">
      <div className="upload-page__header">
        <h1 className="section-title">Upload Your Photo</h1>
        <p className="section-subtitle">
          Choose a clear, front-facing photo. The AI will handle the rest.
        </p>
      </div>

      {/* Tips */}
      <div className="upload-page__tips">
        {tips.map(({ type, text }) => (
          <div key={text} className="upload-tip">
            <span className="upload-tip__icon" aria-hidden="true">
              {iconMap[type]}
            </span>
            <span className="upload-tip__text">{text}</span>
          </div>
        ))}
      </div>

      {/* Upload Box */}
      {isUploading ? (
        <LoadingSpinner message="Uploading & preparing your photo…" size="lg" />
      ) : (
        <UploadBox onFileSelect={handleFileSelect} />
      )}

      <p className="upload-page__privacy">
        <span className="upload-page__privacy-icon" aria-hidden="true">
          {iconMap.lock}
        </span>
        Your photo is processed locally and never stored without your permission.
      </p>
    </div>
  );
}

export default UploadPage;
