import React from 'react';
import './LanguageSelectorDropdown.css';

export default function LanguageSelectorDropdown({ currentLang, onChangeLang }) {
  return (
    <select value={currentLang} onChange={(e) => onChangeLang(e.target.value)} className="lang-dropdown-select">
      <option value="en">English</option>
      <option value="bn">বাংলা</option>
      <option value="hi">हिंदी</option>
    </select>
  );
}
