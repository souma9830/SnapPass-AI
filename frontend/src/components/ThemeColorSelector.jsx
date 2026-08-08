import React from 'react';
import { useThemeCustomizer } from '../context/ThemeCustomizerContext';

export const ThemeColorSelector = ({ compact = false }) => {
  const { accentColor, setAccentColor, accentColors } = useThemeCustomizer();

  return (
    <div className={`theme-color-selector ${compact ? 'compact' : ''}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {Object.entries(accentColors).map(([key, hex]) => (
        <button
          key={key}
          type="button"
          onClick={() => setAccentColor(key)}
          title={key.replace('-', ' ')}
          style={{
            width: compact ? '22px' : '28px',
            height: compact ? '22px' : '28px',
            borderRadius: '50%',
            backgroundColor: hex,
            border: accentColor === key ? '2px solid #ffffff' : '1px solid transparent',
            boxShadow: accentColor === key ? `0 0 0 2px ${hex}` : 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.2s ease',
          }}
          aria-label={`Select theme color ${key}`}
        />
      ))}
    </div>
  );
};

export default ThemeColorSelector;
