import React, { useState, useEffect } from 'react';
import './ApiDocsPage.css';

function ApiDocsPage() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/docs');
        if (!res.ok) throw new Error('Failed to load');
        const body = await res.json();
        if (!cancelled && body.success) setDocs(body.data);
      } catch (err) {
        if (!cancelled) setError('Could not load API documentation.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDocs();
    return () => { cancelled = true; };
  }, []);

  const methodColors = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    PATCH: '#8b5cf6',
    DELETE: '#ef4444',
  };

  return (
    <div className="api-docs-page">
      <div className="api-docs-container">
        <header className="api-docs-header">
          <h1>API Documentation</h1>
          {docs && <p className="api-docs-version">SnapPass AI API v{docs.version}</p>}
        </header>

        {loading && <div className="api-docs-loading">Loading documentation...</div>}
        {error && <div className="api-docs-error">{error}</div>}

        {docs && (
          <div className="api-docs-content">
            <p className="api-docs-base">Base URL: <code>{docs.baseUrl}</code></p>
            <div className="api-docs-endpoints">
              {docs.endpoints.map((ep, i) => (
                <div key={i} className="api-endpoint">
                  <span
                    className="api-endpoint__method"
                    style={{ background: methodColors[ep.method] || '#6b7280' }}
                  >
                    {ep.method}
                  </span>
                  <code className="api-endpoint__path">{ep.path}</code>
                  <span className="api-endpoint__desc">{ep.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiDocsPage;
