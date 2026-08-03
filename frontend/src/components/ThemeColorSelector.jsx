import React from 'react';
import { useThemeCustomizer } from '../context/ThemeCustomizerContext';

export const ThemeColorSelector = ({ compact = false }) => {
  const {
    accentColor,
    setAccentColor,
    accentColors,
    highContrast,
    setHighContrast,
    resetTheme,
  } = useThemeCustomizer();

  return (
    <div
      className="theme-color-selector"
      style={{
        padding: compact ? '8px' : '15px',
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        background: compact ? 'transparent' : 'rgba(15, 23, 42, 0.03)',
      }}
    >
      {!compact && (
        <>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600' }}>
            Customize Workspace Accent
          </h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', opacity: 0.8 }}>
            Choose a color palette for UI highlights and controls.
          </p>
        </>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        {Object.keys(accentColors).map((colorKey) => (
          <button
            key={colorKey}
            type="button"
            onClick={() => setAccentColor(colorKey)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: accentColors[colorKey],
              border: accentColor === colorKey ? '3px solid #ffffff' : '2px solid transparent',
              outline: accentColor === colorKey ? '2px solid #3b82f6' : 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transform: accentColor === colorKey ? 'scale(1.15)' : 'none',
              transition: 'all 0.2s ease',
            }}
            title={colorKey.replace('-', ' ')}
            aria-label={`Select ${colorKey} accent`}
          />
        ))}

        {!compact && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                name="high-contrast"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              High Contrast
            </label>
            <button
              type="button"
              onClick={resetTheme}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeColorSelector;
