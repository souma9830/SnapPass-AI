import React from 'react';
import './PrintPdfPreviewModal.css';

export default function PrintPdfPreviewModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="pdf-modal-backdrop">
      <div className="pdf-modal-card">
        <h3>High-DPI Print Preview</h3>
        <p>Ready to export at 300 DPI.</p>
        <button onClick={onClose} className="close-pdf-btn">Close</button>
      </div>
    </div>
  );
}
