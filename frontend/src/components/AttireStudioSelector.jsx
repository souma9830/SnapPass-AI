import React from 'react';

export const ATTIRE_OPTIONS = [
  { id: 'none', label: 'Original Attire', icon: '👔' },
  { id: 'suit_black', label: 'Classic Black Suit', icon: '💼' },
  { id: 'suit_navy', label: 'Navy Professional Suit', icon: '🧥' },
  { id: 'blazer_grey', label: 'Grey Formal Blazer', icon: '👔' },
  { id: 'shirt_white', label: 'Formal White Shirt', icon: '👕' },
];

/**
 * AttireStudioSelector — Virtual suit & attire replacement selection studio.
 */
export function AttireStudioSelector({ selectedAttire = 'none', onSelectAttire }) {
  return (
    <div
      className="attire-studio-selector"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}
    >
      <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>
        🕴️ AI Virtual Attire Fitting Studio
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        {ATTIRE_OPTIONS.map((item) => {
          const isSelected = selectedAttire === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectAttire(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '6px',
                border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: isSelected ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                color: '#f8fafc',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AttireStudioSelector;
