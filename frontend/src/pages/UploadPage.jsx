import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExifMetadataInspector from '../components/ExifMetadataInspector';
import PhotoQualityHealthMeter from '../components/PhotoQualityHealthMeter';
import UploadBox from '../components/UploadBox';
import PhotoPreview from '../components/PhotoPreview';
import UploadProgress from '../components/UploadProgress';
import FaceSelectionOverlay from '../components/FaceSelectionOverlay';
import usePhotoUpload from '../hooks/usePhotoUpload';
import { useBatchUpload } from '../hooks/useBatchUpload';
import { compressImage } from '../utils/imageCompression';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { iconMap } from '../data/UploadPageData';
import { runImageDiagnostics } from '../utils/imageDiagnostics';
import { detectFaces } from '../services/api';
import './UploadPage.css';

function UploadPage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const {
    uploadFile,
    uploadedFile,
    isUploading,
    error,
    uploadProgress,
    reset,
  } = usePhotoUpload();
  const batchUpload = useBatchUpload({ concurrency: 3 });
  const [isBatchMode, setIsBatchMode] = useState(false);

  const [localPreview, setLocalPreview] = useState(null);
  const [diagResults, setDiagResults] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [isDetectingFaces, setIsDetectingFaces] = useState(false);

  const tips = [
    { type: 'ok', text: t.tipPlainBg },
    { type: 'ok', text: t.tipFaceVisible },
    { type: 'ok', text: t.tipNeutralExpression },
    { type: 'no', text: t.tipAvoidAccessories },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
  };

  const handleFileSelect = async (file) => {
    if (isBatchMode) {
      batchUpload.addFiles([file]);
      return;
    }
    reset();
    setDiagResults(null);
    setFaceData(null);
    const diags = await runImageDiagnostics(file);
    setDiagResults(diags);
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.92,
      });
      const result = await uploadFile(compressed);
      if (result?.filename) {
        setIsDetectingFaces(true);
        try {
          const faceResult = await detectFaces(result.filename);
          if (faceResult?.data?.faces?.length > 0) {
            setFaceData(faceResult.data);
          }
        } catch (_faceErr) {
          // Face detection is non-blocking; proceed without overlay
        } finally {
          setIsDetectingFaces(false);
        }
      }
    } catch (err) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setLocalPreview(null);
    }
  };

  const handleFaceSelected = (face) => {
    setFaceData((prev) => prev ? { ...prev, selectedFaceIndex: face.index } : prev);
  };

  const handleProceed = () => {
    if (uploadedFile) {
      navigate('/editor', {
        state: {
          filename: uploadedFile.filename,
          fileUrl: uploadedFile.fileUrl,
          localUrl: uploadedFile.localUrl || localPreview,
          selectedFaceIndex: faceData?.selectedFaceIndex ?? null,
          faces: faceData?.faces ?? null,
        },
      });
    }
  };

  const handleReset = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(null);
    setDiagResults(null);
    setFaceData(null);
    reset();
    batchUpload.reset();
  };

  const displayUrl = uploadedFile?.localUrl || localPreview;

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
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', color: darkMode ? '#cbd5e1' : '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isBatchMode}
                onChange={(e) => setIsBatchMode(e.target.checked)}
                style={{ marginRight: '6px' }}
              />
              Enable Batch Processing Mode
            </label>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          {displayUrl && !isBatchMode ? (
            <>
              {isDetectingFaces && (
                <div style={{ textAlign: 'center', padding: '8px', fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>
                  Detecting faces...
                </div>
              )}
              {faceData && faceData.faces && faceData.faces.length > 0 && faceData.selectedFaceIndex === undefined ? (
                <FaceSelectionOverlay
                  imageUrl={displayUrl}
                  faces={faceData.faces}
                  imageWidth={faceData.image_width}
                  imageHeight={faceData.image_height}
                  onSelectFace={handleFaceSelected}
                  onDismiss={handleReset}
                  darkMode={darkMode}
                />
              ) : (
                <>
                  <PhotoPreview
                    imageUrl={displayUrl}
                    filename={uploadedFile?.filename || 'preview'}
                    onReset={handleReset}
                    onProceed={handleProceed}
                    isUploading={isUploading}
                    darkMode={darkMode}
                  />
                  {uploadedFile?.file && (
                    <>
                      <ExifMetadataInspector file={uploadedFile.file} darkMode={darkMode} />
                      <PhotoQualityHealthMeter file={uploadedFile.file} complianceScore={88} darkMode={darkMode} />
                    </>
                  )}
                  {diagResults && (
                    <div aria-live="polite" aria-label="Image Diagnostics Results" style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: diagResults.success ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', border: diagResults.success ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)', textAlign: 'left' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', fontWeight: '600', color: diagResults.success ? '#10b981' : '#ef4444' }}>
                        {diagResults.success ? '✓ Image diagnostics passed' : '✗ Image diagnostics failed'}
                      </p>
                      {diagResults.errors.map((err, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: '#ef4444', margin: '2px 0' }}>• {err}</div>
                      ))}
                      {diagResults.warnings.map((warn, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: '#eab308', margin: '2px 0' }}>• {warn}</div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <UploadBox onFileSelect={handleFileSelect} />
              <div aria-live="polite">
                <UploadProgress progress={uploadProgress} darkMode={darkMode} />
              </div>
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
