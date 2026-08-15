import React from 'react';
import './ContrastEnhancerControl.css';

export default function ContrastEnhancerControl({ onToggle, enabled }) {
  return (
    <button className={`contrast-btn ${enabled ? 'active' : ''}`} onClick={onToggle}>
      {enabled ? '✨ Contrast Enhanced' : 'Contrast Normal'}
    </button>
  );
}
