import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/editor', label: 'Editor' },
    { path: '/print-preview', label: 'Print' },
    { path: '/admin', label: 'Admin' },
  ];

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo-icon">📷</span>

          <span className="navbar__brand-name">
            SnapPass <span className="navbar__brand-highlight">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__links">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="navbar__actions">

          <button 
            className="navbar__theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <Link to="/upload" className="navbar__cta">
            Get Started
          </Link>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}></span>
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'active' : ''}`}>
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}

export default Navbar;