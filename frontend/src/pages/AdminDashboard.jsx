// AdminDashboard.jsx - Refactored version with clean component separation and data handling
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

// Icon components (unchanged)
const IconUpload = ({ darkMode }) => (
  <div className={`svg-style ${darkMode ? "svg-style-dark" : ""}`}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 16V5" />
      <circle cx="52" cy="48" r="7" />
      <path d="M8 9l4-4 4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  </div>
);
const IconPrint = ({ darkMode }) => (
  <div className={`svg-style ${darkMode ? "svg-style-dark" : ""}`}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 9V4h12v5" />
      <rect x="4" y="10" width="16" height="7" rx="2" />
      <path d="M7 17v3h10v-3" />
      <path d="M9 13h6" />
    </svg>
  </div>
);
const IconPalette = ({ darkMode }) => (
  <div className={`svg-style ${darkMode ? "svg-style-dark" : ""}`}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 4a8 8 0 1 0 0 16h1a2 2 0 1 0 0-4h-1a4 4 0 0 1 0-8" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="14" cy="7.5" r="1" />
      <circle cx="16.5" cy="10" r="1" />
    </svg>
  </div>
);
const IconCalendar = ({ darkMode }) => (
  <div className={`svg-style ${darkMode ? "svg-style-dark" : ""}`}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4" />
      <path d="M4 9h16" />
    </svg>
  </div>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 19h16" />
    <path d="M6 17V9" />
    <path d="M12 17V5" />
    <path d="M18 17v-7" />
  </svg>
);

const iconMap = {
  upload: IconUpload,
  print: IconPrint,
  palette: IconPalette,
  calendar: IconCalendar,
  chart: IconChart,
};

const OverviewTab = ({ stats, historyData, darkMode }) => (
  <div className="admin-overview" role="tabpanel">
    <div className="stats-grid">
      {stats.map(({ label, value, icon }) => (
        <div key={label} className="stat-card card">
          <span className="stat-card__icon" aria-hidden="true">
            {React.createElement(iconMap[icon], { darkMode })}
          </span>
          <span className="stat-card__value">{value}</span>
          <span className="stat-card__label">{label}</span>
        </div>
      ))}
    </div>
    <div className="admin-charts card">
      <h3 className={`admin-charts__title ${darkMode ? "admin-charts__title-dark" : ""}`}>Uploads Over Time (Last 7 Days)</h3>
      {historyData && historyData.length > 0 ? (
        <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
          <ResponsiveContainer>
            <LineChart data={historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="_id" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff', 
                  borderColor: darkMode ? '#374151' : '#e5e7eb',
                  color: darkMode ? '#f9fafb' : '#111827'
                }} 
              />
              <Line type="monotone" dataKey="count" name="Total Uploads" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="completed" name="Processed" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="admin-placeholder">
          <p className="admin-placeholder__icon" aria-hidden="true">{React.createElement(iconMap.chart, { darkMode })}</p>
          <p className="admin-placeholder__desc">No upload data available yet.</p>
        </div>
      )}
    </div>
  </div>
);

// Uploads Tab Component
const UploadsTab = ({ uploads, darkMode }) => (
  <div className="admin-uploads card" role="tabpanel">
    <table className={`admin-table ${darkMode ? "admin-table-dark" : ""}`}>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Size</th>
          <th>Preset</th>
          <th>Background</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {uploads && uploads.length > 0 ? (
          uploads.map((file) => (
            <tr key={file.id} className="admin-table__row">
              <td>{file.name}</td>
              <td>{file.size}</td>
              <td>{file.preset}</td>
              <td>{file.background}</td>
              <td>{new Date(file.createdAt).toLocaleDateString()}</td>
              <td>{file.status}</td>
            </tr>
          ))
        ) : (
          <tr className="admin-table__empty-row">
            <td colSpan={6}>No uploads yet — connect the backend to see data here.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// Settings Tab Component
const SettingsTab = ({ settings, setSettings, darkMode }) => {
  const [formData, setFormData] = useState({
    serviceUrl: '',
    maxUploadSize: 10,
    presets: '',
    maintenanceMode: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        serviceUrl: settings.serviceUrl || '',
        maxUploadSize: settings.maxUploadSize || 10,
        presets: settings.presets ? settings.presets.join(', ') : '',
        maintenanceMode: settings.maintenanceMode || false
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const presetsArray = formData.presets.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        ...formData,
        maxUploadSize: Number(formData.maxUploadSize),
        presets: presetsArray
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Settings saved successfully!');
        setSettings(data.settings);
      } else {
        setMessage(data.message || 'Error saving settings.');
      }
    } catch (err) {
      setMessage('Network error while saving.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="admin-settings card" role="tabpanel">
      <h3 className={`admin-settings__title ${darkMode ? "admin-settings__title-dark" : ""}`}>Platform Settings</h3>
      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>AI Service URL</label>
          <input type="text" name="serviceUrl" value={formData.serviceUrl} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Max Upload Size (MB)</label>
          <input type="number" name="maxUploadSize" value={formData.maxUploadSize} onChange={handleChange} min="1" required />
        </div>
        <div className="form-group">
          <label>Supported Presets (comma separated)</label>
          <input type="text" name="presets" value={formData.presets} onChange={handleChange} />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleChange} />
            Enable Maintenance Mode
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isSaving} className="btn-save">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span className="settings-message">{message}</span>}
        </div>
      </form>
    </div>
  );
};

function AdminDashboard({ darkMode }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [statsData, setStatsData] = useState(null);
  const [uploadsData, setUploadsData] = useState([]);
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch stats
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatsData(data.data);
        else setError('Failed to load stats');
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching stats');
      });

    // Fetch recent uploads
    fetch('/api/admin/uploads?limit=10', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUploadsData(data.uploads);
      })
      .catch((err) => console.error('Uploads fetch error', err));

    // Fetch settings
    fetch('/api/admin/settings', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettingsData(data.settings);
      })
      .catch((err) => console.error('Settings fetch error', err));

    setLoading(false);
  }, []);

  const stats = [
    { label: 'Total Uploads', value: loading ? '…' : error ? '—' : statsData?.totalUploads ?? '—', icon: 'upload' },
    { label: 'Sheets Generated', value: loading ? '…' : error ? '—' : statsData?.totalProcessedImages ?? '—', icon: 'print' },
    { label: 'Backgrounds Used', value: '—', icon: 'palette' },
    { label: 'Active Today', value: '—', icon: 'calendar' },
  ];

  const tabs = ['overview', 'uploads', 'settings'];

  return (
    <div className={`admin-page-toggle ${darkMode ? "admin-page-toggle-dark" : ""}`}>
      <div className='admin-page'>
        <div className={`admin-page__header ${darkMode ? "admin-page__header-dark" : ""}`}>
          <div>
            <h1 className={`title ${darkMode ? "title-dark" : ""}`}>Admin Dashboard</h1>
            <p className="section-subtitle">App analytics and management panel.</p>
          </div>
        </div>
        <div className={`admin-tabs ${darkMode ? "admin-tabs-dark" : ""}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? (darkMode ? 'admin-tab--active-dark' : 'admin-tab--active-light') : ''}`}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && <OverviewTab stats={stats} historyData={statsData?.history} darkMode={darkMode} />}
        {activeTab === 'uploads' && <UploadsTab uploads={uploadsData} darkMode={darkMode} />}
        {activeTab === 'settings' && <SettingsTab settings={settingsData} setSettings={setSettingsData} darkMode={darkMode} />}
      </div>
    </div>
  );
}

export default AdminDashboard;
