import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import { motion } from 'framer-motion';

function SettingsPage({ darkMode, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('preferences');
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [language, setLanguage] = useState('en');
  const [autoSave, setAutoSave] = useState(true);
  const [hiRes, setHiRes] = useState(false);
  
  // Audited active sessions
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionError, setSessionError] = useState('');

  const fetchSessions = async () => {
    setLoadingSessions(true);
    setSessionError('');
    try {
      const res = await fetch('/api/auth/sessions');
      if (res.ok) {
        const body = await res.json();
        if (body.success) {
          setSessions(body.data || []);
        } else {
          setSessionError(body.message || 'Failed to load sessions');
        }
      } else {
        setSessionError('Log in to manage active audited sessions.');
      }
    } catch (err) {
      setSessionError('Network error while retrieving active sessions.');
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'security') {
      fetchSessions();
    }
  }, [activeTab]);

  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const [revoking, setRevoking] = useState(false);

  const handleRevokeSession = async (sessionId) => {
    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSessions(sessions.filter((s) => s._id !== sessionId));
        setSelectedSessions(prev => { const next = new Set(prev); next.delete(sessionId); return next; });
      } else {
        alert('Could not revoke session. Please try again.');
      }
    } catch (err) {
      alert('Network error. Unable to revoke session.');
    }
  };

  const toggleSessionSelection = (sessionId) => {
    setSelectedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  const handleBulkRevoke = async () => {
    if (selectedSessions.size === 0) return;
    setRevoking(true);
    try {
      const res = await fetch('/api/auth/sessions/bulk-revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionIds: Array.from(selectedSessions) }),
      });
      if (res.ok) {
        setSessions(sessions.filter((s) => !selectedSessions.has(s._id)));
        setSelectedSessions(new Set());
      } else {
        alert('Could not revoke selected sessions.');
      }
    } catch (err) {
      alert('Network error during bulk revoke.');
    }
    setRevoking(false);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    alert('Preferences saved successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className={`settings-layout ${darkMode ? 'settings-layout--dark' : ''}`}>
      <motion.div
        className="settings-container page-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="settings-header">
          <h1 className="settings-title">Account Settings</h1>
          <p className="settings-subtitle">Manage your profile, preferences, and active security sessions.</p>
        </header>

        <div className="settings-grid">
          {/* Sidebar Navigation */}
          <aside className="settings-sidebar card">
            <button
              className={`sidebar-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              ⚙️ General Preferences
            </button>
            <button
              className={`sidebar-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Security & Sessions
            </button>
          </aside>

          {/* Form Content Area */}
          <main className="settings-main card">
            {activeTab === 'preferences' && (
              <form onSubmit={handleSavePreferences} className="settings-form">
                <h2 className="form-section-title">Application Preferences</h2>

                <div className="form-group">
                  <label className="form-label">Profile Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Default Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-select-elem"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español (ES)</option>
                    <option value="fr">Français (FR)</option>
                  </select>
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="autoSave"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="autoSave" className="checkbox-label">
                    <strong>Auto-save Uploads:</strong> Temporarily cache uploads locally for faster editing
                  </label>
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="hiRes"
                    checked={hiRes}
                    onChange={(e) => setHiRes(e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="hiRes" className="checkbox-label">
                    <strong>High-Resolution Exports:</strong> Export sheets with maximum DPI formatting
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Interface Theme Mode</label>
                  <div className="theme-toggle-container">
                    <button
                      type="button"
                      className={`theme-btn ${!darkMode ? 'theme-btn--active' : ''}`}
                      onClick={() => darkMode && toggleTheme()}
                    >
                      ☀️ Light Mode
                    </button>
                    <button
                      type="button"
                      className={`theme-btn ${darkMode ? 'theme-btn--active' : ''}`}
                      onClick={() => !darkMode && toggleTheme()}
                    >
                      🌙 Dark Mode
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="security-settings">
                <h2 className="form-section-title">Active Audited Sessions</h2>
                <p className="section-description">
                  These are the devices and IP addresses currently logged into your account. You can revoke any session at any time.
                </p>

                {loadingSessions && <div className="sessions-loading">Loading session metadata...</div>}

                {sessionError && <div className="sessions-error-box">{sessionError}</div>}

                {!loadingSessions && !sessionError && sessions.length === 0 && (
                  <div className="sessions-empty">No active database sessions found. Please login to verify sessions.</div>
                )}

                {!loadingSessions && sessions.length > 0 && (
                  <div>
                    {selectedSessions.size > 0 && (
                      <button
                        onClick={handleBulkRevoke}
                        disabled={revoking}
                        className="revoke-btn revoke-btn--bulk"
                      >
                        {revoking ? 'Revoking...' : `Revoke Selected (${selectedSessions.size})`}
                      </button>
                    )}
                    <div className="sessions-list">
                      {sessions.map((sess) => (
                        <div key={sess._id} className="session-item">
                          <input
                            type="checkbox"
                            checked={selectedSessions.has(sess._id)}
                            onChange={() => toggleSessionSelection(sess._id)}
                            className="session-checkbox"
                            aria-label={`Select session from ${sess.ipAddress}`}
                          />
                          <div className="session-info">
                            <div className="session-device">
                              🖥️ {sess.userAgent.length > 40 ? sess.userAgent.substring(0, 40) + '...' : sess.userAgent}
                            </div>
                            <div className="session-details">
                              <span><strong>IP:</strong> {sess.ipAddress}</span> • <span><strong>Created:</strong> {new Date(sess.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRevokeSession(sess._id)}
                            className="revoke-btn"
                            title="Terminate session immediately"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsPage;
