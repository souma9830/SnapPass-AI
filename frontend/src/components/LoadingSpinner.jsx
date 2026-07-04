import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner — versatile loading indicator that covers three common use-cases:
 *
 * 1. Page-section spinner (default)
 *    <LoadingSpinner message="Processing your photo…" size="lg" />
 *
 * 2. Full-page overlay
 *    <LoadingSpinner fullPage message="Uploading & preparing your photo…" />
 *
 * 3. Inline button spinner — use the named <ButtonSpinner /> export instead:
 *    <button disabled>
 *      <ButtonSpinner /> Generating…
 *    </button>
 *
 * Props:
 *   fullPage (bool)    — centers spinner as a fixed full-viewport overlay (default false)
 *   message  (string)  — optional status message shown below the spinner
 *   size     (string)  — 'sm' | 'md' | 'lg' (default 'md')
 *   light    (bool)    — use white ring for dark/primary-colour backgrounds (default false)
 *   delayMs  (number)  — milliseconds to wait before showing the spinner (default 0)
 */
function LoadingSpinner({ fullPage = false, message = '', size = 'md', light = false, delayMs = 0 }) {
  const [show, setShow] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!show) return null;

  return (
    <div
      className={[
        'spinner-wrap',
        fullPage ? 'spinner-wrap--fullpage' : '',
      ].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <div
        className={[
          'spinner',
          `spinner--${size}`,
          light ? 'spinner--light' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      />
      {message && <p className="spinner-message">{message}</p>}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * ButtonSpinner — tiny inline spinner for use inside <button> elements.
 *
 * Usage:
 *   <button className="btn btn-primary" disabled={isLoading}>
 *     {isLoading ? <><ButtonSpinner /> Processing…</> : '✨ Process with AI →'}
 *   </button>
 *
 * Props:
 *   light (bool) — white ring for buttons with primary/dark background (default true)
 */
export function ButtonSpinner({ light = true }) {
  return (
    <span
      className={['spinner', 'spinner--sm', 'spinner--btn', light ? 'spinner--light' : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}

export default LoadingSpinner;
