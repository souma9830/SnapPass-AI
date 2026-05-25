import React from 'react';
import { ButtonSpinner } from './LoadingSpinner';
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
function PrintButton({ onClick, isLoading = false, darkMode, toggleTheme, disabled = false, label = 'Generate & Download Sheet' }) {
  return (
    <button
      className={`print-btn ${darkMode? isLoading ? ' print-btn--loading-dark' : ' print-btn-dark' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={isLoading ? 'Generating sheet, please wait…' : label}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <ButtonSpinner />
          Generating…
        </>
      ) : (
        <>
          <span className="print-btn__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M6 9V4h12v5" />
              <rect x="4" y="10" width="16" height="7" rx="2" />
              <path d="M7 17v3h10v-3" />
              <path d="M9 13h6" />
            </svg>
          </span>
          {label}
        </>
      )}
    </button>
  );
}

export default PrintButton;
