import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { validateSettingsInput } from '../utils/settingsValidator.js';
import { ThemeColorSelector } from '../components/ThemeColorSelector';
import { ActivityLogViewer } from '../components/ActivityLogViewer';

function SettingsPage() {
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('preferences');
  const form = useFormValidation({
    fullName: { initialValue: 'John Doe', rules: [R.required, (v) => v.length >= 2 || 'Name too short'] },
    email: { initialValue: 'john.doe@example.com', rules: [R.required, R.email] },
    language: { initialValue: 'en' },
    autoSave: { initialValue: true },
    hiRes: { initialValue: false },
  }, { validateOnChange: true });

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

  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const [revoking, setRevoking] = useState(false);

  const handleRevokeSession = async (sessionId) => {
    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSessions(sessions.filter((s) => s._id !== sessionId));
        setSelectedSessions((prev) => {
          const next = new Set(prev);
          next.delete(sessionId);
          return next;
        });
      }
    } catch {
      // silent
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) =>
        Object.fromEntries(Object.entries(prev).filter(([k]) => k !== field))
      );
    }
  };

  const toggleSessionSelection = (sessionId) => {
    setSelectedSessions((prev) => {
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

  const handleSave = form.handleSubmit(async (values) => {
    alert('Preferences saved successfully!');
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div
      className={`settings-layout ${darkMode ? 'settings-layout--dark' : ''}`}
    >
      <motion.div
        className="settings-container page-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="settings-header">
          <h1 className="settings-title">Account Settings</h1>
          <p className="settings-subtitle">
            Manage your profile, preferences, and active security sessions.
          </p>
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
              <form onSubmit={handleSave} className="settings-form" noValidate>
                <h2 className="form-section-title">Application Preferences</h2>

                <FormField
                  label="Profile Full Name"
                  name="fullName"
                  value={form.values.fullName}
                  error={form.errors.fullName}
                  touched={form.touched.fullName}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="Enter your name"
                  required
                />

                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.values.email}
                  error={form.errors.email}
                  touched={form.touched.email}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="Enter your email"
                  required
                />

                <FormField
                  label="Default Language"
                  name="language"
                  type="select"
                  value={form.values.language}
                  error={form.errors.language}
                  touched={form.touched.language}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  options={[
                    { value: 'en', label: 'English (US)' },
                    { value: 'es', label: 'Español (ES)' },
                    { value: 'fr', label: 'Français (FR)' },
                  ]}
                />

                <FormField
                  label="Auto-save Uploads"
                  name="autoSave"
                  type="checkbox"
                  value={form.values.autoSave}
                  onChange={form.handleChange}
                >
                  <label className="checkbox-label">
                    <strong>Auto-save Uploads:</strong> Temporarily cache uploads locally for faster editing
                  </label>
                </FormField>

                <FormField
                  label="High-Resolution Exports"
                  name="hiRes"
                  type="checkbox"
                  value={form.values.hiRes}
                  onChange={form.handleChange}
                >
                  <label className="checkbox-label">
                    <strong>High-Resolution Exports:</strong> Export sheets with maximum DPI formatting
                  </label>
                </FormField>

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

                <ThemeColorSelector />

                <button type="submit" className="btn btn-primary submit-btn" disabled={form.submitting}>
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="security-settings">
                <h2 className="form-section-title">Active Audited Sessions</h2>
                <p className="section-description">
                  These are the devices and IP addresses currently logged into
                  your account. You can revoke any session at any time.
                </p>

                {loadingSessions && (
                  <div className="sessions-loading">
                    Loading session metadata...
                  </div>
                )}
                {sessionError && !loadingSessions && (
                  <div className="sessions-error-box">{sessionError}</div>
                )}

                {!loadingSessions && !sessionError && sessions.length === 0 && (
                  <div className="sessions-empty">
                    No active database sessions found. Please login to verify
                    sessions.
                  </div>
                )}

                {!loadingSessions && sessions.length > 0 && (
                  <div>
                    {selectedSessions.size > 0 && (
                      <button
                        onClick={handleBulkRevoke}
                        disabled={revoking}
                        className="revoke-btn revoke-btn--bulk"
                      >
                        {revoking
                          ? 'Revoking...'
                          : `Revoke Selected (${selectedSessions.size})`}
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
                              {sess.userAgent.length > 40
                                ? `${sess.userAgent.substring(0, 40)}...`
                                : sess.userAgent}
                            </div>
                            <div className="session-details">
                              <span>
                                <strong>IP:</strong> {sess.ipAddress}
                              </span>
                              <span> • </span>
                              <span>
                                <strong>Created:</strong>{' '}
                                {new Date(sess.createdAt).toLocaleDateString()}
                              </span>
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
                <ActivityLogViewer />
              </div>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsPage;
