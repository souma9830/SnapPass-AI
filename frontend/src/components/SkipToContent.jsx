import React from 'react';
import './SkipToContent.css';

function SkipToContent({ targetId = "main-content" }) {
  return (
    <a className="skip-to-content" href={`#${targetId}`} aria-label="Skip navigation and jump to main content">
      Skip to main content
    </a>
  );
}

export default SkipToContent;
