import React from 'react';

const AriaAnnouncer = ({ message }) => (
  <div className="sr-only" aria-live="polite">
    {message}
  </div>
);

export default AriaAnnouncer;