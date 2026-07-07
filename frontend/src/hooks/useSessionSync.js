import { useEffect, useState } from 'react';
import { syncSessionAcrossTabs, encryptSessionData, decryptSessionData } from '../utils/sessionSync.js';

export const useSessionSync = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const localCipher = localStorage.getItem(key);
    if (localCipher) {
      const decoded = decryptSessionData(localCipher);
      return decoded !== null ? decoded : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    const unsub = syncSessionAcrossTabs(key, (newValue) => {
      if (newValue !== null) setValue(newValue);
    });
    return unsub;
  }, [key]);

  const updateSessionValue = (newValue) => {
    setValue(newValue);
    const cipher = encryptSessionData(newValue);
    if (cipher) {
      localStorage.setItem(key, cipher);
    }
  };

  return [value, updateSessionValue];
};
