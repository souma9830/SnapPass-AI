import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = () => {
  const { locale, setLocale } = useLanguage();
  return (
    <nav>
      <span>SnapPass AI</span>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </nav>
  );
};