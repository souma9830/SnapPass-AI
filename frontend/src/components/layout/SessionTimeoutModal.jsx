import React from 'react';
import './SessionTimeoutModal.css';

export default function SessionTimeoutModal({ isOpen, onExtend, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="session-modal-backdrop">
      <div className="session-modal-card">
        <h3>Session Inactivity Warning</h3>
        <p>Your session will expire shortly due to inactivity.</p>
        <div className="session-actions">
          <button onClick={onExtend} className="extend-session-btn">Keep Session Active</button>
          <button onClick={onLogout} className="logout-btn">Log Out</button>
        </div>
      </div>
    </div>
  );
}
