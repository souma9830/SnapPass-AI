import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../translations/translations';

/**
 * AdminDashboard — placeholder admin panel.
 * Shows summary stats and a table of recent uploads.
 * Backend integration pending — contributors welcome!
 */
function AdminDashboard() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        // Future Scope: Integrate IndexedDB sync fallback if network is offline
        const res = await fetch('/api/analytics/stats');
        if (!res.ok) throw new Error('Failed to fetch');
        const body = await res.json();
        if (!cancelled && body.success) setAnalytics(body.data);
      } catch (err) {
        if (!cancelled) setError('Could not load analytics. Ensure the server is running.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const stats = analytics ? [
    { label: t.totalUploads, value: analytics.stats.totalUploads, icon: 'upload' },
    { label: t.sheetsGenerated, value: analytics.stats.totalSheets, icon: 'print' },
    { label: 'Processed Images', value: analytics.stats.totalProcessed, icon: 'palette' },
    { label: t.activeToday, value: analytics.stats.todayUploads, icon: 'calendar' },
  ] : [
    { label: t.totalUploads, value: loading ? '...' : '\u2014', icon: 'upload' },
    { label: t.sheetsGenerated, value: loading ? '...' : '\u2014', icon: 'print' },
    { label: 'Processed Images', value: loading ? '...' : '\u2014', icon: 'palette' },
    { label: t.activeToday, value: loading ? '...' : '\u2014', icon: 'calendar' },
  ];

  const iconMap = {
    upload: (
      <div className={`svg-style ${darkMode ? 'svg-style-dark' : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 16V5" />
          <circle cx="12" cy="12" r="7" />
          <path d="M8 9l4-4 4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      </div>
    ),
    print: (
      <div className={`svg-style ${darkMode ? 'svg-style-dark' : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9V4h12v5" />
          <rect x="4" y="10" width="16" height="7" rx="2" />
          <path d="M7 17v3h10v-3" />
          <path d="M9 13h6" />
        </svg>
      </div>
    ),
    palette: (
      <div className={`svg-style ${darkMode ? 'svg-style-dark' : ''}`}>
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
      <div className={`svg-style ${darkMode ? 'svg-style-dark' : ''}`}>
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

  const tabs = [
    { key: 'overview', label: t.overview },
    { key: 'uploads', label: t.uploadsTab },
    { key: 'settings', label: t.settings },
  ];

  return (
    <div
      className={`admin-page-toggle  ${darkMode ? 'admin-page-toggle-dark' : ''}`}
    >
      <div className="admin-page">
        <div
          className={`admin-page__header ${darkMode ? 'admin-page__header-dark' : ''}`}
        >
          <div>
            <h1 className={`title ${darkMode ? 'title-dark' : ''}`}>
              {t.adminDashboard}
            </h1>
            <p className="section-subtitle">{t.adminSubtitle}</p>
          </div>
          {loading && <span className="badge badge-blue">Loading...</span>}
          {error && <span className="badge badge-red" title={error}>Error</span>}
          {analytics && <span className="badge badge-green">Live</span>}
        </div>

        <div className={`admin-tabs ${darkMode ? 'admin-tabs-dark' : ''}`}>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              className={`admin-tab ${activeTab === key ? (darkMode ? 'admin-tab--active-dark' : 'admin-tab--active-light') : ''}`}
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

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

            {error && (
              <div className="admin-error card">
                <p>{error}</p>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}

            {!analytics && !loading && !error && (
              <div className="admin-placeholder card">
                <p className="admin-placeholder__icon" aria-hidden="true">
                  {iconMap.chart}
                </p>
                <p className={`admin-placeholder__title ${darkMode ? 'admin-placeholder__title-dark' : ''}`}>{t.analyticsSoon}</p>
                <p className="admin-placeholder__desc">{t.analyticsDesc}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="admin-uploads card" role="tabpanel">
            <table
              className={`admin-table ${darkMode ? 'admin-table-dark' : ''}`}
            >
              <thead>
                <tr>
                  <th>{t.fileName}</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentUploads?.length > 0 ? (
                  analytics.recentUploads.map((u) => (
                    <tr key={u.id}>
                      <td>{u.filename}</td>
                      <td>{new Date(u.date).toLocaleDateString()}</td>
                      <td><span className="badge badge-green">Completed</span></td>
                    </tr>
                  ))
                ) : (
                  <tr className="admin-table__empty-row">
                    <td colSpan={3}>{t.noUploads}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-settings card" role="tabpanel">
            <p
              className={`admin-placeholder__title ${darkMode ? 'admin-placeholder__title-dark' : ''}`}
            >
              {t.settingsPanel}
            </p>
            <p className="admin-placeholder__desc">{t.settingsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
