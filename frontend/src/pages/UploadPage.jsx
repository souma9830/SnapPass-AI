import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import usePhotoUpload from '../hooks/usePhotoUpload';
import './UploadPage.css';
import { motion } from 'framer-motion';

import { tips, iconMap } from '../data/UploadPageData';
import { fadeUpVariant } from '../animations/variants.js';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { saveSession } from '../utils/sessionManager';

/**
 * UploadPage — Step 1 of the flow.
 * User selects a photo; we create a local object URL and navigate to EditorPage.
 */
function UploadPage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const { uploadFile, uploadedFile, isUploading, error } = usePhotoUpload();

  const tips = [
    { type: 'ok', text: t.tipPlainBg },
    { type: 'ok', text: t.tipFaceVisible },
    { type: 'ok', text: t.tipNeutralExpression },
    { type: 'no', text: t.tipAvoidAccessories },
  ];

  const iconMap = {
    ok: (
      <svg
        className={`tips ${darkMode ? 'tips-dark' : ''}`}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="3" y="3" width="18" height="18" rx="6" />
        <path d="M8 12.5l2.5 2.5L16 9" />
      </svg>
    ),
    no: (
      <svg
        className={`tips ${darkMode ? 'tips-dark' : ''}`}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="3" y="3" width="18" height="18" rx="6" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    ),
    lock: (
      <svg
        className={`tips ${darkMode ? 'tips-dark' : ''}`}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="5" y="10" width="14" height="10" rx="3" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </svg>
    ),
  };
  useEffect(() => {
    if (!uploadedFile) return;

    saveSession({
      step: 'upload',
      localUrl: uploadedFile.localUrl,
      filename: uploadedFile.filename,
      fileSize: uploadedFile.size,
    });

    navigate('/editor', {
      state: {
        localUrl: uploadedFile.localUrl,
        filename: uploadedFile.filename,
        fileSize: uploadedFile.size,
      },
    });
  }, [uploadedFile, navigate]);

  return (
    <div className={`upload-toggle ${darkMode ? 'upload-toggle-dark' : ''}`}>
      <div className={'upload-page'}>
        <motion.div
          className="upload-page__header"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.1}
        >
          <h1
            className={`section-title ${darkMode ? 'section-title-dark' : ''}`}
          >
            {t.uploadTitle}
          </h1>
          <p
            className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : ''}`}
          >
            {t.uploadSubtitle}
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
              className={`upload-tip ${darkMode ? 'upload-tip-dark' : 'upload-tip-light'}`}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2 + idx * 0.1} // Staggers each tip by 100ms
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
            <LoadingSpinner message={t.uploadPreparing} size="lg" />
          ) : (
            <UploadBox onFileSelect={uploadFile} />
          )}
        </motion.div>

        <motion.p
          className={`upload-page__privacy ${darkMode ? 'upload-page__privacy-dark' : ''}`}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
        >
          <span className="upload-page__privacy-icon" aria-hidden="true">
            {iconMap.lock}
          </span>
          {t.privacyMessage}
        </motion.p>
      </div>
    </div>
  );
}

export default UploadPage;
