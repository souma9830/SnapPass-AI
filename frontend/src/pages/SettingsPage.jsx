import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import { motion } from 'framer-motion';
import { validateEmail, validateRequired, validateMinLength, createValidator } from '../utils/validators';

const preferencesRules = {
  fullName: [validateRequired, (v) => validateMinLength(v, 2, 'Full name')],
  email: [
    validateRequired,
    (v) => {
      if (!validateEmail(v)) return 'Enter a valid email address';
      return '';
    },
  ],
};

const validator = createValidator(preferencesRules);

function SettingsPage({ darkMode, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('preferences');
  const [form, setForm] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    language: 'en',
    autoSave: true,
    hiRes: false,
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

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
    } catch {
      setSessionError('Network error while retrieving active sessions.');
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'security') fetchSessions();
  }, [activeTab]);

  const handleRevokeSession = async (sessionId) => {
    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(sessions.filter((s) => s._id !== sessionId));
      }
    } catch {
      // silent
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== field)));
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const errs = validator(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
          <aside className="settings-sidebar card">
            <button
              className={`sidebar-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              General Preferences
            </button>
            <button
              className={`sidebar-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security & Sessions
            </button>
          </aside>

          <main className="settings-main card">
            {activeTab === 'preferences' && (
              <form onSubmit={handleSavePreferences} className="settings-form" noValidate>
                <h2 className="form-section-title">Application Preferences</h2>

                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Profile Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
                    placeholder="Enter your name"
                  />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="language">Default Language</label>
                  <select
                    id="language"
                    value={form.language}
                    onChange={(e) => handleChange('language', e.target.value)}
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
                    checked={form.autoSave}
                    onChange={(e) => handleChange('autoSave', e.target.checked)}
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
                    checked={form.hiRes}
                    onChange={(e) => handleChange('hiRes', e.target.checked)}
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
                      Light Mode
                    </button>
                    <button
                      type="button"
                      className={`theme-btn ${darkMode ? 'theme-btn--active' : ''}`}
                      onClick={() => !darkMode && toggleTheme()}
                    >
                      Dark Mode
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  {saved ? 'Saved!' : 'Save Changes'}
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
                {sessionError && !loadingSessions && <div className="sessions-error-box">{sessionError}</div>}

                {!loadingSessions && !sessionError && sessions.length === 0 && (
                  <div className="sessions-empty">No active database sessions found. Please login to verify sessions.</div>
                )}

                {!loadingSessions && sessions.length > 0 && (
                  <div className="sessions-list">
                    {sessions.map((sess) => (
                      <div key={sess._id} className="session-item">
                        <div className="session-info">
                          <div className="session-device">
                            {sess.userAgent.length > 40 ? `${sess.userAgent.substring(0, 40)}...` : sess.userAgent}
                          </div>
                          <div className="session-details">
                            <span><strong>IP:</strong> {sess.ipAddress}</span>
                            <span> • </span>
                            <span><strong>Created:</strong> {new Date(sess.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button onClick={() => handleRevokeSession(sess._id)} className="revoke-btn" title="Terminate session immediately">
                          Revoke
                        </button>
                      </div>
                    ))}
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
