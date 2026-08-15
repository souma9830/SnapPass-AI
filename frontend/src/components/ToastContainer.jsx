import React from 'react';
import { useToast } from '../context/ToastContext';
import ToastItem from './ToastItem';

/**
 * ToastContainer — Viewport overlay rendering stacked toast alerts.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast() || { toasts: [], removeToast: () => {} };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notification alerts"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

export default ToastContainer;
