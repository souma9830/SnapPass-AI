import React from 'react';

const SkipToContent = () => (
  <a
    href="#main-content"
    style={{
      position: 'absolute',
      top: '-9999px',
      left: '-9999px',
      zIndex: 10000,
      padding: '8px 16px',
      background: '#3b82f6',
      color: '#ffffff',
      borderRadius: '6px',
      fontWeight: '600',
      textDecoration: 'none',
    }}
    onFocus={(e) => {
      e.target.style.top = '10px';
      e.target.style.left = '10px';
    }}
    onBlur={(e) => {
      e.target.style.top = '-9999px';
      e.target.style.left = '-9999px';
    }}
  >
    Skip to main content
  </a>
);

export default SkipToContent;
