import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PhotoPreview from '../components/PhotoPreview';
import BackgroundSelector from '../components/BackgroundSelector';
import SizeSelector from '../components/SizeSelector';
import './EditorPage.css';

/**
 * EditorPage — Step 2.
 * Shows preview of uploaded photo, lets user configure background + size,
 * then triggers AI processing before navigating to PrintPreviewPage.
 */
function EditorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [background, setBackground] = useState('white');
  const [sizePreset, setSizePreset]  = useState('35x45');
  const [isProcessing, setIsProcessing] = useState(false);

  // If user lands here directly without uploading, redirect
  if (!state?.localUrl) {
    navigate('/upload');
    return null;
  }

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
        processedUrl: state.localUrl, // replace with real processedUrl after backend integration
        background,
        sizePreset,
      },
    });
  };

  return (
    <div className="editor-page page-content">
      <div className="editor-page__header">
        <h1 className="section-title">Edit Your Photo</h1>
        <p className="section-subtitle">Choose a background and size, then let AI process your photo.</p>
      </div>

      <div className="editor-page__layout">
        {/* Preview panel */}
        <section className="editor-page__preview card" aria-label="Photo preview">
          <PhotoPreview
            originalUrl={state.localUrl}
            processedUrl={null}
            isProcessing={isProcessing}
          />
        </section>

        {/* Controls panel */}
        <aside className="editor-page__controls card" aria-label="Photo settings">
          <BackgroundSelector selected={background} onChange={setBackground} />
          <hr className="divider" />
          <SizeSelector selected={sizePreset} onChange={setSizePreset} />
          <hr className="divider" />

          <div className="editor-page__info">
            <p className="editor-info-row">
              <span className="editor-info-label">File</span>
              <span className="editor-info-value">{state.filename}</span>
            </p>
            <p className="editor-info-row">
              <span className="editor-info-label">Size</span>
              <span className="editor-info-value">{(state.fileSize / 1024).toFixed(1)} KB</span>
            </p>
          </div>

          <button
            className="btn btn-primary editor-page__process-btn"
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? '⏳ Processing…' : '✨ Process with AI →'}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default EditorPage;
