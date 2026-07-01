import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUploadHistory } from '../services/uploadHistoryService';
import EmptyState from '../components/EmptyState';
import './HistoryPage.css';


function HistoryPage({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const history = await fetchUploadHistory();
        if (!cancelled) setItems(Array.isArray(history) ? history : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load upload history.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;

    return items.filter((it) => {
      const file = (it.originalFileName || it.processedFileName || '').toLowerCase();
      const preset = (it.presetSize || '').toLowerCase();
      const status = (it.status || '').toLowerCase();
      return file.includes(q) || preset.includes(q) || status.includes(q);
    });
  }, [items, searchQuery]);

  const handleDownloadAgain = async (item) => {
    if (!item?.processedImage) return;

    // Open in new tab (backend serves /uploads as static)
    window.open(item.processedImage, '_blank', 'noopener,noreferrer');
  };

  const handlePrintAgain = async (item) => {
    // Existing print endpoint generates an A4 sheet from a filename.
    // Our upload history model stores original/processed URLs, not the backend filename.
    // So we navigate to print preview with what we have; print flow can be extended later.
    // For now: if processedImage exists, pass it through.
    navigate('/print-preview', {
      state: {
        processedUrl: item.processedImage,
        filename: item.originalFileName,
        background: item.backgroundColor,
        sizePreset: item.presetSize,
        historyId: item.id,
      },
    });
  };

  return (
    <div className="upload-history-page">
      <div className="upload-history-page__header">
        <h1 className="upload-history-page__title">Upload History</h1>
      </div>

      <div className="upload-history-page__controls">
        <input
          type="text"
          className="upload-history-page__search-input"
          placeholder="Search by file name, preset or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="upload-history-page__skeleton-grid" aria-label="Loading upload history">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="upload-history-page__skeleton-card" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="upload-history-page__error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No uploads yet"
          description="Upload and process your passport photo to see it here."
          buttonText="Go to Upload"
          redirectTo="/upload"
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      )}

      {!loading && !error && items.length > 0 && filtered.length === 0 && (
        <p className="upload-history-page__empty">No matching uploads found.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="upload-history-page__grid">
          {filtered.map((item) => {
            const previewUrl = item.processedImage || item.originalImage;
            const status = item.status || 'pending';
            const statusClass = `upload-history-page__status upload-history-page__status--${status}`;

            return (
              <div key={item.id} className="upload-history-page__card">
                <button
                  type="button"
                  className="upload-history-page__preview-btn"
                  onClick={() => setPreviewItem(item)}
                  aria-label={`Preview ${item.originalFileName || 'upload'}`}
                >
                  <img
                    className="upload-history-page__thumb"
                    src={previewUrl}
                    alt={item.originalFileName || 'Upload preview'}
                    loading="lazy"
                  />
                </button>

                <div className="upload-history-page__meta">
                  <div className="upload-history-page__file">{item.originalFileName || 'Untitled file'}</div>
                  <div className="upload-history-page__preset">Preset: {item.presetSize || '—'}</div>
                  <div className={statusClass}>Status: {status}</div>
                  <div className="upload-history-page__date">
                    {item.uploadedAt ? new Date(item.uploadedAt).toLocaleString() : '—'}
                  </div>
                </div>

                <div className="upload-history-page__actions">
                  <button
                    className="upload-history-page__action upload-history-page__action--download"
                    onClick={() => handleDownloadAgain(item)}
                    disabled={!item.processedImage || status !== 'completed'}
                    title={status !== 'completed' ? 'Processing not completed yet' : 'Download processed image'}
                  >
                    Download Again
                  </button>
                  <button
                    className="upload-history-page__action upload-history-page__action--print"
                    onClick={() => handlePrintAgain(item)}
                    disabled={!item.processedImage || status !== 'completed'}
                    title={status !== 'completed' ? 'Processing not completed yet' : 'Print again'}
                  >
                    Print Again
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewItem && (
        <div
          className="upload-history-page__modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="upload-history-page__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="upload-history-page__modal-header">
              <div className="upload-history-page__modal-title">
                {previewItem.originalFileName || 'Preview'}
              </div>
              <button
                className="upload-history-page__modal-close"
                onClick={() => setPreviewItem(null)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="upload-history-page__modal-body">
              <img
                className="upload-history-page__modal-img"
                src={previewItem.processedImage || previewItem.originalImage}
                alt="Processed upload preview"
              />
            </div>

            <div className="upload-history-page__modal-actions">
              <button
                className="upload-history-page__action upload-history-page__action--download"
                onClick={() => handleDownloadAgain(previewItem)}
                disabled={!previewItem.processedImage || previewItem.status !== 'completed'}
              >
                Download Again
              </button>
              <button
                className="upload-history-page__action upload-history-page__action--print"
                onClick={() => handlePrintAgain(previewItem)}
                disabled={!previewItem.processedImage || previewItem.status !== 'completed'}
              >
                Print Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;

