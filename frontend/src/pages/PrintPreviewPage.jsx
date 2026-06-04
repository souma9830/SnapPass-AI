import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import QuantityInput from '../components/QuantityInput';
import PrintButton from '../components/PrintButton';
import './PrintPreviewPage.css';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import { generateSheet } from '../services/photoService';
import { calculatePasswordStrength } from '../utils/passwordStrength';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import {
  saveSession,
  getSession,
  saveSessionToHistory,
} from '../utils/sessionManager';

/**
 * PrintPreviewPage — Step 3 & 4.
 * Shows the processed photo in a simulated A4 sheet grid.
 * User picks quantity, then downloads or prints the sheet.
 */
function PrintPreviewPage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const { state } = useLocation();
  const savedSession = getSession();

  const [quantity, setQuantity] = useState(savedSession?.quantity || 6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = calculatePasswordStrength(password);
      setStrength(result.score);
      setStrengthLabel(result.label);
    }, 100);
    return () => clearTimeout(timer);
  }, [password]);

  useEffect(() => {
    const sessionData = {
      step: 'print-preview',
      processedUrl: state?.processedUrl || savedSession?.processedUrl,
      filename: state?.filename || savedSession?.filename,
      background: state?.background || savedSession?.background,
      sizePreset: state?.sizePreset || savedSession?.sizePreset,
      quantity,
    };

    if (sessionData.processedUrl) {
      saveSession(sessionData);
    }
  }, [state, quantity]);

  const handleGenerateSheet = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateSheet({
        filename: state?.filename || savedSession?.filename,
        quantity,
        photoSizePreset: state?.sizePreset || savedSession?.sizePreset,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snappass_sheet_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);

      saveSessionToHistory({
        step: 'print-preview',
        filename: state?.filename || savedSession?.filename,
        background: state?.background || savedSession?.background,
        photoSizePreset: state?.sizePreset || savedSession?.sizePreset,
        quantity,
        status: 'processed',
        outputStatus: 'downloaded',
        hasOutput: true,
        exportType: 'print-sheet',
      });
    } catch (error) {
      alert(error.message || 'Sheet generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintDirect = () => {
    window.print();
  };

  // Build grid of photo slots
  const slots = Array.from({ length: quantity });

  // If user lands here directly without uploading, redirect
  if (!(state?.processedUrl || savedSession?.processedUrl)) {
    return (
      <EmptyState
        title={t.noProcessedPhoto}
        description={t.uploadBeforePrint}
        buttonText={t.uploadPhotoButton}
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
    <div
      className={`print-preview-toggle ${darkMode ? 'print-preview-toggle-dark' : ''}`}
    >
      <div className="print-page page-content">
        <motion.div
          className="print-page__header"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.1}
        >
          <h1
            className={`section-title ${darkMode ? 'section-title-dark' : 'section-title-light'}`}
          >
            {t.printPreviewTitle}
          </h1>
          <p
            className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : 'section-subtitle-light'}`}
          >
            {t.printPreviewSubtitle}
          </p>
        </motion.div>

        <div className="print-page__layout">
          {/* A4 Sheet Preview */}
          <motion.section
            className="print-page__sheet card"
            aria-label="A4 sheet preview"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
          >
            <p className="print-page__sheet-label">{t.a4SheetPreview}</p>
            <div
              className="sheet-grid"
              style={{ '--cols': Math.ceil(Math.sqrt(quantity)) }}
            >
              {slots.map((_, i) => (
                <div key={i} className="sheet-slot">
                  <img
                    src={state?.processedUrl || savedSession?.processedUrl}
                    alt={`Sheet slot ${i + 1}`}
                    className="sheet-slot__img"
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Controls */}
          <motion.aside
            className="print-page__controls card"
            aria-label="Print settings"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
          >
            <div>
              <p className="print-info-label">{t.selectedPreset}</p>
              <p
                className={`print-info-value ${darkMode ? 'print-info-value-dark' : ''}`}
              >
                {state?.sizePreset || savedSession?.sizePreset || '35x45 mm'}
              </p>
            </div>
            <div>
              <p className="print-info-label">{t.backgroundLabel}</p>
              <p
                className={`print-info-value ${darkMode ? 'print-info-value-dark' : 'print-info-value-light'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {state?.background || savedSession?.background || 'White'}
              </p>
            </div>

            <hr className="divider" />

            <QuantityInput
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              value={quantity}
              onChange={setQuantity}
            />

            <hr className="divider" />

            <div className="password-section">
              <label className="print-info-label">{t.securePassword}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.enterPassword}
                className="password-input"
              />
              <div className="password-meter">
                <div
                  className={`password-meter__fill ${
                    strength <= 1
                      ? 'password-meter__fill--weak'
                      : strength === 2
                        ? 'password-meter__fill--medium'
                        : strength === 3
                          ? 'password-meter__fill--strong'
                          : 'password-meter__fill--excellent'
                  }`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <span
                aria-live="polite"
                className={`password-feedback ${
                  strength <= 1
                    ? 'password-feedback--weak'
                    : strength === 2
                      ? 'password-feedback--medium'
                      : strength === 3
                        ? 'password-feedback--strong'
                        : 'password-feedback--excellent'
                }`}
              >
                {strengthLabel}
              </span>
            </div>

            <hr className="divider" />

            <PrintButton
              onClick={handleGenerateSheet}
              isLoading={isGenerating}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              disabled={isGenerating || strength === 0}
            />

            <button
              onClick={handlePrintDirect}
              className={`btn btn-secondary ${darkMode ? 'btn-secondary-dark' : ''}`}
              style={{
                marginTop: '10px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              📷 Print Direct (A4 / PDF)
            </button>

            <Link
              to="/editor"
              className={`btn btn-ghost print-page__back-btn ${darkMode ? 'print-page__back-btn-dark' : ''}`}
            >
              <span className="print-page__back-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </span>
              {t.backToEditor}
            </Link>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

export default PrintPreviewPage;
