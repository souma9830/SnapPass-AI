import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { exportDigitalImage } from '../utils/exportHelpers';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { getSession } from '../utils/sessionManager';
import './DigitalDownloadPage.css';

const DEFAULT_DIMS = { widthPx: 400, heightPx: 400, shape: 'square' };

function DigitalDownloadPage({ darkMode }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const { state } = useLocation();
  const savedSession = getSession();

  useDocumentMeta({
    title: 'Digital Photo Download',
    description: 'Download your processed photo as a single high-resolution image.',
  });

  const processedUrl =
    state?.processedUrl || savedSession?.processedUrl || '';
  const filename = state?.filename || savedSession?.filename || 'photo';
  const sizePreset =
    state?.sizePreset || savedSession?.sizePreset || 'linkedin-400';

  const dims = useMemo(() => {
    const { widthPx, heightPx, shape } = state || {};
    if (widthPx && heightPx) return { widthPx, heightPx, shape: shape || 'square' };
    return DEFAULT_DIMS;
  }, [state]);

  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const baseName = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_');

  const handleExport = async (format) => {
    if (!processedUrl) return;
    setExporting(true);
    setError(null);
    try {
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const shapeLabel = dims.shape === 'circle' ? 'avatar' : 'profile';
      await exportDigitalImage(processedUrl, {
        width: dims.widthPx,
        height: dims.heightPx,
        shape: dims.shape,
        format,
        filename: `${baseName}_${sizePreset}_${shapeLabel}.${ext}`,
      });
    } catch (e) {
      console.error('Digital export failed', e);
      setError('Failed to export image. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const previewStyle =
    dims.shape === 'circle'
      ? {
          borderRadius: '50%',
          width: '100%',
          aspectRatio: '1/1',
          objectFit: 'cover',
        }
      : {
          width: '100%',
          maxWidth: '100%',
          aspectRatio: '1/1',
          objectFit: 'cover',
          borderRadius: '12px',
        };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay },
    }),
  };

  if (!processedUrl) {
    return (
      <div className={`digital-page ${darkMode ? 'digital-page-dark' : ''}`}>
        <div className="digital-page__empty card">
          <h2>No processed photo available</h2>
          <p>Process a photo in the editor first, then return here to download.</p>
          <Link to="/editor" className="btn btn-primary">
            Go to Editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`digital-page ${darkMode ? 'digital-page-dark' : ''}`}>
      <div className="digital-page__content">
        <motion.header
          className="digital-page__header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <h1 className={`section-title ${darkMode ? 'section-title-dark' : ''}`}>
            {t.digitalDownloadTitle || 'Digital Photo Ready'}
          </h1>
          <p className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : ''}`}>
            {t.digitalDownloadSubtitle ||
              'A single high-resolution image, perfectly sized for your profile.'}
          </p>
        </motion.header>

        <div className="digital-page__layout">
          <motion.section
            className="digital-page__preview card"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <div
              className="digital-page__canvas"
              style={{ background: state?.background || '#ffffff' }}
            >
              <img
                src={processedUrl}
                alt="Processed digital photo preview"
                style={previewStyle}
              />
            </div>
            <div className="digital-page__dims">
              {dims.widthPx} × {dims.heightPx} px
              {dims.shape === 'circle' ? ' · Circular avatar' : ' · Square profile'}
            </div>
          </motion.section>

          <motion.aside
            className="digital-page__controls card"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            <h3 className="digital-page__panel-title">Download</h3>
            <p className="digital-page__note">
              Export a single high-resolution {dims.widthPx} × {dims.heightPx}px
              image — no print sheet required.
            </p>

            <div className="digital-page__actions">
              <button
                className="btn btn-primary digital-page__action"
                onClick={() => handleExport('png')}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Download PNG'}
              </button>
              <button
                className="btn btn-secondary digital-page__action"
                onClick={() => handleExport('jpeg')}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Download JPEG'}
              </button>
            </div>

            {error && (
              <div className="digital-page__error" role="alert">
                {error}
              </div>
            )}

            <hr className="divider" />

            <Link
              to="/editor"
              className={`btn btn-ghost digital-page__back ${darkMode ? 'digital-page__back-dark' : ''}`}
            >
              ← Back to Editor
            </Link>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

export default DigitalDownloadPage;
