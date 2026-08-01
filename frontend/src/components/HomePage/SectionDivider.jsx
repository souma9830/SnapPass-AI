import React from 'react';

/**
 * SectionDivider – subtle gradient separator between major content blocks.
 * Keeps transitions smooth without competing with the existing design.
 */
const SectionDivider = ({ darkMode }) => (
  <div
    className={`section-divider ${darkMode ? 'section-divider-dark' : ''}`}
    role="presentation"
    aria-hidden="true"
  >
    <div className="section-divider__line" />
  </div>
);

export default SectionDivider;
