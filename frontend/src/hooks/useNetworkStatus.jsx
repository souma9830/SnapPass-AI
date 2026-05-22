import { useState, useEffect } from 'react';

function getOnlineStatus() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(getOnlineStatus);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default useNetworkStatus;
