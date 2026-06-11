import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import './Navbar.css';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

function Navbar({ darkMode, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [languageOpen, setLanguageOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLanguageOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/studio', label: t.studio },
    { path: '/upload', label: t.upload },
    { path: '/editor', label: t.editor },
    { path: '/print-preview', label: t.print },
    { path: '/history', label: t.history },
    { path: '/admin', label: t.admin },
  ];

  const renderLanguageSelector = () => (
    <div className="navbar__language-dropdown">
      <button
        className={`navbar__language-selector ${
          darkMode
            ? 'navbar__language-selector-dark'
            : 'navbar__language-selector-light'
        }`}
        onClick={() => setLanguageOpen(!languageOpen)}
        aria-label="Select language"
        aria-expanded={languageOpen}
      >
        {language === 'en' ? 'English' : 'Hindi'}
        <span className={`dropdown-arrow ${languageOpen ? 'open' : ''}`}>
          v
        </span>
      </button>

      {languageOpen && (
        <div
          className={`navbar__language-menu ${
            darkMode
              ? 'navbar__language-menu-dark'
              : 'navbar__language-menu-light'
          }`}
        >
          <button
            onClick={() => {
              setLanguage('en');
              setLanguageOpen(false);
            }}
          >
            English
          </button>

          <button
            onClick={() => {
              setLanguage('hi');
              setLanguageOpen(false);
            }}
          >
            Hindi
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <motion.div
        className={`navbar__progress-bar ${
          darkMode ? 'navbar__progress-bar-dark' : 'navbar__progress-bar-light'
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
      />

      <header
        className={`navbar ${darkMode ? 'navbar--dark' : 'navbar--light'} ${
          isScrolled ? 'navbar--scrolled' : ''
        }`}
        role="banner"
      >
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand" aria-label="SnapPass AI Home">
            <span className="navbar__logo-icon" aria-hidden="true">
              <svg
                className="navbar__logo-svg"
                viewBox="0 0 44 44"
                role="img"
                focusable="false"
              >
                <defs>
                  <linearGradient
                    id="snap-logo-gradient"
                    x1="7"
                    y1="5"
                    x2="38"
                    y2="39"
                  >
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="48%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
                  <radialGradient id="snap-logo-glow" cx="50%" cy="45%" r="58%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect
                  x="3"
                  y="3"
                  width="38"
                  height="38"
                  rx="13"
                  fill="url(#snap-logo-gradient)"
                />
                <path
                  d="M13 17.5c0-2.2 1.8-4 4-4h10c2.2 0 4 1.8 4 4v9c0 2.2-1.8 4-4 4H17c-2.2 0-4-1.8-4-4v-9Z"
                  fill="rgba(255,255,255,0.92)"
                />
                <circle cx="22" cy="22" r="5.4" fill="#0f172a" opacity="0.88" />
                <circle cx="22" cy="22" r="2.3" fill="#38bdf8" />
                <path
                  d="M31.5 11.5l1.2 2.4 2.6.4-1.9 1.9.5 2.6-2.4-1.2-2.3 1.2.4-2.6-1.8-1.9 2.6-.4 1.1-2.4Z"
                  fill="#ffffff"
                />
                <path
                  d="M11 30.5c4-1.3 7.1-3.9 9.2-7.8M24.2 13.2c2.6 3 5.4 4.9 8.6 5.8"
                  stroke="#facc15"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <rect
                  x="3"
                  y="3"
                  width="38"
                  height="38"
                  rx="13"
                  fill="url(#snap-logo-glow)"
                  opacity="0.35"
                />
              </svg>
            </span>
            <span
              className={`navbar__brand-name ${
                darkMode ? 'navbar__brand-name-dark' : 'navbar__brand-name-light'
              }`}
            >
              SnapPass{' '}
              <span
                className={`navbar__brand-highlight ${
                  darkMode
                    ? 'navbar__brand-highlight-dark'
                    : 'navbar__brand-highlight-light'
                }`}
              >
                AI
              </span>
            </span>
          </Link>

          <nav className="navbar__links" aria-label="Main navigation">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `navbar__link ${path === '/upload' ? 'tour-nav-upload' : ''} ${
                    path === '/studio' ? 'tour-nav-studio' : ''
                  } ${path === '/editor' ? 'tour-nav-editor' : ''} ${
                    path === '/print-preview' ? 'tour-nav-print' : ''
                  } ${darkMode ? 'navbar__link-dark' : 'navbar__link-light'} ${
                    isActive
                      ? darkMode
                        ? 'navbar__link--active-dark'
                        : 'navbar__link--active-light'
                      : ''
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <div className="navbar__desktop-language">
              {renderLanguageSelector()}
            </div>

            <button
              onClick={toggleTheme}
              className={`navbar__theme-toggle ${
                darkMode ? 'navbar__theme-toggle-dark' : 'navbar__theme-toggle-light'
              }`}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/upload"
              className={`navbar__cta hover:no-underline ${
                darkMode ? 'navbar__cta-dark' : 'navbar__cta-light'
              }`}
            >
              {t.getStarted}
            </Link>

            <button
              className={`navbar__hamburger ${
                darkMode ? 'navbar__hamburger-dark' : 'navbar__hamburger-light'
              }`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={`hamburger-icon${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>

        <nav
          className={`navbar__mobile-menu ${menuOpen ? 'active' : ''} ${
            darkMode ? 'navbar__mobile-menu-dark' : 'navbar__mobile-menu-light'
          }`}
          aria-label="Mobile navigation"
        >
          <div className="navbar__mobile-language">{renderLanguageSelector()}</div>

          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `navbar__mobile-link ${
                  darkMode
                    ? 'navbar__mobile-link-dark'
                    : 'navbar__mobile-link-light'
                } ${
                  isActive
                    ? darkMode
                      ? 'navbar__mobile-link--active-dark'
                      : 'navbar__mobile-link--active-light'
                    : ''
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}

export default Navbar;
