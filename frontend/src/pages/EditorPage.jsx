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
import EditorPageDiagnostics from './EditorPageDiagnostics';
import api from '../services/api';
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

  const { processImage, processedUrl, isProcessing, error, reset } =
    useImageProcessor();

  const [background, setBackground] = useState('white');
  const [sizePreset, setSizePreset] = useState('35x45');
  const [attire, setAttire] = useState('none');
  const [filename, setFilename] = useState(state?.filename || '');
  const [complianceData, setComplianceData] = useState(null);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [complianceError, setComplianceError] = useState(null);
  const [cacheBuster, setCacheBuster] = useState(0);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? 'http://localhost:5005/api' : '/api');
  const backendRoot = apiBaseUrl.replace(/\/api\/?$/, '');
  const baseImageUrl = filename ? `${backendRoot}/uploads/${filename}` : '';
  const currentImageUrl = processedUrl
    ? `${backendRoot}${processedUrl}?t=${cacheBuster}`
    : baseImageUrl
      ? `${baseImageUrl}?t=${cacheBuster}`
      : state?.localUrl || '';

  const runComplianceCheck = useCallback(
    async (fileToCheck) => {
      if (!fileToCheck) return;
      setComplianceLoading(true);
      setComplianceError(null);
      try {
        const resp = await api.post('/compliance/check', {
          filename: fileToCheck,
          sizePreset: sizePreset,
        });
        if (resp.data?.success) {
          setComplianceData(resp.data.data);
        } else {
          setComplianceError(resp.data?.message || 'Compliance check failed');
        }
      } catch (err) {
        setComplianceError(err.message || 'Failed to check compliance.');
      } finally {
        setComplianceLoading(false);
      }
    },
    [sizePreset]
  );

  useEffect(() => {
    runComplianceCheck(filename);
  }, [filename, sizePreset, cacheBuster, runComplianceCheck]);

  const handleAutoCorrect = useCallback(
    async (issue) => {
      if (!filename) return;
      setComplianceLoading(true);
      setComplianceError(null);
      try {
        const resp = await api.post('/compliance/auto-correct', {
          filename,
          issue,
        });
        if (resp.data?.success) {
          setCacheBuster((prev) => prev + 1);
        } else {
          setComplianceError(resp.data?.message || 'Auto-correct failed');
          setComplianceLoading(false);
        }
      } catch (err) {
        setComplianceError(err.message || 'Failed to auto-correct.');
        setComplianceLoading(false);
      }
    },
    [filename]
  );

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
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay },
    }),
  };

  const presetInfo =
    SIZE_PRESETS.find((p) => p.id === sizePreset) || SIZE_PRESETS[0];
  const currentBgHex = backgroundHexMap[background] || '#ffffff';

  return (
    <div className={darkMode ? 'editor-toggle-dark' : ''}>
      <EditorPageDiagnostics
        sizePreset={sizePreset}
        background={background}
        attire={attire}
        filename={filename}
      />
      <div className="editor-page">
        <motion.div
          className="editor-page__header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <h1
            className={`section-title ${darkMode ? 'section-title-dark' : ''}`}
          >
            {t.editorTitle || 'Edit Your Photo'}
          </h1>
          <p
            className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : ''}`}
          >
            {t.editorSubtitle ||
              'Choose background, size, and attire before processing'}
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
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  >
                    <img
                      src={currentImageUrl}
                      alt="Preview"
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '450px',
                        objectFit: 'contain',
                        transition: 'opacity 0.3s ease',
                        opacity: isProcessing || complianceLoading ? 0.5 : 1,
                      }}
                    />
                    {!isProcessing &&
                      !complianceLoading &&
                      complianceData?.meta && (
                        <svg
                          viewBox={`0 0 ${complianceData.meta.dimensions?.w || 600} ${complianceData.meta.dimensions?.h || 800}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                          }}
                        >
                          {/* 1. Center Vertical Line */}
                          <line
                            x1={(complianceData.meta.dimensions?.w || 600) / 2}
                            y1={0}
                            x2={(complianceData.meta.dimensions?.w || 600) / 2}
                            y2={complianceData.meta.dimensions?.h || 800}
                            stroke="rgba(239, 68, 68, 0.45)"
                            strokeWidth={Math.max(
                              2,
                              Math.round(
                                (complianceData.meta.dimensions?.w || 600) / 400
                              )
                            )}
                            strokeDasharray="4 4"
                          />

                          {/* 2. Ideal Oval Positioning Template */}
                          <ellipse
                            cx={(complianceData.meta.dimensions?.w || 600) / 2}
                            cy={
                              (complianceData.meta.dimensions?.h || 800) * 0.46
                            }
                            rx={
                              (complianceData.meta.dimensions?.w || 600) * 0.22
                            }
                            ry={
                              (complianceData.meta.dimensions?.h || 800) * 0.3
                            }
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.35)"
                            strokeWidth={Math.max(
                              2,
                              Math.round(
                                (complianceData.meta.dimensions?.w || 600) / 300
                              )
                            )}
                          />

                          {/* 3. Face Bounding Box (if detected) */}
                          {complianceData.meta.face_rect && (
                            <rect
                              x={complianceData.meta.face_rect.x}
                              y={complianceData.meta.face_rect.y}
                              width={complianceData.meta.face_rect.w}
                              height={complianceData.meta.face_rect.h}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth={Math.max(
                                2,
                                Math.round(
                                  (complianceData.meta.dimensions?.w || 600) /
                                    350
                                )
                              )}
                              strokeDasharray="3 3"
                              rx="4"
                            />
                          )}

                          {/* 4. Eye line and circles (if detected) */}
                          {complianceData.meta.eyes &&
                            complianceData.meta.eyes.length === 2 && (
                              <>
                                <line
                                  x1={complianceData.meta.eyes[0].x}
                                  y1={complianceData.meta.eyes[0].y}
                                  x2={complianceData.meta.eyes[1].x}
                                  y2={complianceData.meta.eyes[1].y}
                                  stroke="#10b981"
                                  strokeWidth={Math.max(
                                    2,
                                    Math.round(
                                      (complianceData.meta.dimensions?.w ||
                                        600) / 400
                                    )
                                  )}
                                />
                                <circle
                                  cx={complianceData.meta.eyes[0].x}
                                  cy={complianceData.meta.eyes[0].y}
                                  r={Math.max(
                                    4,
                                    Math.round(
                                      (complianceData.meta.dimensions?.w ||
                                        600) / 120
                                    )
                                  )}
                                  fill="#10b981"
                                />
                                <circle
                                  cx={complianceData.meta.eyes[1].x}
                                  cy={complianceData.meta.eyes[1].y}
                                  r={Math.max(
                                    4,
                                    Math.round(
                                      (complianceData.meta.dimensions?.w ||
                                        600) / 120
                                    )
                                  )}
                                  fill="#10b981"
                                />
                              </>
                            )}
                        </svg>
                      )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    color: '#94a3b8',
                    textAlign: 'center',
                    padding: '2rem',
                  }}
                >
                  {t.noPhotoPreview || 'Upload a photo first to see preview'}
                </div>
              )}
            </div>
            <div className="editor-page__info">
              <div className="editor-info-row">
                <span className="editor-info-label">{t.size || 'Size'}</span>
                <span className="editor-info-value">
                  {presetInfo.dimensions}
                </span>
              </div>
              <div className="editor-info-row">
                <span className="editor-info-label">
                  {t.backgroundLabel || 'Background'}
                </span>
                <span
                  className="editor-info-value"
                  style={{ textTransform: 'capitalize' }}
                >
                  {background}
                </span>
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

            <BackgroundSelector
              selected={background}
              onChange={setBackground}
            />

            <hr className="divider" />

            <AttireSelector selected={attire} onChange={setAttire} />

            <hr className="divider" />

            <CompliancePanel
              compliance={complianceData}
              loading={complianceLoading}
              error={complianceError}
              onAutoCorrect={handleAutoCorrect}
              darkMode={darkMode}
            />

            <hr className="divider" />

            {error && (
              <div
                className="editor-page__error"
                role="alert"
                style={{ marginBottom: '0.5rem' }}
              >
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
              {isProcessing
                ? t.processing || 'Processing...'
                : t.processWithAI || 'Process with AI'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
