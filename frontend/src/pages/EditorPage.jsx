import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { saveSession, getSession } from '../utils/sessionManager';
import useSessionDraft from '../hooks/useSessionDraft';
import SizeSelector from '../components/SizeSelector';
import BackgroundSelector from '../components/BackgroundSelector';
import AttireSelector from '../components/AttireSelector';
import CompliancePanel from '../components/CompliancePanel';
import useImageProcessor from '../hooks/useImageProcessor';
import { iconMap, backgroundHexMap } from '../data/EditorPageData';
import EditorPageDiagnostics from './EditorPageDiagnostics';
import { ImageAdjustments } from '../components/ImageAdjustments';
import { cachePhotoOffline } from '../services/indexedDb';
import api from '../services/api';
import { autoEnhanceImage } from '../utils/imageEnhancer';
import { AttireManualAdjuster } from '../components/AttireManualAdjuster';
import { uploadPhoto } from '../services/photoService';
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

  // Selected editor preferences and local preview state containers
  const [background, setBackground] = useState('white');
  const [sizePreset, setSizePreset] = useState('35x45');
  const [attire, setAttire] = useState('none');
  const [filename, setFilename] = useState(state?.filename || '');
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const [complianceData, setComplianceData] = useState(null);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [complianceError, setComplianceError] = useState(null);
  const [cacheBuster, setCacheBuster] = useState(0);
  const [attireScale, setAttireScale] = useState(1.0);
  const [attireX, setAttireX] = useState(0);
  const [attireY, setAttireY] = useState(0);
  const [isAutoEnhanced, setIsAutoEnhanced] = useState(false);
  const [enhancedDataUrl, setEnhancedDataUrl] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { draft, saveDraft, clearDraft } = useSessionDraft();
  const [resumedUrl, setResumedUrl] = useState(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);

  const getBackendRoot = () => {
    if (import.meta?.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    }
    if (api.defaults?.baseURL) {
      return api.defaults.baseURL.replace(/\/api\/?$/, '');
    }
    return '';
  };
  const backendRoot = getBackendRoot();

  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return backendRoot ? `${backendRoot}${path.startsWith('/') ? '' : '/'}${path}` : path.startsWith('/') ? path : `/${path}`;
  };

  const baseImageUrl = filename ? resolveImageUrl(`/uploads/${filename}`) : (state?.localUrl || state?.fileUrl || '');
  const currentImageUrl = resumedUrl
    ? resumedUrl
    : processedUrl
      ? `${resolveImageUrl(processedUrl)}?t=${cacheBuster}`
      : baseImageUrl
        ? (baseImageUrl.includes('?') ? baseImageUrl : `${baseImageUrl}?t=${cacheBuster}`)
        : '';

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

  const handleToggleEnhance = async () => {
    if (!isAutoEnhanced) {
      if (!enhancedDataUrl) {
        setIsEnhancing(true);
        try {
          const targetUrl = baseImageUrl ? `${baseImageUrl}?t=${cacheBuster}` : state?.localUrl;
          if (targetUrl) {
            const enhanced = await autoEnhanceImage(targetUrl);
            setEnhancedDataUrl(enhanced);
          }
        } catch (e) {
          console.error('Enhancement failed', e);
        } finally {
          setIsEnhancing(false);
        }
      }
      setIsAutoEnhanced(true);
    } else {
      setIsAutoEnhanced(false);
    }
  };

  const displayImageUrl = isAutoEnhanced && enhancedDataUrl ? enhancedDataUrl : currentImageUrl;

  useEffect(() => {
    if (state?.filename) setFilename(state.filename);
  }, [state?.filename]);

  useEffect(() => {
    const hasFreshUpload = state?.localUrl || state?.fileUrl || state?.filename;
    if (hasFreshUpload) {
      clearDraft();
      return;
    }
    if (draft && !filename) {
      setShowResumeBanner(true);
    }
    // Only run once on mount; draft presence is read from sessionStorage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!filename) return;
    const displayUrl = isAutoEnhanced && enhancedDataUrl ? enhancedDataUrl : displayImageUrl;
    saveDraft({
      filename,
      background,
      sizePreset,
      attire,
      filters,
      processedUrl: processedUrl || (displayUrl && !displayUrl.startsWith('blob:') ? displayUrl : null),
      processedBase64:
        displayUrl && displayUrl.startsWith('data:') ? displayUrl : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename, background, sizePreset, attire, filters, processedUrl, enhancedDataUrl, isAutoEnhanced]);

  const handleResumeDraft = () => {
    if (!draft) return;
    if (draft.filename) setFilename(draft.filename);
    setBackground(draft.background || 'white');
    setSizePreset(draft.sizePreset || '35x45');
    setAttire(draft.attire || 'none');
    if (draft.filters) setFilters(draft.filters);
    if (draft.processedBase64) {
      setResumedUrl(draft.processedBase64);
    } else if (draft.processedUrl && !draft.processedUrl.startsWith('blob:')) {
      setResumedUrl(resolveImageUrl(draft.processedUrl));
    }
    setShowResumeBanner(false);
  };

  const handleStartFresh = () => {
    clearDraft();
    setShowResumeBanner(false);
  };

  const handleProcess = useCallback(async () => {
    if (!filename) return;
    try {
      let processFilename = filename;
      
      if (isAutoEnhanced && enhancedDataUrl) {
        const res = await fetch(enhancedDataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'enhanced.jpg', { type: 'image/jpeg' });
        const uploadResult = await uploadPhoto(file);
        processFilename = uploadResult.filename;
      }

      const resultUrl = await processImage({
        filename: processFilename,
        backgroundColour: background,
        photoSizePreset: sizePreset,
        attire,
      });
      await cachePhotoOffline({
        processedUrl: resultUrl,
        filename: processFilename,
        background,
        sizePreset,
        attire,
      }).catch(() => {});
      const currentSession = getSession() || {};
      const processedPhotos = currentSession.processedPhotos || [];
      const newPhoto = { processedUrl: resultUrl, filename: processFilename, background, sizePreset, attire };

      saveSession({
        ...currentSession,
        step: 'editor',
        processedUrl: resultUrl,
        filename: processFilename,
        background,
        sizePreset,
        attire,
        processedPhotos: [...processedPhotos, newPhoto]
      });
      navigate('/print-preview', {
        state: { 
          processedUrl: resultUrl, 
          filename: processFilename, 
          background, 
          sizePreset,
          processedPhotos: [...processedPhotos, newPhoto]
        },
      });
    } catch (err) {
      // error handled by hook
    }
  }, [filename, background, sizePreset, attire, processImage, navigate, isAutoEnhanced, enhancedDataUrl]);

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
  const currentBgHex = background?.startsWith('#')
    ? background
    : backgroundHexMap[background] || '#ffffff';

  return (
    <div className={darkMode ? 'editor-toggle-dark' : ''}>
      <EditorPageDiagnostics
        sizePreset={sizePreset}
        background={background}
        attire={attire}
        filename={filename}
      />
      <div className="editor-page">
        {showResumeBanner && (
          <div
            className={`editor-page__resume-banner ${darkMode ? 'editor-page__resume-banner--dark' : ''}`}
            role="status"
          >
            <p className="editor-page__resume-text">
              {t.editorResumeBanner} {t.editorResumePrompt}
            </p>
            <div className="editor-page__resume-actions">
              <button
                type="button"
                className="editor-page__resume-btn editor-page__resume-btn--primary"
                onClick={handleResumeDraft}
              >
                {t.editorResume}
              </button>
              <button
                type="button"
                className="editor-page__resume-btn"
                onClick={handleStartFresh}
              >
                {t.editorStartFresh}
              </button>
            </div>
          </div>
        )}
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
                      src={displayImageUrl}
                      alt="Preview"
                      onError={(e) => {
                        if (filename && !e.target.dataset.retried) {
                          e.target.dataset.retried = 'true';
                          e.target.src = `/uploads/${filename}`;
                        } else if (state?.localUrl) {
                          e.target.src = state.localUrl;
                        }
                      }}
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '450px',
                        objectFit: 'contain',
                        transition: 'opacity 0.3s ease',
                        opacity: isProcessing || complianceLoading ? 0.5 : 1,
                        filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`,
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

                          {/* 2. Ideal Oval Positioning Template (US: 2x2in, India: 35x45mm) from presets.json */}
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

            <div style={{ marginTop: '1rem' }}>
              <BackgroundSelector
                selected={background}
                onChange={setBackground}
              />
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

            <AttireSelector selected={attire} onChange={setAttire} />
            {attire !== 'none' && (
              <AttireManualAdjuster
                scale={attireScale}
                xOffset={attireX}
                yOffset={attireY}
                onChangeScale={setAttireScale}
                onChangeX={setAttireX}
                onChangeY={setAttireY}
              />
            )}

            <hr className="divider" />

            <ImageAdjustments
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters({ brightness: 100, contrast: 100, saturation: 100 })}
            />

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

            <div className="toggle-switch-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '12px', background: darkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)', borderRadius: '8px', border: darkMode ? '1px dashed #60a5fa' : '1px dashed #3b82f6' }}>
              <span style={{ fontWeight: '600', color: darkMode ? '#60a5fa' : '#3b82f6' }}>🪄 Auto-Enhance Lighting</span>
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={isAutoEnhanced}
                  onChange={handleToggleEnhance}
                  disabled={!filename || isEnhancing}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="slider round" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isAutoEnhanced ? '#3b82f6' : (darkMode ? '#475569' : '#ccc'), transition: '.4s', borderRadius: '24px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: isAutoEnhanced ? '23px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }} />
                </span>
              </label>
            </div>

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
