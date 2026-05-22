import React, { useEffect, useState } from 'react';
import './Toast.css';

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    // Wait for the exit animation to finish before calling the actual close handler
    setTimeout(() => {
      onClose(id);
    }, 300); // 300ms matches the fadeOut animation duration
  };

  const icon = ICONS[type] || ICONS.info;

  return (
    <div className={`toast toast--${type} ${isExiting ? 'toast--exiting' : ''}`} role="alert">
      <div className="toast__icon" aria-hidden="true">{icon}</div>
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button className="toast__close" onClick={handleClose} aria-label="Close notification">
        ✕
      </button>
      {duration > 0 && (
        <div 
          className="toast__progress" 
          style={{ animationDuration: `${duration}ms` }} 
        />
      )}
    </div>
  );
};

export default Toast;
