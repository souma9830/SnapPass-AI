import React from 'react';
import { useThemeCustomizer } from '../context/ThemeCustomizerContext';

export const ThemeColorSelector = () => {
  const { accentColor, setAccentColor, accentColors } = useThemeCustomizer();

  return (
    <div className="theme-color-selector" style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: '600' }}>Customize Theme Accent</h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: '#9ca3af' }}>Select a color to update your workspace accents.</p>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {Object.keys(accentColors).map((colorKey) => (
          <button
            key={colorKey}
            type="button"
            onClick={() => setAccentColor(colorKey)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: accentColors[colorKey],
              border: accentColor === colorKey ? '3px solid #ffffff' : '2px solid transparent',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              transform: accentColor === colorKey ? 'scale(1.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
            title={colorKey.replace('-', ' ')}
            aria-label={`Select ${colorKey}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeColorSelector;
