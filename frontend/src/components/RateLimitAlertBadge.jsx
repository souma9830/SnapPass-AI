import React from 'react';
import './RateLimitAlertBadge.css';

export default function RateLimitAlertBadge({ alert }) {
  if (!alert) return null;

  const isCritical = alert.severity === 'CRITICAL';

  return (
    <div
      className={`rate-limit-badge ${isCritical ? 'critical' : 'warning'}`}
      data-testid="rate-limit-alert-badge"
      role="alert"
    >
      <span className="alert-icon">{isCritical ? '⚠️' : 'ℹ️'}</span>
      <span className="alert-msg">{alert.message}</span>
      <span className="alert-time">
        {new Date(alert.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}
