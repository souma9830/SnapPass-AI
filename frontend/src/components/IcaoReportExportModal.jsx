import React, { useState } from 'react';
import { buildIcaoCertificateHtml } from '../utils/icaoPdfReportGenerator';
import './IcaoReportExportModal.css';

export default function IcaoReportExportModal({ isOpen, onClose, auditData }) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePrintDownload = () => {
    setIsGenerating(true);
    const htmlContent = buildIcaoCertificateHtml(auditData);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>ICAO Compliance Certificate</title></head>
          <body>${htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        setIsGenerating(false);
      }, 250);
    } else {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" data-testid="icao-report-modal">
      <div className="modal-content">
        <h3 className="modal-header-title">Export ICAO 9303 Audit Certificate</h3>
        <p className="modal-subtitle">Generate an official printable verification report containing all biometric test metrics.</p>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-download"
            onClick={handlePrintDownload}
            disabled={isGenerating}
          >
            {isGenerating ? 'Preparing Certificate...' : 'Print / Save Certificate PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
