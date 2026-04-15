import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar — fixed top navigation bar.
 * Shows logo, main nav links, and a mobile hamburger toggle.
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/',             label: 'Home' },
    { path: '/upload',       label: 'Upload' },
    { path: '/editor',       label: 'Editor' },
    { path: '/print-preview', label: 'Print' },
    { path: '/admin',        label: 'Admin' },
  ];

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__brand" aria-label="SnapPass AI Home">
          <span className="navbar__logo-icon" aria-hidden="true">📷</span>
          <span className="navbar__brand-name">
            SnapPass <span className="navbar__brand-highlight">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar__actions">
          <Link to="/upload" className="btn btn-primary navbar__cta">
            Get Started
          </Link>
          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span className={`hamburger-icon${menuOpen ? ' open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <nav className="navbar__mobile-menu" aria-label="Mobile navigation">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
