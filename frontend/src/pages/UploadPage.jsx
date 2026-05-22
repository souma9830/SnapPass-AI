import React, { useState } from 'react';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { uploadPhoto } from '../services/photoService';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setError(null);
    setLoading(true);
    try {
      const result = await uploadPhoto(file);
      navigate('/editor', { state: { uploadId: result.id } });
    } catch (err) {
      setError(
        err.message || 'Upload failed. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page upload-page">
      <h1>Upload Your Photo</h1>
      <p className="page__subtitle">
        Drag & drop or browse a clear portrait photo to get started.
      </p>

      <ErrorMessage
        message={error}
        onRetry={() => setError(null)}
      />

      {loading ? (
        <LoadingSpinner message="Uploading your photo..." />
      ) : (
        <UploadBox onUpload={handleUpload} />
      )}
    </div>
  );
};

export default UploadPage;
