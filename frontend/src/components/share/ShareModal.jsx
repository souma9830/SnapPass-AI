import React, { useState } from 'react';
import {
  Lock,
  Clock,
  EyeOff,
  Copy,
  Check,
  X,
  Share2,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { createShareLink } from '../../services/shareService';
import { useToast } from '../../context/ToastContext';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, filename, originalName }) => {
  const toastCtx = useToast();
  const showToast = toastCtx?.showToast || (() => {});

  const [expirationOption, setExpirationOption] = useState('1h');
  const [customMinutes, setCustomMinutes] = useState('30');
  const [isOneTime, setIsOneTime] = useState(false);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateLink = async (e) => {
    e.preventDefault();
    if (!filename) {
      showToast('No photo file available to share.', 'error');
      return;
    }

    if (enablePassword && (!password || password.trim().length === 0)) {
      showToast('Please enter a password or disable password protection.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await createShareLink({
        filename,
        originalName,
        expirationOption,
        expiresInMinutes: expirationOption === 'custom' ? customMinutes : undefined,
        isOneTime,
        password: enablePassword ? password.trim() : '',
        title: title.trim(),
      });

      if (data.success) {
        setShareResult(data.data);
        showToast('Expiring share link generated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to create share link.', 'error');
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Error generating share link.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareResult?.shareUrl) return;
    navigator.clipboard.writeText(shareResult.shareUrl);
    setCopied(true);
    showToast('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    setShareResult(null);
    setCopied(false);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <h3 className="share-modal-title">
            <ShieldCheck className="share-modal-title-icon" size={22} />
            Share Sensitive Photo
          </h3>
          <button
            type="button"
            className="share-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="share-modal-body">
          {!shareResult ? (
            <form onSubmit={handleGenerateLink} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Optional Title */}
              <div className="share-field-group">
                <label className="share-field-label">
                  <Sparkles size={16} /> Link Description / Title (Optional)
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="e.g. Visa Passport Photo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Expiration Select */}
              <div className="share-field-group">
                <label className="share-field-label">
                  <Clock size={16} /> Expiration Duration
                </label>
                <select
                  className="share-select"
                  value={expirationOption}
                  onChange={(e) => setExpirationOption(e.target.value)}
                >
                  <option value="5m">5 Minutes</option>
                  <option value="15m">15 Minutes</option>
                  <option value="1h">1 Hour (Recommended)</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="custom">Custom Minutes</option>
                </select>
              </div>

              {expirationOption === 'custom' && (
                <div className="share-field-group">
                  <label className="share-field-label">Custom Duration (Minutes)</label>
                  <input
                    type="number"
                    className="share-input"
                    min="1"
                    max="43200"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                  />
                </div>
              )}

              {/* One-Time Access Toggle */}
              <div className="share-toggle-card">
                <div className="share-toggle-info">
                  <span className="share-toggle-title">Self-Destruct After 1 View</span>
                  <span className="share-toggle-desc">
                    Link automatically invalidates permanently after the image is viewed once.
                  </span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Password Protection Toggle */}
              <div className="share-toggle-card">
                <div className="share-toggle-info">
                  <span className="share-toggle-title">Password Protection</span>
                  <span className="share-toggle-desc">
                    Require recipient to enter a password before viewing/downloading photo.
                  </span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={enablePassword}
                    onChange={(e) => setEnablePassword(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Password Input */}
              {enablePassword && (
                <div className="share-field-group">
                  <label className="share-field-label">
                    <KeyRound size={16} /> Set Password
                  </label>
                  <div className="share-password-input-wrapper">
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      className="share-input"
                      placeholder="Enter secret password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="share-password-toggle-icon"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                    >
                      {showPasswordText ? <EyeOff size={16} /> : <Lock size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="share-btn-primary"
                disabled={loading}
              >
                <Share2 size={18} />
                {loading ? 'Generating Link...' : 'Generate Secure Link'}
              </button>
            </form>
          ) : (
            <div className="share-result-box">
              <div className="share-result-header">
                <ShieldCheck size={20} />
                Secure Expiring Link Ready!
              </div>

              <div className="share-url-container">
                <input
                  type="text"
                  className="share-url-input"
                  value={shareResult.shareUrl}
                  readOnly
                />
                <button
                  type="button"
                  className="share-copy-btn"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="share-badges-row">
                <span className="share-badge share-badge-expiration">
                  <Clock size={12} /> Expiring: {new Date(shareResult.expiresAt).toLocaleString()}
                </span>
                {shareResult.isOneTime && (
                  <span className="share-badge share-badge-onetime">
                    ⚡ Self-Destructs (1 View)
                  </span>
                )}
                {shareResult.hasPassword && (
                  <span className="share-badge share-badge-password">
                    <Lock size={12} /> Password Protected
                  </span>
                )}
              </div>

              <button
                type="button"
                className="share-btn-primary"
                onClick={handleReset}
                style={{ marginTop: '0.5rem', background: '#64748b' }}
              >
                Create Another Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
