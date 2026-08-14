import React, { useState } from 'react';
import './PdfComplianceExportButton.css';

export default function PdfComplianceExportButton({ photoMetadata, complianceResult, onExport }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport({ photoMetadata, complianceResult });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className="pdf-compliance-export-btn"
      onClick={handleExportClick}
      disabled={isExporting || !complianceResult}
      data-testid="pdf-export-button"
      aria-label="Export ICAO Compliance PDF Audit Certificate"
    >
      <span className="export-icon">📄</span>
      {isExporting ? 'Generating Audit PDF...' : 'Download ICAO Audit Certificate'}
    </button>
  );
}
