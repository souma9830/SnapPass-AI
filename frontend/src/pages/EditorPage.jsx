import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PhotoPreview from '../components/PhotoPreview';
import BackgroundSelector from '../components/BackgroundSelector';
import SizeSelector from '../components/SizeSelector';
import { ButtonSpinner } from '../components/LoadingSpinner';
import './EditorPage.css';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import useImageProcessor from '../hooks/useImageProcessor';
import { saveSession, getSession } from '../utils/sessionManager';

/**
 * EditorPage — Step 2.
 * Shows preview of uploaded photo, lets user configure background + size,
 * then triggers AI processing before navigating to PrintPreviewPage.
 */
function EditorPage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const { state } = useLocation();
  const navigate = useNavigate();
  const savedSession = getSession();

  const [photoData, setPhotoData] = useState({
    localUrl: state?.localUrl || savedSession?.localUrl,
    filename: state?.filename || savedSession?.filename,
    fileSize: state?.fileSize || savedSession?.fileSize,
  });

  const fileInputRef = useRef(null);

  const [background, setBackground] = useState(
    savedSession?.background || 'white'
  );
  const [sizePreset, setSizePreset] = useState(
    savedSession?.sizePreset || '35x45'
  );
  const { processImage, isProcessing, error } = useImageProcessor();

  useEffect(() => {
    if (!photoData?.localUrl) return;

    const sessionData = {
      step: 'editor',
      localUrl: photoData.localUrl,
      filename: photoData.filename,
      fileSize: photoData.fileSize,
      background,
      sizePreset,
    };

    saveSession(sessionData);
  }, [photoData, background, sizePreset]);

  const iconMap = {
    refresh: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 12a8 8 0 0 1-13.7 5.7" />
        <path d="M4 12a8 8 0 0 1 13.7-5.7" />
        <path d="M4 4v5h5" />
        <path d="M20 20v-5h-5" />
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3l1.9 5.7L19 11l-5.1 2.3L12 19l-1.9-5.7L5 11l5.1-2.3L12 3z" />
      </svg>
    ),
  };

  const handleReplacePhoto = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const newLocalUrl = URL.createObjectURL(file);

    setPhotoData({
      localUrl: newLocalUrl,
      filename: file.name,
      fileSize: file.size,
    });
  };

  const handleProcess = async () => {
    try {
      const processedUrl = await processImage({
        filename: photoData.filename,
        backgroundColour: background,
        photoSizePreset: sizePreset,
      });

      navigate('/print-preview', {
        state: {
          processedUrl,
          filename: photoData.filename,
          background,
          sizePreset,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  // If user lands here directly without uploading, redirect

  if (!photoData?.localUrl) {
    return (
      <EmptyState
        title={t.noPhotoSelected}
        description={t.uploadBeforeEditor}
        buttonText={t.goToUpload}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay },
    }),
  };

  return (
    <div className={`editor-toggle ${darkMode ? 'editor-toggle-dark' : ''}`}>
      <div className="editor-page">
        <motion.div
          className="editor-page__header"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.1} // Loads first
        >
          <h1
            className={`section-title ${darkMode ? 'section-title-dark' : 'section-title-light'}`}
          >
            {t.editPhotoTitle}
          </h1>
          <p
            className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : 'section-subtitle-light'}`}
          >
            {t.editPhotoSubtitle}
          </p>
        </motion.div>

        <div className="editor-page__layout">
          {/* Preview panel */}

          <motion.section
            className="editor-page__preview"
            aria-label="Photo preview"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
          >
            <PhotoPreview
              originalUrl={photoData.localUrl}
              processedUrl={null}
              isProcessing={isProcessing}
            />
          </motion.section>

          {/* Controls panel */}
          <motion.aside
            className="editor-page__controls card"
            aria-label="Photo settings"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
          >
            <BackgroundSelector
              selected={background}
              onChange={setBackground}
            />

            <hr className="divider" />

            <SizeSelector selected={sizePreset} onChange={setSizePreset} />

            <hr className="divider" />

            {error && (
              <div
                className="editor-page__error"
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '1rem 0',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '6px', fontSize: '0.875rem' }}>
                  {error.message || error}
                </p>
                {error.user_hint && (
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '12px' }}>
                    💡 {error.user_hint}
                  </p>
                )}
                <button
                  onClick={() => navigate('/upload')}
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="editor-page__info">
              <p className="editor-info-row">
                <span className="editor-info-label">{t.fileLabel}</span>
                <span className="editor-info-value">{photoData.filename}</span>
              </p>
              <p className="editor-info-row">
                <span className="editor-info-label">{t.sizeLabel}</span>
                <span className="editor-info-value">
                  {(photoData.fileSize / 1024).toFixed(1)} KB
                </span>
              </p>
            </div>

            {/* Hidden file input works exactly as before */}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              ref={fileInputRef}
              onChange={handleReplacePhoto}
              style={{ display: 'none' }}
            />

            <button
              className="btn editor-page__replace-btn"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="editor-page__btn-icon" aria-hidden="true">
                {iconMap.refresh}
              </span>
              {t.replacePhoto}
            </button>

            <button
              className={`btn btn-primary editor-page__process-btn ${darkMode ? 'editor-page__process-btn-dark' : ''}`}
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ButtonSpinner /> {t.processingPhoto}
                </>
              ) : (
                <>
                  <span className="editor-page__btn-icon" aria-hidden="true">
                    {iconMap.spark}
                  </span>
                  {t.processWithAI}
                </>
              )}
            </button>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
