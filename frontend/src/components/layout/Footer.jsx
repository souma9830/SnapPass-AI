import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ShieldCheck,
  Globe,
  BadgeCheck,
  ArrowRight,
  Share2,
  User,
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
      {/* Decorative top wave */}
      <div
        className={`footer__wave-container ${darkMode ? 'footer__wave-container-dark' : ''
          }`}
      >
        <svg
          className="footer__wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
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
              {language === 'hi' ? 'विश्वव्यापी स्वीकार किया गया' : 'Accepted Worldwide'}
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
              className={`footer__tagline ${darkMode ? 'footer__tagline-dark' : ''
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
              <a href="https://www.linkedin.com/in/soumadeep-s/" className="footer__social-link">
                <Globe size={18} />
              </a>

              <a href="https://www.facebook.com/soumadeep9830" className="footer__social-link">
                <Share2 size={18} />
              </a>

              <a href="https://github.com/souma9830" className="footer__social-link">
                <User size={18} />
              </a>
            </div>
          </div>

          {/* LINKS */}
          <div className="footer__columns">
            {/* PRODUCT */}
            <div className="footer__column">
              <h4
                className={`footer__heading ${darkMode ? 'footer__heading-dark' : ''
                  }`}
              >
                {t.product}
              </h4>

              <Link
                to="/upload"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''
                  }`}
              >
                {t.uploadPhotoFooter}
              </Link>

              <Link
                to="/editor"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''
                  }`}
              >
                {t.aiEditor}
              </Link>

              <Link
                to="/print-preview"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''
                  }`}
              >
                {t.printPreview}
              </Link>

              <Link
                to="/diagnostics"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''
                  }`}
              >
                Diagnostics
              </Link>
            </div>

            {/* COMPANY */}
            <div className="footer__column">
              <h4
                className={`footer__heading ${darkMode ? 'footer__heading-dark' : ''
                  }`}
              >
                {t.company}
              </h4>

              <Link
                to="/privacy"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''
                  }`}
              >
                {t.privacyPolicy}
              </Link>

              <Link
                to="/terms"
                className={`footer__item ${darkMode ? 'footer__item-dark' : ''
                  }`}
              >
                {t.termsConditions}
              </Link>
            </div>

            {/* CONTACT */}
            <div className="footer__column">
              <h4
                className={`footer__heading ${darkMode ? 'footer__heading-dark' : ''
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
