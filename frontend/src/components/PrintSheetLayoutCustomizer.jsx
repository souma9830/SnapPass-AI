import React from 'react';
import { PAPER_PRESETS } from '../utils/printLayoutPresets';

/**
 * PrintSheetLayoutCustomizer — UI control panel for selecting paper size,
 * toggling cut guides, and triggering high-DPI PDF downloads.
 */
export function PrintSheetLayoutCustomizer({
  selectedPreset,
  onSelectPreset,
  showCropGuides,
  onToggleCropGuides,
  onDownloadPDF,
  isExporting = false,
}) {
  return (
    <div
      className="print-sheet-customizer"
      style={{
        padding: '1.25rem',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
        🖨️ Print Sheet Customizer
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
          Select Paper Format
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => onSelectPreset(e.target.value)}
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #475569',
            fontSize: '0.9rem',
          }}
        >
          {PAPER_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name} ({preset.maxPhotos} photos)
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="cropGuidesToggle"
          checked={showCropGuides}
          onChange={(e) => onToggleCropGuides(e.target.checked)}
          style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
        />
        <label htmlFor="cropGuidesToggle" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
          Show Trim / Cut Guides
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <button
          onClick={onDownloadPDF}
          disabled={isExporting}
          style={{
            flex: 1,
            padding: '0.7rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontWeight: 600,
            border: 'none',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            opacity: isExporting ? 0.6 : 1,
          }}
          aria-label="Download High-DPI PDF Print Sheet"
        >
          {isExporting ? 'Generating PDF...' : '📄 Download Printable PDF'}
        </button>
      </div>
    </div>
  );
}

export default PrintSheetLayoutCustomizer;
