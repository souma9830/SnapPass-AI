import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/AdminLogin';
import LoadingSpinner from '../components/LoadingSpinner';
import * as adminService from '../services/adminService';
import { formatDate, formatFileSize } from '../utils/formatters';
import './AdminDashboard.css';

const STAT_CONFIG = [
  { key: 'totalUploads', label: 'Total Uploads', icon: 'upload' },
  { key: 'sheetsGenerated', label: 'Sheets Generated', icon: 'print' },
  { key: 'backgroundsUsed', label: 'Processed Images', icon: 'palette' },
  { key: 'activeToday', label: 'Uploads Today', icon: 'calendar' },
];

const iconMap = {
  upload: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 16V5" />
      <path d="M8 9l4-4 4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  ),
  print: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 9V4h12v5" />
      <rect x="4" y="10" width="16" height="7" rx="2" />
      <path d="M7 17v3h10v-3" />
      <path d="M9 13h6" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 4a8 8 0 1 0 0 16h1a2 2 0 1 0 0-4h-1a4 4 0 0 1 0-8" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="14" cy="7.5" r="1" />
      <circle cx="16.5" cy="10" r="1" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4" />
      <path d="M4 9h16" />
    </svg>
  ),
};

function AdminDashboard() {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  // Settings Edit Form States
  const [maxFileSizeBytes, setMaxFileSizeBytes] = useState('');
  const [allowedMimeTypes, setAllowedMimeTypes] = useState('');
  const [uploadDir, setUploadDir] = useState('');
  const [corsOrigin, setCorsOrigin] = useState('');
  const [aiServiceUrl, setAiServiceUrl] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Upload Search/Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const loadData = async () => {
    setDataLoading(true);
    setError('');
    setSettingsSuccess('');
    try {
      if (activeTab === 'overview') {
        const res = await adminService.getStats();
        setStats(res);
      } else if (activeTab === 'uploads') {
        const res = await adminService.getUploads();
        setUploads(res);
      } else if (activeTab === 'users') {
        const res = await adminService.getUsers();
        setUsers(res);
      } else if (activeTab === 'settings') {
        const res = await adminService.getSettings();
        setSettings(res);
        setMaxFileSizeBytes(res.maxFileSizeBytes);
        setAllowedMimeTypes(res.allowedMimeTypes.join(', '));
        setUploadDir(res.uploadDir);
        setCorsOrigin(res.corsOrigin);
        setAiServiceUrl(res.aiServiceUrl);
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin, activeTab]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError('');
    setSettingsSuccess('');
    setSavingSettings(true);

    try {
      const mimeTypesArr = allowedMimeTypes
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean);

      const payload = {
        maxFileSizeBytes: parseInt(maxFileSizeBytes, 10),
        allowedMimeTypes: mimeTypesArr,
        uploadDir,
        corsOrigin,
        aiServiceUrl,
      };

      const updated = await adminService.updateSettings(payload);
      setSettings(updated);
      setSettingsSuccess('Settings updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteUpload = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"? This will permanently delete the record and its file from disk.`)) {
      return;
    }
    setError('');
    try {
      await adminService.deleteUpload(id);
      setUploads((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete upload.');
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Checking access…" />;
  }

  if (!isAdmin) {
    return (
      <div className="admin-page page-content">
        <AdminLogin />
      </div>
    );
  }

  const tabs = ['overview', 'uploads', 'users', 'settings'];

  // Filter uploads locally by search query
  const filteredUploads = uploads.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.fileName.toLowerCase().includes(query) ||
      (u.userEmail && u.userEmail.toLowerCase().includes(query)) ||
      u.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-page page-content">
      <div className="admin-page__header">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">
            Signed in as {user.email}
          </p>
        </div>
        <div className="admin-page__actions">
          <span className="badge badge-green">Live</span>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab${activeTab === tab ? ' admin-tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {settingsSuccess && <p className="admin-success" role="status">{settingsSuccess}</p>}
      {dataLoading && <LoadingSpinner message="Loading…" />}

      {!dataLoading && activeTab === 'overview' && stats && (
        <div className="admin-overview" role="tabpanel">
          <div className="stats-grid">
            {STAT_CONFIG.map(({ key, label, icon }) => (
              <div key={key} className="stat-card card">
                <span className="stat-card__icon" aria-hidden="true">
                  {iconMap[icon]}
                </span>
                <span className="stat-card__value">{stats[key] ?? 0}</span>
                <span className="stat-card__label">{label}</span>
              </div>
            ))}
          </div>
          <p className="admin-meta">Total Registered Users: <strong>{stats.totalUsers ?? 0}</strong></p>
        </div>
      )}

      {!dataLoading && activeTab === 'uploads' && (
        <div className="admin-uploads-tab" role="tabpanel">
          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search uploads by file name, user email, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <div className="admin-uploads card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUploads.length === 0 ? (
                  <tr className="admin-table__empty-row">
                    <td colSpan={6}>No uploads found matching your search.</td>
                  </tr>
                ) : (
                  filteredUploads.map((row) => (
                    <tr key={row.id}>
                      <td className="font-semibold">{row.fileName}</td>
                      <td>{formatFileSize(row.sizeBytes)}</td>
                      <td>{row.userEmail ?? '—'}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>
                        <span className={`badge-status badge-status--${row.status}`}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-action-buttons">
                          {row.fileUrl && (
                            <button
                              type="button"
                              className="btn btn-small btn-secondary"
                              onClick={() => {
                                // Strip out leading "/api" or construct path correctly
                                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                const hostBase = apiBase.replace('/api', '');
                                const fileFullUrl = row.fileUrl.startsWith('http') ? row.fileUrl : `${hostBase}${row.fileUrl.startsWith('/') ? '' : '/'}${row.fileUrl}`;
                                setPreviewImage(fileFullUrl);
                              }}
                            >
                              View
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-small btn-danger"
                            onClick={() => handleDeleteUpload(row.id, row.fileName)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!dataLoading && activeTab === 'users' && (
        <div className="admin-users card" role="tabpanel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr className="admin-table__empty-row">
                  <td colSpan={6}>No users found.</td>
                </tr>
              ) : (
                users.map((row) => (
                  <tr key={row.id}>
                    <td className="font-semibold">{row.fullName}</td>
                    <td>{row.email}</td>
                    <td>
                      <span className={`badge-role badge-role--${row.role}`}>
                        {row.role}
                      </span>
                    </td>
                    <td>{row.isActive ? 'Active' : 'Suspended'}</td>
                    <td>{row.lastLoginAt ? formatDate(row.lastLoginAt) : 'Never'}</td>
                    <td>{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!dataLoading && activeTab === 'settings' && settings && (
        <div className="admin-settings card" role="tabpanel">
          <h2 className="settings-title">App Configuration</h2>
          <form className="admin-settings-form" onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label htmlFor="maxFileSizeInput">Max Upload Size (Bytes)</label>
              <input
                id="maxFileSizeInput"
                type="number"
                value={maxFileSizeBytes}
                onChange={(e) => setMaxFileSizeBytes(e.target.value)}
                required
              />
              <span className="field-help">Current: {formatFileSize(maxFileSizeBytes)}</span>
            </div>

            <div className="form-group">
              <label htmlFor="mimeTypesInput">Allowed MIME Types (Comma separated)</label>
              <input
                id="mimeTypesInput"
                type="text"
                value={allowedMimeTypes}
                onChange={(e) => setAllowedMimeTypes(e.target.value)}
                required
              />
              <span className="field-help">Example: image/jpeg, image/png, image/webp</span>
            </div>

            <div className="form-group">
              <label htmlFor="uploadDirInput">Upload Directory</label>
              <input
                id="uploadDirInput"
                type="text"
                value={uploadDir}
                onChange={(e) => setUploadDir(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="corsOriginInput">CORS Origin</label>
              <input
                id="corsOriginInput"
                type="text"
                value={corsOrigin}
                onChange={(e) => setCorsOrigin(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="aiServiceUrlInput">AI Service URL</label>
              <input
                id="aiServiceUrlInput"
                type="text"
                value={aiServiceUrl}
                onChange={(e) => setAiServiceUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={savingSettings}>
              {savingSettings ? 'Saving Settings…' : 'Save Configuration'}
            </button>
          </form>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Image Preview</h3>
              <button className="close-button" onClick={() => setPreviewImage(null)}>×</button>
            </div>
            <div className="modal-body">
              <img src={previewImage} alt="Uploaded preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
