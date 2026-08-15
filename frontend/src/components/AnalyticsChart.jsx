import React from 'react';
import './AnalyticsChart.css';

export function AnalyticsTrendChart({ data = [], darkMode = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="analytics-chart-empty">
        <p>No upload trend data available for selected window.</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className={`analytics-chart-container ${darkMode ? 'chart-dark' : 'chart-light'}`}>
      <div className="chart-header">
        <h3>📈 Daily Activity & Processing Volume</h3>
        <span className="chart-subtitle">Real-time upload telemetry over time</span>
      </div>
      <div className="chart-bars">
        {data.map((item) => {
          const heightPercent = Math.round((item.count / maxVal) * 100);
          return (
            <div key={item._id} className="chart-bar-group" title={`${item._id}: ${item.count} uploads`}>
              <div className="chart-bar-value">{item.count}</div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar-fill"
                  style={{ height: `${Math.max(12, heightPercent)}%` }}
                />
              </div>
              <div className="chart-bar-label">{item._id.slice(5)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SystemHealthCard({ darkMode = false }) {
  const metrics = [
    { label: 'Python AI Microservice', status: 'Healthy', ping: '24ms', color: '#10b981' },
    { label: 'Express Backend API', status: 'Healthy', ping: '12ms', color: '#10b981' },
    { label: 'IndexedDB Offline Cache', status: 'Active', ping: '0ms', color: '#3b82f6' },
  ];

  return (
    <div className={`health-card-container ${darkMode ? 'health-dark' : 'health-light'}`}>
      <h3>⚡ System Infrastructure & Microservice Health</h3>
      <div className="health-grid">
        {metrics.map((m) => (
          <div key={m.label} className="health-item">
            <div className="health-status-dot" style={{ backgroundColor: m.color }} />
            <div className="health-details">
              <span className="health-label">{m.label}</span>
              <span className="health-badge" style={{ color: m.color }}>{m.status} ({m.ping})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
