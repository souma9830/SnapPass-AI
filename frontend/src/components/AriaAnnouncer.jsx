import React from 'react';

const AriaAnnouncer = ({ message, politeness = 'polite' }) => (
  <div className="sr-only" aria-live={politeness} aria-atomic="true">
    {message}
  </div>
);

export default AriaAnnouncer;