import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * NavigationProgressBar — Visual top progress bar that animates
 * briefly during route transitions to improve UX feedback.
 */
export function NavigationProgressBar() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(70), 100);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname]);

  if (!isLoading && progress === 100) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page navigation progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: '#3b82f6',
        zIndex: 9999,
        transition: 'width 200ms ease-in-out, opacity 200ms ease-in-out',
        width: `${progress}%`,
        opacity: isLoading ? 1 : 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default NavigationProgressBar;
