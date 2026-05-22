import React, { useState } from 'react';
import PhotoPreview from '../components/PhotoPreview';
import BackgroundSelector from '../components/BackgroundSelector';
import SizeSelector from '../components/SizeSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { processPhoto } from '../services/photoService';
import { useNavigate, useLocation } from 'react-router-dom';

const EditorPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [background, setBackground] = useState('#FFFFFF');
  const [size, setSize] = useState('35x45');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProcess = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await processPhoto({
        uploadId: state?.uploadId,
        background,
        size,
      });
      navigate('/print-preview', { state: { processedId: result.id } });
    } catch (err) {
      setError(
        err.message || 'AI processing failed. Please try again or use a different photo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page editor-page">
      <h1>Customise Your Photo</h1>
      <p className="page__subtitle">
        Choose a background colour and passport size standard.
      </p>

      <ErrorMessage
        message={error}
        onRetry={() => setError(null)}
      />

      {loading ? (
        <LoadingSpinner message="AI is processing your photo..." />
      ) : (
        <>
          <PhotoPreview uploadId={state?.uploadId} />
          <BackgroundSelector value={background} onChange={setBackground} />
          <SizeSelector value={size} onChange={setSize} />
          <button className="btn btn--primary" onClick={handleProcess}>
            Generate Passport Photo
          </button>
        </>
      )}
    </div>
  );
};

export default EditorPage;
