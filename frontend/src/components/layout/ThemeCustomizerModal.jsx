import React from 'react';
import { useThemeCustomizer } from '../../context/ThemeCustomizerContext';
import './ThemeCustomizerModal.css';

export default function ThemeCustomizerModal({ isOpen, onClose }) {
  const { theme, toggleTheme, accentColor, setAccentColor } = useThemeCustomizer();

  if (!isOpen) return null;

  return (
    <div className="theme-modal-backdrop" onClick={onClose}>
      <div className="theme-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Theme & Accent Customizer</h3>
        <div className="theme-option">
          <label>Mode:</label>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        <div className="theme-option">
          <label>Accent Palette:</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="color-picker-input"
          />
        </div>
        <button onClick={onClose} className="close-btn">Done</button>
      </div>
    </div>
  );
}
