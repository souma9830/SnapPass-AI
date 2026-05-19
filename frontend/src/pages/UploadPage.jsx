import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import usePhotoUpload from '../hooks/usePhotoUpload';
import './UploadPage.css';
import { motion } from 'framer-motion';

/**
 * UploadPage — Step 1 of the flow.
 * User selects a photo; we create a local object URL and navigate to EditorPage.
 */
function UploadPage() {
  const navigate = useNavigate();
  const { uploadFile, uploadedFile, isUploading, error, } = usePhotoUpload();

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

  const handleFileSelect = async (file) => {await uploadFile(file);};
  useEffect(() => {
    if (!uploadedFile) return;
    navigate('/editor', {
      state: {
        localUrl: uploadedFile.localUrl,
        filename: uploadedFile.filename,
        fileSize: uploadedFile.fileSize,
      },
    });
  }, [uploadedFile, navigate]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay }
    })
  };

  return (
    <div className="upload-page page-content">
      <motion.div
        className="upload-page__header"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h1 className="section-title">Upload Your Photo</h1>
        <p className="section-subtitle">
          Choose a clear, front-facing photo. The AI will handle the rest.
        </p>
      </motion.div>
      {error && (
        <p className="upload-page__error" role="alert">
          {error}
        </p>
      )}

      {/* Tips */}
      <div className="upload-page__tips">
        {tips.map(({ type, text }, idx) => (
          <motion.div
            key={text}
            className="upload-tip"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2 + (idx * 0.1)} // Staggers each tip by 100ms
          >
            <span className="upload-tip__icon" aria-hidden="true">
              {iconMap[type]}
            </span>
            <span className="upload-tip__text">{text}</span>
          </motion.div>
        ))}
      </div>

      {/* Upload Box (Wrapped in a motion div to animate together) */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.5} // Loads after the tips
      >
        {isUploading ? (
          <LoadingSpinner message="Uploading & preparing your photo…" size="lg" />
        ) : (
          <UploadBox onFileSelect={handleFileSelect} />
        )}
      </motion.div>

      <motion.p
        className="upload-page__privacy"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.6}
      >
        <span className="upload-page__privacy-icon" aria-hidden="true">
          {iconMap.lock}
        </span>
        Your photo is processed locally and never stored without your permission.
      </motion.p>
    </div>
  );
}

export default UploadPage;
