import React, { useState, useMemo } from 'react';
import './CompliancePanel.css';

const statusToBadge = (status) => {
  if (status === 'pass') return { label: 'PASS', cls: 'badge-pass' };
  if (status === 'warn') return { label: 'WARN', cls: 'badge-warn' };
  if (status === 'fail') return { label: 'FAIL', cls: 'badge-fail' };
  return { label: String(status || '—').toUpperCase(), cls: 'badge-neutral' };
};

const DEFAULT_CHECKS = [
  {
    id: 'face',
    title: 'Face Detection',
    detail: 'Verify face is visible',
    status: 'warn',
  },
  {
    id: 'background',
    title: 'Background Uniformity',
    detail: 'Plain light background check',
    status: 'warn',
  },
  {
    id: 'tilt',
    title: 'Face Angle & Tilt',
    detail: 'Check head levelness',
    status: 'warn',
  },
];

function CompliancePanel({
  compliance,
  loading,
  error,
  onAutoCorrect,
  darkMode,
}) {
  const [expanded, setExpanded] = useState(true); // expanded by default to draw immediate attention
  const items = compliance?.items || DEFAULT_CHECKS;
  const hardFail = Boolean(compliance?.hard_fail);

  const headerText = useMemo(() => {
    if (loading) return 'Checking compliance...';
    if (error) return 'Compliance check unavailable';
    if (!compliance) return 'Check results pending';
    return hardFail ? 'Not ICAO-compliant yet' : 'Looks compliant (pre-check)';
  }, [loading, error, compliance, hardFail]);

  return (
    <aside
      className={`compliance-panel ${darkMode ? 'compliance-panel-dark' : ''}`}
      aria-label="Passport photo compliance checklist"
    >
      <button
        className="compliance-panel__header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          className="compliance-panel__title"
          style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}
        >
          Compliance Inspector
        </div>
        <span
          style={{
            fontSize: '12px',
            opacity: 0.6,
            color: darkMode ? '#9ca3af' : '#4b5563',
          }}
        >
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      <div
        className={`compliance-panel__summary ${hardFail ? 'summary-fail' : 'summary-ok'}`}
        style={{ marginTop: '0.25rem' }}
      >
        {headerText}
      </div>

      {expanded && (
        <>
          {loading && (
            <div
              className="compliance-panel__loading"
              style={{ margin: '0.5rem 0' }}
            >
              Running real-time checks...
            </div>
          )}

          {!!error && !loading && (
            <div
              className="compliance-panel__error"
              style={{ margin: '0.5rem 0' }}
            >
              <div className="compliance-panel__error-title">
                Could not run compliance check
              </div>
              <div className="compliance-panel__error-detail">{error}</div>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div
              className="compliance-panel__list"
              role="list"
              style={{ marginTop: '0.5rem' }}
            >
              {items.map((it) => {
                const badge = statusToBadge(it.status);
                const showFixButton = it.auto_fixable && it.status !== 'pass';

                return (
                  <div
                    className="compliance-panel__item"
                    key={it.id}
                    role="listitem"
                    style={{
                      backgroundColor: darkMode
                        ? 'rgba(31, 41, 55, 0.5)'
                        : 'rgba(241, 245, 249, 0.55)',
                      borderColor: darkMode
                        ? 'rgba(75, 85, 99, 0.4)'
                        : 'rgba(226, 232, 240, 0.8)',
                    }}
                  >
                    <div
                      className="compliance-panel__item-left"
                      style={{ flex: 1 }}
                    >
                      <div
                        className="compliance-panel__item-title"
                        style={{ color: darkMode ? '#f9fafb' : '#0f172a' }}
                      >
                        {it.title}
                      </div>
                      <div
                        className="compliance-panel__item-detail"
                        style={{ color: darkMode ? '#9ca3af' : '#64748b' }}
                      >
                        {it.detail}
                      </div>
                      {it.suggestion && it.status !== 'pass' && (
                        <div
                          className="compliance-panel__item-suggestion"
                          style={{
                            marginTop: '4px',
                            fontSize: '0.78rem',
                            color: '#d97706',
                            fontStyle: 'italic',
                          }}
                        >
                          💡 {it.suggestion}
                        </div>
                      )}
                      {showFixButton && (
                        <button
                          className="compliance-panel__fix-btn"
                          onClick={() => onAutoCorrect && onAutoCorrect(it.id)}
                          style={{
                            marginTop: '8px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: '600',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          }}
                        >
                          Auto-Fix ✨
                        </button>
                      )}
                    </div>
                    <div className={`compliance-panel__badge ${badge.cls}`}>
                      {badge.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            className="compliance-panel__note"
            style={{
              marginTop: '0.75rem',
              color: darkMode ? '#9ca3af' : '#64748b',
            }}
          >
            Pre-checks are heuristic. Use final printed result per local
            passport regulations.
          </div>
        </>
      )}
    </aside>
  );
}

export default CompliancePanel;
