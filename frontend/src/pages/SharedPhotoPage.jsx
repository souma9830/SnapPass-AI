import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  Clock,
  Home,
  Eye,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import { getShareMeta, accessShareLink } from '../services/shareService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import './SharedPhotoPage.css';

const SharedPhotoPage = ({ darkMode }) => {
  const { shareId } = useParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);

  useEffect(() => {
    fetchMetadata();
  }, [shareId]);

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getShareMeta(shareId);
      if (data.success) {
        setMeta(data.data);
        if (!data.data.requiresPassword && !data.data.isExpired) {
          // Fetch image directly if no password required
          await unlockImage('');
        }
      } else {
        setError(data.message || 'Share link not found or expired.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'This share link has expired or is invalid.'
      );
    } finally {
      setLoading(false);
    }
  };

  const unlockImage = async (passVal) => {
    setSubmittingPassword(true);
    setPasswordError('');
    try {
      const data = await accessShareLink(shareId, passVal);
      if (data.success) {
        setImageData(data.data.imageData);
        setImageMeta(data.data);
        showToast('Image unlocked successfully.', 'success');
      } else {
        setPasswordError(data.message || 'Failed to unlock image.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Incorrect password or link expired.';
      setPasswordError(msg);
      if (err.response?.status === 410) {
        setMeta((prev) => ({ ...prev, isExpired: true }));
      }
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setPasswordError('Please enter password.');
      return;
    }
    unlockImage(password);
  };

  const handleDownload = () => {
    if (!imageData) return;
    const a = document.createElement('a');
    a.href = imageData;
    a.download = imageMeta?.filename || `shared-photo-${shareId}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Photo download started!', 'success');
  };

  if (loading) {
    return (
      <div className="shared-photo-page">
        <LoadingSpinner fullPage delayMs={0} />
      </div>
    );
  }

  // Case 1: Error or Expired / Invalidated Link
  if (error || meta?.isExpired) {
    return (
      <div className="shared-photo-page">
        <div className="shared-photo-card">
          <div className="shared-photo-icon-badge expired">
            <AlertTriangle size={32} />
          </div>
          <h2 className="shared-photo-title">Link Expired or Self-Destructed</h2>
          <p className="shared-photo-subtitle">
            {meta?.message || error || 'This sensitive image share link has expired or has already been viewed and automatically invalidated for your privacy.'}
          </p>

          <div className="shared-photo-actions">
            <Link to="/" className="shared-photo-btn primary">
              <Home size={18} />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Password Required
  if (meta?.requiresPassword && !imageData) {
    return (
      <div className="shared-photo-page">
        <div className="shared-photo-card">
          <div className="shared-photo-icon-badge lock">
            <Lock size={32} />
          </div>
          <h2 className="shared-photo-title">Password Protected Image</h2>
          <p className="shared-photo-subtitle">
            The sender has protected this sensitive photo with a password. Please enter the password to view.
          </p>

          <form onSubmit={handlePasswordSubmit} className="shared-photo-pass-form">
            <div className="share-field-group">
              <input
                type="password"
                className="share-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            {passwordError && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              className="shared-photo-btn primary"
              disabled={submittingPassword}
              style={{ width: '100%' }}
            >
              <KeyRound size={18} />
              {submittingPassword ? 'Unlocking...' : 'Unlock Shared Photo'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Case 3: Image Unlocked & Displayed
  return (
    <div className="shared-photo-page">
      <div className="shared-photo-card">
        <div className="shared-photo-icon-badge shield">
          <ShieldCheck size={32} />
        </div>

        <h2 className="shared-photo-title">
          {meta?.title || 'Shared Sensitive Image'}
        </h2>

        <div className="shared-photo-meta-tags">
          <span className="share-badge share-badge-expiration">
            <Clock size={12} /> Expiring: {new Date(meta?.expiresAt).toLocaleString()}
          </span>
          {meta?.isOneTime && (
            <span className="share-badge share-badge-onetime">
              ⚡ Self-Destructs After 1 View
            </span>
          )}
        </div>

        {imageMeta?.isOneTime && (
          <p style={{ color: '#d97706', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>
            ⚠️ Notice: This image was shared as a one-time view link. Refreshing or leaving this page will permanently invalidate access.
          </p>
        )}

        <div className="shared-photo-display-container">
          {imageData ? (
            <img
              src={imageData}
              alt="Shared Sensitive Content"
              className="shared-photo-img"
            />
          ) : (
            <LoadingSpinner delayMs={0} />
          )}
        </div>

        <div className="shared-photo-actions">
          <button
            type="button"
            className="shared-photo-btn primary"
            onClick={handleDownload}
          >
            <Download size={18} />
            Download Photo
          </button>

          <Link to="/" className="shared-photo-btn secondary">
            <Home size={18} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedPhotoPage;
