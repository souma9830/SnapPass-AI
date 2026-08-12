import React from 'react';
import { useToastNotification } from '../../context/ToastNotificationContext';
import './ToastContainer.css';

export default function ToastContainer() {
  const { toasts } = useToastNotification();
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-card ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
