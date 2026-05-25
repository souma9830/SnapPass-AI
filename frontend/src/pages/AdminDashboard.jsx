import React, { useState } from 'react';
import './AdminDashboard.css';

/**
 * AdminDashboard — placeholder admin panel.
 * Shows summary stats and a table of recent uploads.
 * Backend integration pending — contributors welcome!
 */
function AdminDashboard({darkMode, toggleTheme}) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Uploads',    value: '—', icon: 'upload' },
    { label: 'Sheets Generated', value: '—', icon: 'print' },
    { label: 'Backgrounds Used', value: '—', icon: 'palette' },
    { label: 'Active Today',     value: '—', icon: 'calendar' },
  ];

  const iconMap = {
    upload: (
      <div className={`svg-style ${darkMode? "svg-style-dark" : ""}`}>  
      <svg  viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 16V5" />
        <circle cx="52" cy="48" r="7" />
        <path d="M8 9l4-4 4 4" />
        <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </svg>
      </div>
    ),
    print: (
      <div className={`svg-style ${darkMode? "svg-style-dark" : ""}`}>  
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 9V4h12v5" />
        <rect x="4" y="10" width="16" height="7" rx="2" />
        <path d="M7 17v3h10v-3" />
        <path d="M9 13h6" />
      </svg>
      </div>
    ),
    palette: (
      <div className={`svg-style ${darkMode? "svg-style-dark" : ""}`}>  
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4a8 8 0 1 0 0 16h1a2 2 0 1 0 0-4h-1a4 4 0 0 1 0-8" />
        <circle cx="7.5" cy="10" r="1" />
        <circle cx="10" cy="7.5" r="1" />
        <circle cx="14" cy="7.5" r="1" />
        <circle cx="16.5" cy="10" r="1" />
      </svg>
      </div>
    ),
    calendar: (
      <div className={`svg-style ${darkMode? "svg-style-dark" : ""}`}>  
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="5" width="16" height="15" rx="3" />
        <path d="M8 3v4M16 3v4" />
        <path d="M4 9h16" />
      </svg>
      </div>
    ),
    chart: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 19h16" />
        <path d="M6 17V9" />
        <path d="M12 17V5" />
        <path d="M18 17v-7" />
      </svg>
    ),
  }; 

  const tabs = ['overview', 'uploads', 'settings'];

  return (
    <div className={`admin-page-toggle  ${darkMode? "admin-page-toggle-dark" : ""}`}>
      <div className='admin-page'>
      <div className={`admin-page__header ${darkMode? "admin-page__header-dark" : ""}`}>
        <div>
          <h1 className={`title ${darkMode? "title-dark" : ""}`}>Admin Dashboard</h1>
          <p className="section-subtitle">App analytics and management panel.</p>
        </div>
        <span className="badge badge-amber">Backend Integration Pending</span>
      </div>

      {/* Tabs */}
      <div className={`admin-tabs ${darkMode? "admin-tabs-dark" : ""}`}>   
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? darkMode ? 'admin-tab--active-dark': 'admin-tab--active-light' : ''}`}
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
                <span className="stat-card__icon" aria-hidden="true">
                  {iconMap[icon]}
                </span>
                <span className="stat-card__value">{value}</span>
                <span className="stat-card__label">{label}</span>
              </div>
            ))}
          </div>

          <div className="admin-placeholder card">
            <p className="admin-placeholder__icon" aria-hidden="true">
              {iconMap.chart}
            </p>
            <p className={`admin-placeholder__title ${darkMode? "admin-placeholder__title-dark": "" }`}>Charts & analytics coming soon</p>
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
          <table className={`admin-table ${darkMode? "admin-table-dark":"" }`}>
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
          <p className={`admin-placeholder__title ${darkMode? "admin-placeholder__title-dark" : ""}`}>Settings panel</p>
          <p className="admin-placeholder__desc">
            Configure AI service URL, max upload size, and supported presets here.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}

export default AdminDashboard;
