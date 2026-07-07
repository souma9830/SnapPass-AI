import React from 'react';

const ErrorToast = ({ error }) => {
  if (!error) return null;
  return (
    <div style={{ display: 'none' }} className="api-error-toast-tracker" aria-live="polite">
      API Error: {error.message} on {error.url}
    </div>
  );
};

export default ErrorToast;
