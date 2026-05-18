import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmptyState.css';

function EmptyState({
  title,
  description,
  buttonText = 'Upload Photo',
  redirectTo = '/upload',
}) {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <div className="empty-state__illustration" aria-hidden="true">
        <svg viewBox="0 0 120 120" focusable="false" aria-hidden="true">
          <rect x="18" y="18" width="84" height="84" rx="20" />
          <path d="M36 74l18-20 16 18 12-14 16 18" />
          <circle cx="52" cy="48" r="7" />
        </svg>
      </div>

      <h2 className="empty-state__title">{title}</h2>

      <p className="empty-state__description">
        {description}
      </p>

      <button
        className="btn btn-primary empty-state__button"
        onClick={() => navigate(redirectTo)}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EmptyState;