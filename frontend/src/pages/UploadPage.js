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
        {[
          ['✅', 'Plain background preferred'],
          ['✅', 'Face clearly visible & centred'],
          ['✅', 'Neutral expression, eyes open'],
          ['❌', 'Avoid sunglasses or hats'],
        ].map(([icon, text]) => (
          <div key={text} className="upload-tip">
            <span className="upload-tip__icon">{icon}</span>
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
        🔒 Your photo is processed locally and never stored without your permission.
      </p>
    </div>
  );
}

export default UploadPage;
