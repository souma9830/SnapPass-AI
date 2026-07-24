import { useState, useEffect } from 'react';

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

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
