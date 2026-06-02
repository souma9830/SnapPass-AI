import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSessionHistory,
  deleteSessionFromHistory,
  clearSessionHistory,
  saveSession,
} from '../utils/sessionManager';
import './HistoryPage.css';

function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const history = getSessionHistory();
    setSessions(history);
  };

  const handleRestore = (session) => {
    saveSession(session);

    if (session.step === 'upload') {
      navigate('/upload');
    } else if (session.step === 'editor') {
      navigate('/editor');
    } else if (session.step === 'print-preview') {
      navigate('/print-preview');
    }
  };

  const handleDelete = (sessionId) => {
    deleteSessionFromHistory(sessionId);
    loadSessions();
  };

  const handleClearAll = () => {
    clearSessionHistory();
    setSessions([]);
  };

  return (
    <div className="history-page">
      <div className="history-page__header">
        <h1 className="history-page__title">Passport Session History</h1>
        {sessions.length > 0 && (
          <button className="history-page__clear-btn" onClick={handleClearAll}>
            Clear History
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <p className="history-page__empty">No saved sessions found.</p>
      ) : (
        <div className="history-page__list">
          {sessions.map((session) => (
            <div key={session.id} className="history-page__card">
              <div className="history-page__card-content">
                <p className="history-page__filename">
                  {session.filename || 'Untitled Session'}
                </p>
                <p className="history-page__step">Step: {session.step}</p>
                {session.status && (
                  <p className="history-page__status">
                    Status: {session.status}
                  </p>
                )}
                {session.photoSizePreset && (
                  <p className="history-page__photo-size">
                    Photo Size: {session.photoSizePreset}
                  </p>
                )}
                {session.outputStatus && (
                  <p className="history-page__output-status">
                    Output: {session.outputStatus}
                  </p>
                )}
                {session.hasOutput !== undefined && (
                  <p className="history-page__has-output">
                    Output Available: {session.hasOutput ? 'Yes' : 'No'}
                  </p>
                )}
                {session.exportType && (
                  <p className="history-page__export-type">
                    Export Type: {session.exportType}
                  </p>
                )}
                <p className="history-page__date">
                  {new Date(session.savedAt).toLocaleString()}
                </p>
              </div>
              <div className="history-page__card-actions">
                <button
                  className="history-page__restore-btn"
                  onClick={() => handleRestore(session)}
                >
                  Restore
                </button>
                <button
                  className="history-page__delete-btn"
                  onClick={() => handleDelete(session.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
