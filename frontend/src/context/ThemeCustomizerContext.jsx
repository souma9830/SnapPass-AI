import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeCustomizerContext = createContext();

export const ThemeCustomizerProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('snappass_theme') || 'dark');
  const [accentColor, setAccentColor] = useState('#6366f1');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('snappass_theme', theme);
  }, [theme, accentColor]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeCustomizerContext.Provider value={{ theme, accentColor, toggleTheme, setAccentColor }}>
      {children}
    </ThemeCustomizerContext.Provider>
  );
};

export const useThemeCustomizer = () => useContext(ThemeCustomizerContext);
