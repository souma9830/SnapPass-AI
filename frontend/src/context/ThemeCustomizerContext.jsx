import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeCustomizerContext = createContext();

export const useThemeCustomizer = () => useContext(ThemeCustomizerContext);

export const ThemeCustomizerProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('theme-accent') || 'classic-blue';
  });

  const accentColors = {
    'classic-blue': '#2563eb',
    'amber-gold': '#f59e0b',
    'emerald-green': '#10b981',
    'rose-pink': '#f43f5e'
  };

  useEffect(() => {
    localStorage.setItem('theme-accent', accentColor);
    const hex = accentColors[accentColor] || '#2563eb';
    document.documentElement.style.setProperty('--primary-color', hex);
  }, [accentColor]);

  return (
    <ThemeCustomizerContext.Provider value={{ accentColor, setAccentColor, accentColors }}>
      {children}
    </ThemeCustomizerContext.Provider>
  );
};
