import { useState, useEffect } from 'react';

export const useOfflineSync = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleStatus = () => setOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);
  return { online };
};