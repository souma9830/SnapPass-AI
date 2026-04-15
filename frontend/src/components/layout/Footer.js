import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer — simple site footer with links and attribution.
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">📷 SnapPass AI</span>
          <p className="footer__tagline">Open-source AI passport photo studio.</p>
        </div>

        <nav className="footer__links" aria-label="Footer navigation">
          <Link to="/"              className="footer__link">Home</Link>
          <Link to="/upload"        className="footer__link">Upload</Link>
          <Link to="/editor"        className="footer__link">Editor</Link>
          <Link to="/print-preview" className="footer__link">Print</Link>
          <Link to="/admin"         className="footer__link">Admin</Link>
        </nav>

        <p className="footer__copy">
          © {year} SnapPass AI — MIT License
        </p>
      </div>
    </footer>
  );
}

export default Footer;
