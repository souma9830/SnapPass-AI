const listeners = new Set();

export const getNetworkDetails = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || null,
    rtt: connection?.rtt || null,
    saveData: connection?.saveData || false,
  };
};

export const subscribeNetworkChange = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const registerNetworkMonitor = (onOffline, onOnline) => {
  const handleOffline = () => {
    const details = getNetworkDetails();
    listeners.forEach((fn) => fn(details));
    if (onOffline) onOffline(details);
  };

  const handleOnline = () => {
    const details = getNetworkDetails();
    listeners.forEach((fn) => fn(details));
    if (onOnline) onOnline(details);
  };

  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    connection.addEventListener('change', handleOnline);
  }

  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
    if (connection) {
      connection.removeEventListener('change', handleOnline);
    }
  };
};
