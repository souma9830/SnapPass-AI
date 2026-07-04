import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { saveSession } from '../utils/sessionManager';
import SizeSelector from '../components/SizeSelector';
import BackgroundSelector from '../components/BackgroundSelector';
import AttireSelector from '../components/AttireSelector';
import CompliancePanel from '../components/CompliancePanel';
import useImageProcessor from '../hooks/useImageProcessor';
import { iconMap, backgroundHexMap } from '../data/EditorPageData';
import './EditorPage.css';

const SIZE_PRESETS = [
  { id: '35x45', label: 'India / UK Passport', dimensions: '35 × 45 mm' },
  { id: '51x51', label: 'USA Visa', dimensions: '51 × 51 mm' },
  { id: '33x48', label: 'Schengen Visa', dimensions: '33 × 48 mm' },
  { id: '40x60', label: 'China Visa', dimensions: '40 × 60 mm' },
  { id: '2x2in', label: 'US Passport', dimensions: '2 × 2 in' },
];

function EditorPage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const { processImage, processedUrl, isProcessing, error, reset } = useImageProcessor();

  const [background, setBackground] = useState('white');
  const [sizePreset, setSizePreset] = useState('35x45');
  const [attire, setAttire] = useState('none');
  const [filename, setFilename] = useState(state?.filename || '');

  useEffect(() => {
    if (state?.filename) setFilename(state.filename);
  }, [state?.filename]);

  const handleProcess = useCallback(async () => {
    if (!filename) return;
    try {
      const resultUrl = await processImage({
        filename,
        backgroundColour: background,
        photoSizePreset: sizePreset,
        attire,
      });
      saveSession({
        step: 'editor',
        processedUrl: resultUrl,
        filename,
        background,
        sizePreset,
        attire,
      });
      navigate('/print-preview', {
        state: { processedUrl: resultUrl, filename, background, sizePreset },
      });
    } catch (err) {
      // error handled by hook
    }
  }, [filename, background, sizePreset, attire, processImage, navigate]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay } }),
  };

  const presetInfo = SIZE_PRESETS.find((p) => p.id === sizePreset) || SIZE_PRESETS[0];
  const currentBgHex = backgroundHexMap[background] || '#ffffff';

  return (
    <div className={darkMode ? 'editor-toggle-dark' : ''}>
      <div className="editor-page">
        <motion.div
          className="editor-page__header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <h1 className={`section-title ${darkMode ? 'section-title-dark' : ''}`}>
            {t.editorTitle || 'Edit Your Photo'}
          </h1>
          <p className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : ''}`}>
            {t.editorSubtitle || 'Choose background, size, and attire before processing'}
          </p>
        </motion.div>

        <div className="editor-page__layout">
          <motion.div
            className="editor-page__preview card"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                maxHeight: '500px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: currentBgHex,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {state?.localUrl || filename ? (
                <img
                  src={processedUrl || state?.localUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'opacity 0.3s ease',
                    opacity: isProcessing ? 0.5 : 1,
                  }}
                />
              ) : (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
                  {t.noPhotoPreview || 'Upload a photo first to see preview'}
                </div>
              )}
            </div>
            <div className="editor-page__info">
              <div className="editor-info-row">
                <span className="editor-info-label">{t.size || 'Size'}</span>
                <span className="editor-info-value">{presetInfo.dimensions}</span>
              </div>
              <div className="editor-info-row">
                <span className="editor-info-label">{t.backgroundLabel || 'Background'}</span>
                <span className="editor-info-value" style={{ textTransform: 'capitalize' }}>{background}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="editor-page__controls card"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            <SizeSelector
              presets={SIZE_PRESETS}
              selected={sizePreset}
              onChange={setSizePreset}
            />

            <hr className="divider" />

            <BackgroundSelector selected={background} onChange={setBackground} />

            <hr className="divider" />

            <AttireSelector selected={attire} onChange={setAttire} />

            <hr className="divider" />

            <CompliancePanel darkMode={darkMode} />

            <hr className="divider" />

            {error && (
              <div className="editor-page__error" role="alert" style={{ marginBottom: '0.5rem' }}>
                {error}
              </div>
            )}

            <button
              className={`editor-page__process-btn ${darkMode ? 'editor-page__process-btn-dark' : ''}`}
              onClick={handleProcess}
              disabled={isProcessing || !filename}
              aria-busy={isProcessing}
            >
              <span className="editor-page__btn-icon" aria-hidden="true">
                {isProcessing ? iconMap.refresh : iconMap.spark}
              </span>
              {isProcessing ? t.processing || 'Processing...' : t.processWithAI || 'Process with AI'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
