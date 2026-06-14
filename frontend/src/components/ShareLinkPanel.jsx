import React, { useEffect, useMemo, useState } from 'react';
import './ShareLinkPanel.css';

// Lightweight temporary share link generator stored in sessionStorage.
export default function ShareLinkPanel({ darkMode, processedUrl, filename }) {
  const [expiry, setExpiry] = useState(10 * 60); // seconds, default 10 minutes
  const [password, setPassword] = useState('');
  const [oneTime, setOneTime] = useState(false);
  const [links, setLinks] = useState(() => {
    try {
      const raw = sessionStorage.getItem('sp_share_links');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('sp_share_links', JSON.stringify(links));
    } catch (e) {
      // ignore storage errors
    }
  }, [links]);

  const expiryOptions = useMemo(
    () => [
      { label: '10 minutes', seconds: 10 * 60 },
      { label: '1 hour', seconds: 60 * 60 },
      { label: '24 hours', seconds: 24 * 60 * 60 },
    ],
    []
  );

  const formatRemaining = (ms) => {
    if (ms <= 0) return 'Expired';
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleGenerate = () => {
    const id = `sp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
    const expiresAt = Date.now() + expiry * 1000;
    const link = `${window.location.origin}/share/${id}`;
    const meta = {
      id,
      link,
      expiresAt,
      password: password || null,
      oneTime: !!oneTime,
      used: false,
      createdAt: Date.now(),
      filename: filename || null,
      processedUrl: processedUrl || null,
    };
    setLinks((s) => [meta, ...s]);
    setPassword('');
    setOneTime(false);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // lightweight toast alternative: brief title change could be added later
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const handleOpen = (item) => {
    // Simulate access: mark used if one-time
    if (item.oneTime && !item.used) {
      setLinks((s) => s.map((l) => (l.id === item.id ? { ...l, used: true } : l)));
    }
    // Open in new tab — target route may not exist (frontend-only feature)
    window.open(item.link, '_blank', 'noopener');
  };

  const handleRevoke = (id) => {
    setLinks((s) => s.filter((l) => l.id !== id));
  };

  return (
    <section className={`share-panel card ${darkMode ? 'share-panel--dark' : ''}`}>
      <h3 className="share-panel__title">Share link</h3>

      <div className="share-panel__row">
        <label className="share-panel__label">Expires</label>
        <select
          value={expiry}
          onChange={(e) => setExpiry(Number(e.target.value))}
          className="share-panel__select"
          aria-label="Select expiry"
        >
          {expiryOptions.map((o) => (
            <option key={o.seconds} value={o.seconds}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="share-panel__row">
        <label className="share-panel__label">Password (optional)</label>
        <input
          className="share-panel__input"
          placeholder="leave empty for no password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="share-panel__row share-panel__row--toggle">
        <label className="share-panel__label">One-time access</label>
        <input
          type="checkbox"
          checked={oneTime}
          onChange={(e) => setOneTime(e.target.checked)}
          aria-label="One time access toggle"
        />
      </div>

      <div className="share-panel__actions">
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          aria-label="Generate share link"
        >
          Generate Link
        </button>
      </div>

      <div className="share-panel__list">
        {links.length === 0 && (
          <div className="share-panel__empty">No active share links</div>
        )}

        {links.map((item) => {
          const remaining = item.expiresAt - now;
          const expired = remaining <= 0;
          const blocked = item.oneTime && item.used;
          return (
            <div key={item.id} className={`share-panel__item ${expired ? 'share-panel__item--expired' : ''}`}>
              <div className="share-panel__meta">
                <div className="share-panel__link" title={item.link}>{item.link}</div>
                <div className="share-panel__small">
                  {item.password ? '🔒 Password protected' : '🔓 No password'} · {item.oneTime ? '1× access' : 'multi'}
                </div>
              </div>
              <div className="share-panel__controls">
                <div className="share-panel__countdown">{formatRemaining(remaining)}</div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleCopy(item.link)}
                  disabled={expired}
                >
                  Copy
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleOpen(item)}
                  disabled={expired || blocked}
                >
                  Open
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRevoke(item.id)}
                >
                  Revoke
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
