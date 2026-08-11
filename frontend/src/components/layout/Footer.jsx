import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ShieldCheck,
  Globe,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';

import './Footer.css';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

function Footer({ darkMode }) {
  const { language } = useLanguage();
  const t = translations[language];
  const year = new Date().getFullYear();

  return (
    <footer
      className={`footer ${darkMode ? 'footer-dark' : ''}`}
      role="contentinfo"
    >
      <div
        className={`footer__wave-container ${
          darkMode ? 'footer__wave-container-dark' : ''
        }`}
        aria-hidden="true"
      >
        <svg
          className="footer__wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <path
              id="thin-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 58-18 88-18 58 18 88 18"
            />
          </defs>

          <g className="footer__wave-parallax">
            <use
              href="#thin-wave"
              x="48"
              y="0"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1"
              opacity="0.25"
            />

            <use
              href="#thin-wave"
              x="48"
              y="3"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              opacity="0.45"
            />
          </g>
        </svg>
      </div>

      <div className="footer__container">
        {/* CTA SECTION */}
        <div className={`footer__cta ${darkMode ? 'footer__cta-dark' : ''}`}>
          <div className="footer__cta-content">
            <h2 className="footer__cta-title">
              {language === 'hi'
                ? 'कुछ ही सेकंड में पासपोर्ट फोटो बनाएं'
                : 'Create Passport Photos in Seconds'}
            </h2>

            <p className="footer__cta-text">
              {language === 'hi'
                ? 'AI-संचालित बायोमेट्रिक पासपोर्ट फोटो, जो विश्वभर में स्वीकार्य हैं — सुरक्षित, तेज़ और पेशेवर।'
                : 'AI-powered biometric passport photos accepted worldwide — secure, fast, and professional.'}
            </p>
          </div>

          <Link to="/upload" className="footer__cta-button">
            {t.uploadPhotoFooter}
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* TRUST INDICATORS */}
        <div className="footer__trust">
          <div className="footer__trust-item">
            <BadgeCheck size={18} />
            <span>
              {language === 'hi' ? 'बायोमेट्रिक अनुरूप' : 'Biometric Compliant'}
            </span>
          </div>

          <div className="footer__trust-item">
            <ShieldCheck size={18} />
            <span>
              {language === 'hi' ? 'सुरक्षित और निजी' : 'Secure & Private'}
            </span>
          </div>

          <div className="footer__trust-item">
            <Globe size={18} />
            <span>
              {language === 'hi'
                ? 'विश्वव्यापी स्वीकार किया गया'
                : 'Accepted Worldwide'}
            </span>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="footer__top">
          {/* BRAND */}
          <div className="footer__brand">
            <Link
              to="/"
              className={`footer__logo ${darkMode ? 'footer__logo-dark' : ''}`}
              aria-label="Go to homepage"
            >
              <span
                aria-hidden="true"
                className={`footer__logo-icon ${darkMode ? 'footer__logo-icon-dark' : ''}`}
              >
                📷
              </span>
              SnapPass AI
            </Link>

            <p
              className={`footer__tagline ${
                darkMode ? 'footer__tagline-dark' : ''
              }`}
            >
              {t.footerTagline}
            </p>

            <p className="footer__value-text">
              {language === 'hi'
                ? 'स्मार्ट बैकग्राउंड सुधार, बायोमेट्रिक सत्यापन और त्वरित निर्यात के साथ पेशेवर AI पासपोर्ट फोटो।'
                : 'Professional AI passport photos with smart background correction, biometric validation, and instant export.'}
            </p>

            {/* SOCIALS */}
            <div className="footer__socials">
              <a
                href="https://www.linkedin.com/in/soumadeep-s/"
                className="footer__social-link"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/soumadeep9830"
                className="footer__social-link"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z" />
                </svg>
              </a>

              <a
                href="https://github.com/souma9830"
                className="footer__social-link"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* LINKS */}
          <div className="footer__columns">
            {/* PRODUCT */}
            <div className="footer__column">
              <h4
                className={`footer__heading ${
                  darkMode ? 'footer__heading-dark' : ''
                }`}
              >
                {t.product}
              </h4>

              <Link
                to="/upload"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                {t.uploadPhotoFooter}
              </Link>

              <Link
                to="/editor"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                {t.aiEditor}
              </Link>

              <Link
                to="/print-preview"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                {t.printPreview}
              </Link>

              <Link
                to="/diagnostics"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                Diagnostics
              </Link>
            </div>

            {/* COMPANY */}
            <div className="footer__column">
              <h4
                className={`footer__heading ${
                  darkMode ? 'footer__heading-dark' : ''
                }`}
              >
                {t.company}
              </h4>

              <Link
                to="/privacy"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                {t.privacyPolicy}
              </Link>

              <Link
                to="/terms"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                {t.termsConditions}
              </Link>

              <Link
                to="/cookies"
                className={`footer__item ${
                  darkMode ? 'footer__item-dark' : ''
                }`}
              >
                Cookies Policy
              </Link>

              <button
                type="button"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''}`}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
              >
                Cookie Settings 🍪
              </button>
            </div>

            {/* CONTACT */}
            <div className="footer__column">
              <h4
                className={`footer__heading ${
                  darkMode ? 'footer__heading-dark' : ''
                }`}
              >
                {t.contact}
              </h4>

              <div className="footer__contact">
                <Mail size={16} />
                <a href="mailto:support@snappassai.com">
                  support@snappassai.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} SnapPass AI. {t.footerRights}
          </p>

          <p className="footer__status">{t.footerStatus}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
