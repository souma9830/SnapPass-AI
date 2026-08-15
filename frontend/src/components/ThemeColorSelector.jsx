import React from 'react';
import { useThemeCustomizer } from '../context/ThemeCustomizerContext';

export const ThemeColorSelector = () => {
  const { colorTheme, setColorTheme } = useThemeCustomizer ? useThemeCustomizer() : { colorTheme: 'blue', setColorTheme: () => {} };

  const themes = [
    { id: 'blue', label: 'Blue', color: '#3b82f6' },
    { id: 'purple', label: 'Purple', color: '#8b5cf6' },
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'amber', label: 'Amber', color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.5rem 0' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Color Theme:</span>
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setColorTheme(t.id)}
          aria-label={`Select ${t.label} theme`}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: t.color,
            border: colorTheme === t.id ? '2px solid white' : 'none',
            cursor: 'pointer',
            boxShadow: colorTheme === t.id ? '0 0 0 2px #3b82f6' : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default ThemeColorSelector;
