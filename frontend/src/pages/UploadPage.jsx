import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadBox from '../components/UploadBox';
import PhotoPreview from '../components/PhotoPreview';
import UploadProgress from '../components/UploadProgress';
import usePhotoUpload from '../hooks/usePhotoUpload';
import { compressImage } from '../utils/imageCompression';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { tips, iconMap } from '../data/UploadPageData';
import './UploadPage.css';

function UploadPage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const { uploadFile, uploadedFile, isUploading, error, uploadProgress } =
    usePhotoUpload();

  const tips = [
    { type: 'ok', text: t.tipPlainBg },
    { type: 'ok', text: t.tipFaceVisible },
    { type: 'ok', text: t.tipNeutralExpression },
    { type: 'no', text: t.tipAvoidAccessories },
  ];

  const handleFileSelect = async (file) => {
    reset();
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.92,
      });
      await uploadFile(compressed);
    } catch (err) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setLocalPreview(null);
    }
  };

  const handleProceed = () => {
    if (uploadedFile) {
      navigate('/editor', {
        state: {
          filename: uploadedFile.filename,
          fileUrl: uploadedFile.fileUrl,
          localUrl: uploadedFile.localUrl || localPreview,
        },
      });
    }
  };

  const displayUrl = uploadedFile?.localUrl || localPreview;
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
  };

  return (
    <div className={`upload-toggle ${darkMode ? 'upload-toggle-dark' : ''}`}>
      <div className="upload-page page-content">
        <motion.div
          className="upload-page__header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <h1
            className={`section-title ${darkMode ? 'section-title-dark' : 'section-title-light'}`}
          >
            {t.uploadPhoto}
          </h1>
          <p
            className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : 'section-subtitle-light'}`}
          >
            {t.uploadSubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          {displayUrl ? (
            <PhotoPreview
              imageUrl={displayUrl}
              filename={uploadedFile?.filename || 'preview'}
              onReset={reset}
              onProceed={handleProceed}
              isUploading={isUploading}
              darkMode={darkMode}
            />
          ) : (
            <>
              <UploadBox onFileSelect={handleFileSelect} />
              <UploadProgress progress={uploadProgress} darkMode={darkMode} />
            </>
          )}
        </motion.div>

        {error && (
          <motion.div
            className="upload-page__error"
            role="alert"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          className="upload-page__tips"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          {tips.map(({ type, text }) => (
            <div
              key={text}
              className={`upload-tip ${darkMode ? 'upload-tip-dark' : 'upload-tip-light'}`}
            >
              <span className="upload-tip__icon" aria-hidden="true">
                {iconMap[type]}
              </span>
              <span className="upload-tip__text">{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Upload Box (Wrapped in a motion div to animate together) */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.5} // Loads after the tips
        >
          {isUploading ? (
            <div className="upload-progress">
              <div
                className="upload-progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          ) : (
            <UploadBox onFileSelect={uploadFile} />
          )}
        </motion.div>

        <motion.div
          className={`upload-page__privacy ${darkMode ? 'upload-page__privacy-dark' : ''}`}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          <span className="upload-page__privacy-icon" aria-hidden="true">
            {iconMap.lock}
          </span>
          <span>{t.uploadPrivacy}</span>
        </motion.div>
      </div>
    </div>
  );
}

export default UploadPage;
