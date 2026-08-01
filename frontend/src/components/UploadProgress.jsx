import React from 'react';

function UploadProgress({ progress, darkMode }) {
  if (progress <= 0 || progress >= 100) return null;

  const barColor =
    progress < 50
      ? 'var(--color-warning)'
      : progress < 80
        ? 'var(--color-primary)'
        : 'var(--color-success)';

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Uploading — ${progress}%`}
      className="upload-progress"
      style={{
        width: '100%',
        marginTop: '8px',
      }}
    >
      <div
        className="upload-progress__label"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
          fontSize: '0.8rem',
          color: darkMode ? '#94a3b8' : '#64748b',
        }}
      >
        <span>Uploading — {progress}%</span>
        <span>{progress}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          background: darkMode ? '#1e293b' : '#e2e8f0',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: barColor,
            borderRadius: '999px',
            transition: 'width 0.4s ease, background 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

export default UploadProgress;
