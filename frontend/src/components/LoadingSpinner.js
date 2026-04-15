import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner — full-page or inline loading indicator.
 *
 * Props:
 *   fullPage (bool)   — centers spinner in the viewport (default false)
 *   message  (string) — optional status message shown below the spinner
 *   size     (string) — 'sm' | 'md' | 'lg' (default 'md')
 */
function LoadingSpinner({ fullPage = false, message = '', size = 'md' }) {
  return (
    <div
      className={`spinner-wrap${fullPage ? ' spinner-wrap--fullpage' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={`spinner spinner--${size}`} aria-hidden="true" />
      {message && <p className="spinner-message">{message}</p>}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default LoadingSpinner;
