import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsentBanner.css';

const COOKIE_CONSENT_KEY = 'snappass_cookie_consent';

export default function CookieConsentBanner({ darkMode }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference state
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: true,
    functional: true,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences({
          essential: true,
          analytics: Boolean(parsed.analytics),
          functional: Boolean(parsed.functional),
        });
      } catch (_) {}
    }

    const handleOpenSettings = () => {
      setShowModal(true);
      setShowBanner(false);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const saveConsent = (analytics, functional) => {
    const consentObj = {
      essential: true,
      analytics,
      functional,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentObj));
    setPreferences({ essential: true, analytics, functional });
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => saveConsent(true, true);
  const handleRejectNonEssential = () => saveConsent(false, false);
  const handleSavePreferences = () => saveConsent(preferences.analytics, preferences.functional);

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Fixed Bottom Banner */}
      {showBanner && !showModal && (
        <div className={`cookie-banner ${darkMode ? 'dark-mode' : 'light-mode'}`} role="region" aria-label="Cookie Consent Banner">
          <div className="cookie-banner-container">
            <div className="cookie-banner-content">
              <div className="cookie-banner-icon" aria-hidden="true">🍪</div>
              <div className="cookie-banner-text">
                <h3 className="cookie-banner-title">We value your privacy</h3>
                <p className="cookie-banner-description">
                  SnapPass AI uses essential cookies to ensure secure operations, along with optional analytics and functional cookies to enhance your passport photo processing experience. Learn more in our{' '}
                  <Link to="/cookies" className="cookie-link">
                    Cookies Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-customize"
                onClick={() => setShowModal(true)}
              >
                Customize
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-reject"
                onClick={handleRejectNonEssential}
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-accept"
                onClick={handleAcceptAll}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div className="cookie-modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
          <div
            className={`cookie-modal ${darkMode ? 'dark-mode' : 'light-mode'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cookie-modal-header">
              <div className="cookie-modal-header-title">
                <span className="cookie-icon">🍪</span>
                <h2 id="cookie-modal-title">Cookie Preferences</h2>
              </div>
              <button
                type="button"
                className="cookie-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="cookie-modal-body">
              <p className="cookie-modal-intro">
                You can customize your cookie preferences below. Essential cookies are required for site functionality and security, while optional cookies help us improve performance and features. Read our{' '}
                <Link to="/cookies" className="cookie-link" onClick={() => setShowModal(false)}>
                  Cookies Policy
                </Link>{' '}
                for detailed information.
              </p>

              <div className="cookie-options-list">
                {/* Essential Cookies Option */}
                <div className="cookie-option-card">
                  <div className="cookie-option-info">
                    <div className="cookie-option-header">
                      <h4>Essential Cookies</h4>
                      <span className="cookie-badge cookie-badge-required">Always Active</span>
                    </div>
                    <p>
                      Strictly necessary for security, authentication, session state, and core functionality. Cannot be disabled.
                    </p>
                  </div>
                  <div className="cookie-toggle-wrapper">
                    <input type="checkbox" checked disabled id="toggle-essential" />
                    <label htmlFor="toggle-essential" className="cookie-toggle-label disabled" />
                  </div>
                </div>

                {/* Analytics Cookies Option */}
                <div className="cookie-option-card">
                  <div className="cookie-option-info">
                    <div className="cookie-option-header">
                      <h4>Analytics Cookies</h4>
                      <span className="cookie-badge cookie-badge-optional">Optional</span>
                    </div>
                    <p>
                      Help us aggregate anonymous usage statistics, feature engagement, and error logs to optimize photo quality and user flow.
                    </p>
                  </div>
                  <div className="cookie-toggle-wrapper">
                    <input
                      type="checkbox"
                      id="toggle-analytics"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                      }
                    />
                    <label htmlFor="toggle-analytics" className="cookie-toggle-label" />
                  </div>
                </div>

                {/* Functional Cookies Option */}
                <div className="cookie-option-card">
                  <div className="cookie-option-info">
                    <div className="cookie-option-header">
                      <h4>Functional Cookies</h4>
                      <span className="cookie-badge cookie-badge-optional">Optional</span>
                    </div>
                    <p>
                      Remember user preferences such as active theme (dark/light mode), photo preset choices, and local studio settings.
                    </p>
                  </div>
                  <div className="cookie-toggle-wrapper">
                    <input
                      type="checkbox"
                      id="toggle-functional"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, functional: e.target.checked }))
                      }
                    />
                    <label htmlFor="toggle-functional" className="cookie-toggle-label" />
                  </div>
                </div>
              </div>
            </div>

            <div className="cookie-modal-footer">
              <button
                type="button"
                className="cookie-btn cookie-btn-secondary"
                onClick={handleRejectNonEssential}
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-primary"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
