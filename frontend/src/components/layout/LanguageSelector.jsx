import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSelector = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      className={`language-selector-select ${className}`}
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Select Application Language"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी (Hindi)</option>
      <option value="es">Español (Spanish)</option>
    </select>
  );
};

export default LanguageSelector;
