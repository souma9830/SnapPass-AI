import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

/**
 * Footer — simple site footer with links and attribution.
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      {/* svg wave */}
      <div className="footer__wave-container">
        <svg className="footer__wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path
              id="thin-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 58-18 88-18 58 18 88 18"
            />
          </defs>
          <g className="footer__wave-parallax">
            <use href="#thin-wave" x="48" y="0" fill="none" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
            <use href="#thin-wave" x="48" y="3" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.6" />
          </g>
        </svg>
      </div>

      <div className="footer__container">

        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">
              <span aria-hidden="true" className="footer__logo-icon">📷</span>
              SnapPass AI
            </span>
            <p className="footer__tagline">
              AI-powered passport photo generation for fast,
              professional and print-ready results in seconds.
            </p>
          </div>

          <div className="footer__columns">

            <div className="footer__column">
              <h4 className="footer__heading">Product</h4>

              <Link to="/upload" className="footer__item">
                Upload Photo
              </Link>

              <Link to="/editor" className="footer__item">
                AI Editor
              </Link>

              <Link to="/print-preview" className="footer__item">
                Print Preview
              </Link>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Company</h4>

              <Link to="/privacy" className="footer__item">
                Privacy Policy
              </Link>

              <Link to="/terms" className="footer__item">
                Terms & Conditions
              </Link>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Contact</h4>

              <div className="footer__contact">
                <Mail size={16} />
                support@snappassai.com
              </div>
            </div>

          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} SnapPass AI. All rights reserved.
          </p>

          <p className="footer__status">
            Designed for fast and professional passport photo generation.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;