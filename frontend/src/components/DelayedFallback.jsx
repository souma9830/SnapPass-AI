import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * DelayedFallback — waits a short period before showing the LoadingSpinner.
 * Prevents UI flickering for very fast route transitions or chunk loads.
 *
 * Props:
 *   delayMs (number) — milliseconds to wait before rendering the spinner (default 250)
 */
function DelayedFallback({ delayMs = 250, spinnerSize = 'lg' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!show) return null;

  return <LoadingSpinner fullPage message="" size="lg" />;
}

export default DelayedFallback;
