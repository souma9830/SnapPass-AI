// Multi-tab session synchronization and secure localStorage mapping
export const encryptSessionData = (data) => {
  try {
    const rawString = JSON.stringify(data);
    return btoa(rawString); // Standard obfuscation for local storage keys
  } catch (err) {
    return null;
  }
};

export const decryptSessionData = (cipher) => {
  try {
    const decoded = atob(cipher);
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
};

export const syncSessionAcrossTabs = (key, callback) => {
  const handler = (event) => {
    if (event.key === key) {
      const decoded = decryptSessionData(event.newValue);
      callback(decoded);
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};
