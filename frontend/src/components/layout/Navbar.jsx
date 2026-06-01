import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import './Navbar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

/**
 * Navbar — fixed top navigation bar.
 * Shows logo, main nav links, and a mobile hamburger toggle.
 */
function Navbar({ darkMode, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/studio', label: t.studio },
    { path: '/upload', label: t.upload },
    { path: '/editor', label: t.editor },
    { path: '/print-preview', label: t.print },
    { path: '/history', label: 'History' },
    { path: '/admin', label: t.admin },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className={`navbar__progress-bar ${
          darkMode ? 'navbar__progress-bar-dark' : 'navbar__progress-bar-light'
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
      />

      <header
        className={`navbar ${darkMode ? 'navbar--dark' : 'navbar--light'}`}
        role="banner"
      >
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__brand" aria-label="SnapPass AI Home">
            <span className="navbar__logo-icon" aria-hidden="true">
              📷
            </span>
            <span
              className={`navbar__brand-name ${darkMode ? 'navbar__brand-name-dark' : 'navbar__brand-name-light'}`}
            >
              SnapPass{' '}
              <span
                className={`navbar__brand-highlight ${darkMode ? 'navbar__brand-highlight-dark' : 'navbar__brand-highlight-light'}`}
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
                  `navbar__link
  ${path === '/upload' ? 'tour-nav-upload' : ''}
  ${path === '/studio' ? 'tour-nav-studio' : ''}
  ${path === '/editor' ? 'tour-nav-editor' : ''}
  ${path === '/print-preview' ? 'tour-nav-print' : ''}
  ${darkMode ? 'navbar__link-dark' : 'navbar__link-light'}
  ${
    isActive
      ? darkMode
        ? ' navbar__mobile-link--active-dark'
        : ' navbar__mobile-link--active-light'
      : ''
  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="navbar__actions">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`navbar__language-selector
               ${
                 darkMode
                   ? 'navbar__language-selector-dark'
                   : 'navbar__language-selector-light'
               }`}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>

            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 ml-auto p-2 hover:no-underline h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-[#a2bece]'}`}
            >
              {darkMode ? <Sun className="text-amber-500" /> : <Moon />}
            </button>

            <Link
              to="/upload"
              className={`navbar__cta hover:no-underline ${darkMode ? 'navbar__cta-dark' : 'navbar__cta-light'}`}
            >
              {t.getStarted}
            </Link>

            {/* Mobile hamburger */}
            <button
              className={`navbar__hamburger ${darkMode ? 'navbar__hamburger-dark' : 'navbar__hamburger-light'}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`hamburger-icon${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <nav
          className={`navbar__mobile-menu ${menuOpen ? 'active' : ''} 
            ${
              darkMode
                ? 'navbar__mobile-menu-dark'
                : 'navbar__mobile-menu-light'
            }
            `}
          aria-label="Mobile navigation"
        >
          <div className="navbar__mobile-language">
            <div className="navbar__desktop-language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`navbar__language-selector ${
                  darkMode
                    ? 'navbar__language-selector-dark'
                    : 'navbar__language-selector-light'
                }`}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>

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
                      ? ' navbar__mobile-link--active-dark'
                      : ' navbar__mobile-link--active-light'
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
