import React from 'react';
import './HistoryCard.css';

const statusLabels = {
  draft: 'Draft',
  completed: 'Completed',
  failed: 'Failed',
};

function formatDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

const sizeMap = {
  '35x45': '35×45mm',
  '51x51': '51×51mm',
  '33x48': '33×48mm',
  '40x60': '40×60mm',
  '2x2in': '2×2in',
};

function HistoryCard({ session, onDelete, onClick }) {
  const status = session.status || 'draft';
  const label = statusLabels[status] || status;
  const sizeLabel =
    sizeMap[session.photoSizePreset || session.sizePreset] ||
    session.photoSizePreset ||
    '—';

  return (
    <div className="history-card" role="listitem">
      <button
        className="history-card__body"
        onClick={() => onClick?.(session)}
        aria-label={`Open session from ${formatDate(session.savedAt)}`}
      >
        <div className="history-card__thumb" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="history-card__info">
          <div className="history-card__row">
            <span className="history-card__date">
              {formatDate(session.savedAt)}
            </span>
            <span
              className={`history-card__badge history-card__badge--${status}`}
            >
              {label}
            </span>
            {session.isOffline && (
              <span className="history-card__badge history-card__badge--offline" title="Cached in IndexedDB offline storage">
                Offline
              </span>
            )}
          </div>
          <div className="history-card__meta">
            <span>Size: {sizeLabel}</span>
            {session.background && <span>• Bg: {session.background}</span>}
          </div>
        </div>
      </button>
      <button
        className="history-card__delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(session.id);
        }}
        aria-label={`Delete session from ${formatDate(session.savedAt)}`}
        title="Delete"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l-1-14" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}

export default HistoryCard;
