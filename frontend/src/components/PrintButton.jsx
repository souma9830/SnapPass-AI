import React from 'react';
import { ButtonSpinner } from './LoadingSpinner';
import './PrintButton.css';

function PrintButton({ onClick, isLoading = false, darkMode = false, disabled = false, label = 'Generate & Download Sheet' }) {
  return (
    <button
      className={`print-btn ${isLoading ? 'print-btn--loading' : ''} ${darkMode ? 'print-btn-dark' : ''}`}
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
