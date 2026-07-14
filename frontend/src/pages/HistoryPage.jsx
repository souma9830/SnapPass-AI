import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useHistory } from '../hooks/useHistory';
import { useUploadSearch } from '../hooks/useUploadSearch';
import HistoryCard from '../components/HistoryCard';
import './HistoryPage.css';

function HistoryPage({ darkMode }) {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const { history, deleteSession, clearHistory } = useHistory();
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    searchTerm: search,
    setSearchTerm: setSearch,
    selectedPreset,
    setSelectedPreset,
    dateOrder,
    setDateOrder,
    filteredItems: filtered
  } = useUploadSearch(history);

  const handleCardClick = (session) => {
    if (session.hasOutput && session.processedUrl) {
      navigate('/print-preview', {
        state: {
          processedUrl: session.processedUrl,
          filename: session.filename,
        },
      });
    }
  };

  const handleClear = () => {
    clearHistory();
    setShowConfirm(false);
  };

  return (
    <div className="history-page">
      <motion.div
        className="history-page__header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="history-page__header-left">
          <h1
            className={`section-title ${darkMode ? 'section-title-dark' : ''}`}
          >
            {t.historyTitle || 'Session History'}
          </h1>
          <p
            className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : ''}`}
          >
            {t.historySubtitle || 'Review your past passport photo sessions'}
          </p>
        </div>
        <div className="history-page__header-actions">
          {history.length > 0 && (
            <button
              className="history-page__clear-btn"
              onClick={() => setShowConfirm(true)}
              aria-label="Clear all history"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l-1-14" />
              </svg>
              {t.clearAll || 'Clear All'}
            </button>
          )}
        </div>
      </motion.div>

      {history.length > 0 && (
        <div className="history-page__search">
          <svg
            className="history-page__search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="history-page__search-input"
            type="search"
            placeholder={t.searchHistory || 'Search sessions...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t.searchHistory || 'Search sessions'}
          />
        </div>
      )}

      <div className="history-page__count">
        {filtered.length === 0
          ? search
            ? t.noResults || 'No matching sessions'
            : t.noHistory || 'No sessions yet'
          : `${filtered.length} ${filtered.length === 1 ? 'session' : 'sessions'}`}
      </div>

      {filtered.length > 0 ? (
        <motion.div
          className="history-page__list"
          role="list"
          aria-label="Session history"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {filtered.map((session) => (
            <motion.div
              key={session.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <HistoryCard
                session={session}
                onDelete={deleteSession}
                onClick={handleCardClick}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="history-page__empty">
          <svg
            className="history-page__empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div className="history-page__empty-title">
            {search
              ? t.noSearchResults || 'No results found'
              : t.noHistoryTitle || 'No session history'}
          </div>
          <div>
            {search
              ? t.tryDifferentSearch || 'Try a different search term'
              : t.startWithUpload ||
                'Upload and process a photo to get started'}
          </div>
        </div>
      )}

      {showConfirm && (
        <div
          className="history-page__confirm-overlay"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="history-page__confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="history-page__confirm-title">
              {t.confirmClearTitle || 'Clear all history?'}
            </div>
            <div className="history-page__confirm-text">
              {t.confirmClearText ||
                'This will permanently delete all saved sessions. This action cannot be undone.'}
            </div>
            <div className="history-page__confirm-actions">
              <button
                className="history-page__confirm-cancel"
                onClick={() => setShowConfirm(false)}
              >
                {t.cancel || 'Cancel'}
              </button>
              <button
                className="history-page__confirm-delete"
                onClick={handleClear}
              >
                {t.clearAll || 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
