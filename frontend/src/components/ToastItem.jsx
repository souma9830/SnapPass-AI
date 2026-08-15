import React from 'react';

const typeStyles = {
  success: { bg: '#064e3b', border: '#10b981', icon: '✅' },
  error: { bg: '#7f1d1d', border: '#ef4444', icon: '🚨' },
  warning: { bg: '#78350f', border: '#f59e0b', icon: '⚠️' },
  info: { bg: '#1e3a8a', border: '#3b82f6', icon: 'ℹ️' },
};

/**
 * ToastItem — ARIA-compliant individual toast alert with close button.
 */
export function ToastItem({ toast, onClose }) {
  const style = typeStyles[toast.type] || typeStyles.info;

  return (
    <div
      role="alert"
      aria-atomic="true"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: '8px',
        color: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        minWidth: '280px',
        maxWidth: '380px',
        marginBottom: '0.5rem',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{style.icon}</span>
      <div style={{ flex: 1 }}>
        {toast.title && <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{toast.title}</h5>}
        {toast.message && <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.3 }}>{toast.message}</p>}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: '1rem',
          opacity: 0.7,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default ToastItem;
