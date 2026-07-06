import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'theme';

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches)
    return 'dark';
  return 'light';
}

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => getInitialTheme() === 'dark');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setDarkMode(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
