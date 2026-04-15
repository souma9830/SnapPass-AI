import React, { useState } from 'react';
import './AdminDashboard.css';

/**
 * AdminDashboard — placeholder admin panel.
 * Shows summary stats and a table of recent uploads.
 * Backend integration pending — contributors welcome!
 */
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Uploads',    value: '—', icon: '📤' },
    { label: 'Sheets Generated', value: '—', icon: '🖨️' },
    { label: 'Backgrounds Used', value: '—', icon: '🎨' },
    { label: 'Active Today',     value: '—', icon: '📅' },
  ];

  const tabs = ['overview', 'uploads', 'settings'];

  return (
    <div className="admin-page page-content">
      <div className="admin-page__header">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">App analytics and management panel.</p>
        </div>
        <span className="badge badge-amber">Backend Integration Pending</span>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`admin-tab${activeTab === tab ? ' admin-tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-overview" role="tabpanel">
          <div className="stats-grid">
            {stats.map(({ label, value, icon }) => (
              <div key={label} className="stat-card card">
                <span className="stat-card__icon">{icon}</span>
                <span className="stat-card__value">{value}</span>
                <span className="stat-card__label">{label}</span>
              </div>
            ))}
          </div>

          <div className="admin-placeholder card">
            <p className="admin-placeholder__icon">📊</p>
            <p className="admin-placeholder__title">Charts & analytics coming soon</p>
            <p className="admin-placeholder__desc">
              Connect the Express backend + MongoDB to populate this dashboard.
              See <code>backend/src/controllers/</code> to get started.
            </p>
          </div>
        </div>
      )}

      {/* Uploads Tab */}
      {activeTab === 'uploads' && (
        <div className="admin-uploads card" role="tabpanel">
          <table className="admin-table">
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
              <tr className="admin-table__empty-row">
                <td colSpan={6}>No uploads yet — connect the backend to see data here.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="admin-settings card" role="tabpanel">
          <p className="admin-placeholder__title">Settings panel</p>
          <p className="admin-placeholder__desc">
            Configure AI service URL, max upload size, and supported presets here.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
