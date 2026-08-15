import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations } from '../translations/translations.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('snappass_language');
      return saved && translations[saved] ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('snappass_language', lang);
    } catch {
      // silent
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, [setLanguage]);

  const t = useCallback((key) => {
    const locale = translations[language];
    return locale?.[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
