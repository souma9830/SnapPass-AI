import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import QuantityInput from '../components/QuantityInput';
import PrintButton from '../components/PrintButton';
import './PrintPreviewPage.css';

/**
 * PrintPreviewPage — Step 3 & 4.
 * Shows the processed photo in a simulated A4 sheet grid.
 * User picks quantity, then downloads or prints the sheet.
 */
function PrintPreviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!state?.processedUrl) {
    navigate('/upload');
    return null;
  }

  const handleGenerateSheet = async () => {
    setIsGenerating(true);

    // TODO: POST /api/print/generate-sheet { filename, quantity, photoSizePreset }
    // const res = await fetch('/api/print/generate-sheet', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ filename: state.filename, quantity, photoSizePreset: state.sizePreset }),
    // });
    // const blob = await res.blob();
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a'); a.href = url; a.download = 'snappass_sheet.png'; a.click();

    await new Promise((r) => setTimeout(r, 1200));
    setIsGenerating(false);
    alert('Sheet generation coming soon! Connect python-ai-service to complete this step.');
  };

  // Build grid of photo slots
  const slots = Array.from({ length: quantity });

  return (
    <div className="print-page page-content">
      <div className="print-page__header">
        <h1 className="section-title">Print Preview</h1>
        <p className="section-subtitle">
          Adjust quantity and generate your printable A4 sheet.
        </p>
      </div>

      <div className="print-page__layout">
        {/* A4 Sheet Preview */}
        <section className="print-page__sheet card" aria-label="A4 sheet preview">
          <p className="print-page__sheet-label">A4 Sheet Preview</p>
          <div className="sheet-grid" style={{ '--cols': Math.ceil(Math.sqrt(quantity)) }}>
            {slots.map((_, i) => (
              <div key={i} className="sheet-slot">
                <img
                  src={state.processedUrl}
                  alt={`Sheet slot ${i + 1}`}
                  className="sheet-slot__img"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Controls */}
        <aside className="print-page__controls card" aria-label="Print settings">
          <div>
            <p className="print-info-label">Selected Preset</p>
            <p className="print-info-value">{state.sizePreset || '35x45 mm'}</p>
          </div>
          <div>
            <p className="print-info-label">Background</p>
            <p className="print-info-value" style={{ textTransform: 'capitalize' }}>
              {state.background || 'White'}
            </p>
          </div>

          <hr className="divider" />

          <QuantityInput value={quantity} onChange={setQuantity} />

          <hr className="divider" />

          <PrintButton
            onClick={handleGenerateSheet}
            isLoading={isGenerating}
            disabled={isGenerating}
          />

          <Link to="/editor" className="btn btn-ghost print-page__back-btn">
            ← Back to Editor
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default PrintPreviewPage;
