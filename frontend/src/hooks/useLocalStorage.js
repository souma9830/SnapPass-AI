import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const getFallback = () => (typeof initialValue === 'function' ? initialValue() : initialValue);
    try {
      if (typeof window === 'undefined') return getFallback();
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : getFallback();
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return getFallback();
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new Event('local-storage-change'));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key !== key) return;
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (err) {
        console.warn(`Error syncing localStorage key "${key}":`, err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
