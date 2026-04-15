import React from 'react';
import './PrintButton.css';

/**
 * PrintButton — primary CTA to trigger sheet download or browser print.
 *
 * Props:
 *   onClick    (fn)     — handler when button clicked
 *   isLoading  (bool)   — shows spinner while generating
 *   disabled   (bool)   — disables the button
 *   label      (string) — button text (default: "Generate & Download Sheet")
 */
function PrintButton({ onClick, isLoading = false, disabled = false, label = 'Generate & Download Sheet' }) {
  return (
    <button
      className={`print-btn${isLoading ? ' print-btn--loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={isLoading ? 'Generating sheet, please wait…' : label}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="print-btn__spinner" aria-hidden="true" />
          Generating…
        </>
      ) : (
        <>
          <span className="print-btn__icon" aria-hidden="true">🖨️</span>
          {label}
        </>
      )}
    </button>
  );
}

export default PrintButton;
