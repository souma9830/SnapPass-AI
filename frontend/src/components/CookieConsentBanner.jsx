import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import './CookieConsentBanner.css';

export const COOKIE_CONSENT_STORAGE_KEY = 'snappass_cookie_consent';

const defaultPrefs = { essential: true, functional: false, analytics: false };

export const readConsent = () => {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...defaultPrefs, ...parsed };
  } catch {
    return null;
  }
};

export const persistConsent = (prefs) => {
  try {
    localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify({ ...defaultPrefs, ...prefs })
    );
  } catch {
    // silent
  }
};

const CookieConsentBanner = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({ ...defaultPrefs });
  const containerRef = useFocusTrap(visible);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  const close = (choices) => {
    persistConsent(choices);
    setVisible(false);
  };

  const acceptAll = () =>
    close({ essential: true, functional: true, analytics: true });
  const rejectNonEssential = () =>
    close({ essential: true, functional: false, analytics: false });
  const savePreferences = () => close(prefs);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(prefs);
    }
  };

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!visible) return null;

  const preferenceCategories = [
    { key: 'essential', label: t.cookiesEssential, text: t.cookiesEssentialText, disabled: true },
    { key: 'functional', label: t.cookiesFunctional, text: t.cookiesFunctionalText },
    { key: 'analytics', label: t.cookiesAnalytics, text: t.cookiesAnalyticsText },
  ];

  return (
    <aside
      ref={containerRef}
      className="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-label={t.cookiesTitle}
      onKeyDown={handleKeyDown}
    >
      <div className="cookie-consent__inner">
        <div className="cookie-consent__icon" aria-hidden="true">
          <Cookie size={24} />
        </div>

        <div className="cookie-consent__body">
          <p className="cookie-consent__text">
            {t.cookiesBannerIntro}{' '}
            <Link to="/cookies" className="cookie-consent__link">
              {t.cookiesTitle}
            </Link>
            .
          </p>

          {showPreferences && (
            <div className="cookie-consent__preferences" role="group" aria-label="Cookie preferences">
              {preferenceCategories.map((cat) => (
                <label className="cookie-consent__pref" key={cat.key}>
                  <input
                    type="checkbox"
                    checked={prefs[cat.key]}
                    disabled={cat.disabled}
                    onChange={() => togglePref(cat.key)}
                  />
                  <span className="cookie-consent__pref-text">
                    <strong>{cat.label}</strong>
                    <small>{cat.text}</small>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="cookie-consent__actions">
          <button type="button" className="cookie-consent__btn cookie-consent__btn--primary" onClick={acceptAll}>
            <Check size={16} aria-hidden="true" />
            {t.cookiesAcceptAll}
          </button>
          <button type="button" className="cookie-consent__btn" onClick={rejectNonEssential}>
            {t.cookiesRejectNonEssential}
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--outline"
            onClick={() => setShowPreferences((v) => !v)}
            aria-expanded={showPreferences}
            aria-controls="cookie-consent-preferences"
          >
            {t.cookiesCustomize}
          </button>
          {showPreferences && (
            <button type="button" className="cookie-consent__btn cookie-consent__btn--primary" onClick={savePreferences}>
              {t.cookiesSavePreferences}
            </button>
          )}
        </div>

        <button
          type="button"
          className="cookie-consent__close"
          onClick={rejectNonEssential}
          aria-label="Close"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};

export default CookieConsentBanner;
