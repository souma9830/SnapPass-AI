import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';


const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/upload', label: 'Upload' },
  { to: '/editor', label: 'Editor' },
  { to: '/print-preview', label: 'Print' },
  { to: '/compare-requirements', label: 'Requirements' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
];

export const Navbar = ({ darkMode = false, toggleTheme }) => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const themeClass = darkMode ? 'dark' : 'light';
  const navbarRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  const getNavLinkClass = ({ isActive }) =>
    [
      'navbar__link',
      `navbar__link-${themeClass}`,
      isActive ? `navbar__link--active navbar__link--active-${themeClass}` : '',
    ]
      .filter(Boolean)
      .join(' ');

  const getMobileNavLinkClass = ({ isActive }) =>
    [
      'navbar__mobile-link',
      `navbar__mobile-link-${themeClass}`,
      isActive
        ? `navbar__mobile-link--active navbar__mobile-link--active-${themeClass}`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <nav
      ref={navbarRef}
      className={`navbar navbar--${themeClass}`}
      aria-label="Primary navigation"
    >
      <NavbarAlignmentDetector navbarRef={navbarRef} />
      <div className="navbar__inner">
        <Link className="navbar__brand" to="/" onClick={closeMenu}>
          <span className="navbar__logo-icon" aria-hidden="true">
            📷
          </span>
          <span
            className={`navbar__brand-name navbar__brand-name-${themeClass}`}
          >
            SnapPass{' '}
            <span className={`navbar__brand-highlight-${themeClass}`}>AI</span>
          </span>
        </Link>

        <div className="navbar__links" aria-label="Main sections">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={getNavLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar__actions">
          <select
            className={`navbar__language-selector navbar__language-selector-${themeClass} navbar__desktop-language`}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Select language"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {typeof toggleTheme === 'function' && (
            <button
              type="button"
              className={`navbar__language-selector navbar__language-selector-${themeClass}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          )}

          <Link
            className={`navbar__cta navbar__cta-${themeClass}`}
            to="/upload"
            onClick={closeMenu}
          >
            Start
          </Link>

          <button
            type="button"
            className={`navbar__hamburger navbar__hamburger-${themeClass}`}
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={isMenuOpen}
            aria-controls="primary-mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      <div
        id="primary-mobile-navigation"
        className={`navbar__mobile-menu navbar__mobile-menu-${themeClass} ${
          isMenuOpen ? 'active' : ''
        }`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={getMobileNavLinkClass}
            onClick={closeMenu}
          >
            {item.label}
          </NavLink>
        ))}

        <select
          className={`navbar__language-selector navbar__language-selector-${themeClass}`}
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label="Select language"
        >
          {languages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
