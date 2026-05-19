import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Upload, Sparkles, Printer, Settings } from 'lucide-react';
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
              Your open-source AI passport photo studio.<br />Fast, private, and completely free to use.
            </p>
          </div>

          <div className="footer__nav-group">

            <nav className="footer__links" aria-label="Footer navigation">
              <Link to="/" className="footer__link">
                <Home size={18} className="footer__link-icon" />
                Home
              </Link>
              <Link to="/upload" className="footer__link">
                <Upload size={18} className="footer__link-icon" />
                Upload Photo
              </Link>
              <Link to="/editor" className="footer__link">
                <Sparkles size={18} className="footer__link-icon" />
                AI Editor
              </Link>
              <Link to="/print-preview" className="footer__link">
                <Printer size={18} className="footer__link-icon" />
                Print Preview
              </Link>
              <Link to="/admin" className="footer__link">
                <Settings size={18} className="footer__link-icon" />
                Admin Dashboard
              </Link>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} SnapPass AI. Released under the MIT License.
          </p>
          <p className="footer__status">
            Built with ❤️ for the open-source community
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;