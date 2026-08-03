import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../../components/layout/Navbar';
import { LanguageProvider } from '../../context/LanguageContext';
import { ThemeCustomizerProvider } from '../../context/ThemeCustomizerContext';

const renderNavbar = (darkMode = false, toggleTheme = () => {}) =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <ThemeCustomizerProvider>
          <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        </ThemeCustomizerProvider>
      </LanguageProvider>
    </MemoryRouter>
  );

describe('Navbar (issue 932)', () => {
  it('renders brand, desktop links, and CTA', () => {
    renderNavbar();
    expect(screen.getByText(/SnapPass/)).not.toBeNull();
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Upload').length).toBeGreaterThan(0);
    expect(screen.getByText('Start')).not.toBeNull();
  });

  it('opens and closes the mobile menu via the hamburger', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(hamburger);
    expect(screen.getByLabelText('Close navigation menu')).not.toBeNull();
    expect(document.querySelector('#primary-mobile-navigation').className).toContain('active');
    fireEvent.click(screen.getByLabelText('Close navigation menu'));
    expect(document.querySelector('#primary-mobile-navigation').className).not.toContain('active');
  });

  it('applies the dark-mode navbar class', () => {
    renderNavbar(true);
    expect(document.querySelector('.navbar').className).toContain('navbar--dark');
  });
});
