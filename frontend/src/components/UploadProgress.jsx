import React from 'react';

function UploadProgress({ progress, darkMode, items = [], onCancel, onRetry }) {
  const numericProgress = typeof progress === 'number' ? progress : progress?.completed ? Math.round((progress.completed / (progress.total || 1)) * 100) : 0;

  if (numericProgress <= 0 && (!items || items.length === 0)) return null;

  const barColor =
    numericProgress < 50
      ? 'var(--color-warning, #f59e0b)'
      : numericProgress < 80
        ? 'var(--color-primary, #3b82f6)'
        : 'var(--color-success, #10b981)';

  return (
    <div className="upload-progress-container" style={{ width: '100%', marginTop: '12px' }}>
      <div
        role="progressbar"
        aria-valuenow={numericProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Upload progress: ${numericProgress}%`}
        style={{
          width: '100%',
          height: '8px',
          background: darkMode ? '#1e293b' : '#e2e8f0',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${numericProgress}%`,
            height: '100%',
            background: barColor,
            borderRadius: '999px',
            transition: 'width 0.4s ease, background 0.3s ease',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginTop: '6px',
          fontSize: '0.85rem',
          color: darkMode ? '#94a3b8' : '#64748b',
        }}
      >
        <span>{numericProgress}% Completed</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Retry Failed
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            marginTop: '10px',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        >
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                justify: 'space-between',
                padding: '4px 0',
                fontSize: '0.8rem',
                borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9',
              }}
            >
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whitespace: 'nowrap', maxWidth: '200px' }}>
                {item.name || item.id}
              </span>
              <span
                style={{
                  color:
                    item.status === 'done'
                      ? '#10b981'
                      : item.status === 'failed'
                        ? '#ef4444'
                        : '#f59e0b',
                }}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UploadProgress;
