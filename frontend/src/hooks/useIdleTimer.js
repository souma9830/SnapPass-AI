import { useState, useEffect } from 'react';

export function useIdleTimer(timeoutMs = 900000, onIdle) {
  useEffect(() => {
    let timer = setTimeout(onIdle, timeoutMs);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdle, timeoutMs);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [timeoutMs, onIdle]);
}
