import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmptyState.css';

function EmptyState({
  title,
  description,
  buttonText = 'Upload Photo',
  redirectTo = '/upload',
  onAction,
  secondaryButton,
  darkMode,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate(redirectTo);
    }
  };

  return (
    <div className={`empty-state ${darkMode ? 'empty-state-dark' : ''}`}>
      <div
        className={`empty-state__illustration ${darkMode ? 'empty-state__illustration-dark' : 'empty-state__illustration-light'}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 120 120" focusable="false" aria-hidden="true">
          <rect x="18" y="18" width="84" height="84" rx="20" />
          <path d="M36 74l18-20 16 18 12-14 16 18" />
          <circle cx="52" cy="48" r="7" />
        </svg>
      </div>

      <h2
        className={`empty-state__title ${darkMode ? 'empty-state__title-dark' : ''}`}
      >
        {title}
      </h2>

      <p className="empty-state__description">{description}</p>

      <button
        type="button"
        className={`btn btn-primary empty-state__button ${darkMode ? 'empty-state__button-dark' : ''}`}
        onClick={handleAction}
      >
        {buttonText}
      </button>

      {secondaryButton && (
        <button
          className={`empty-state__secondary-btn ${darkMode ? 'empty-state__secondary-btn-dark' : ''}`}
          onClick={() => secondaryButton.onClick()}
          style={{ marginTop: '10px' }}
        >
          {secondaryButton.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
