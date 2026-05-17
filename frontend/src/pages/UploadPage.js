import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadPhoto } from '../services/photoService';
import './UploadPage.css';

/**
 * UploadPage — Step 1 of the flow.
 * User selects a photo; we create a local object URL and navigate to EditorPage.
 */
function UploadPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Create a local preview URL immediately for snappy UX
    const localUrl = URL.createObjectURL(file);

    try {
      // Upload to backend with progress tracking
      const uploadData = await uploadPhoto(file, (progress) => {
        setUploadProgress(progress);
      });

      // Pass file info to EditorPage via navigation state
      navigate('/editor', {
        state: {
          localUrl,
          filename: uploadData.filename || file.name,
          fileSize: file.size,
          fileId: uploadData.fileId,
        },
      });
    } catch (error) {
      // On error, still allow proceeding with local preview (fallback)
      console.error('Upload failed:', error);
      navigate('/editor', {
        state: {
          localUrl,
          filename: file.name,
          fileSize: file.size,
          uploadError: error.message,
        },
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
        <UploadBox onFileSelect={handleFileSelect} progress={uploadProgress} />
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
