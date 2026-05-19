import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PhotoPreview from '../components/PhotoPreview';
import BackgroundSelector from '../components/BackgroundSelector';
import SizeSelector from '../components/SizeSelector';
import { ButtonSpinner } from '../components/LoadingSpinner';
import './EditorPage.css';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';

/**
 * EditorPage — Step 2.
 * Shows preview of uploaded photo, lets user configure background + size,
 * then triggers AI processing before navigating to PrintPreviewPage.
 */
function EditorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [photoData, setPhotoData] = useState({
    localUrl: state?.localUrl,
    filename: state?.filename,
    fileSize: state?.fileSize,
  });

  const fileInputRef = useRef(null);

  const [background, setBackground] = useState('white');
  const [sizePreset, setSizePreset] = useState('35x45');
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);

    // TODO: Call backend POST /api/process with { filename, backgroundColour, photoSizePreset }
    // const res = await fetch('/api/process', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ filename: state.filename, backgroundColour: background, photoSizePreset: sizePreset }),
    // });
    // const blob = await res.blob();
    // const processedUrl = URL.createObjectURL(blob);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1500));

    setIsProcessing(false);

    // Navigate to print preview — pass original url as placeholder for processed for now
    navigate('/print-preview', {
      state: {
        processedUrl: photoData.localUrl, // replace with real processedUrl after backend integration
        background,
        sizePreset,
      },
    });
  };
  // If user lands here directly without uploading, redirect

  if (!state?.localUrl) {
    return (
      <EmptyState
        title="No photo selected yet"
        description="Please upload a passport photo before accessing the editor."
        buttonText="Go to Upload"
      />
    );
  }


  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay }
    })
  };

  return (
    <div className="editor-page page-content">
      <motion.div
        className="editor-page__header"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1} // Loads first
      >
        <h1 className="section-title">Edit Your Photo</h1>
        <p className="section-subtitle">Choose a background and size, then let AI process your photo.</p>
      </motion.div>

      <div className="editor-page__layout">
        {/* Preview panel */}
        <motion.section
          className="editor-page__preview card"
          aria-label="Photo preview"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2} // Loads second
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
          custom={0.3} // Loads third
        >
          <BackgroundSelector selected={background} onChange={setBackground} />
          <hr className="divider" />
          <SizeSelector selected={sizePreset} onChange={setSizePreset} />
          <hr className="divider" />

          <div className="editor-page__info">
            <p className="editor-info-row">
              <span className="editor-info-label">File</span>
              <span className="editor-info-value">{photoData.filename}</span>
            </p>
            <p className="editor-info-row">
              <span className="editor-info-label">Size</span>
              <span className="editor-info-value">{(photoData.fileSize / 1024).toFixed(1)} KB</span>
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
            Replace Photo
          </button>

          <button
            className="btn btn-primary editor-page__process-btn"
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <ButtonSpinner /> Processing…
              </>
            ) : (
              <>
                <span className="editor-page__btn-icon" aria-hidden="true">
                  {iconMap.spark}
                </span>
                Process with AI →
              </>
            )}
          </button>
        </motion.aside>
      </div>
    </div>
  );
}

export default EditorPage;
