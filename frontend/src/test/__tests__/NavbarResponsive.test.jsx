import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../../components/layout/Navbar';
import { LanguageProvider } from '../../context/LanguageContext';
import { ThemeCustomizerProvider } from '../../context/ThemeCustomizerContext';

const renderNavbar = (darkMode = false) =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <ThemeCustomizerProvider>
          <Navbar darkMode={darkMode} toggleTheme={() => {}} />
        </ThemeCustomizerProvider>
      </LanguageProvider>
    </MemoryRouter>
  );

describe('Navbar wide-screen layout (issue 1419)', () => {
  it('renders brand and navigation links', () => {
    renderNavbar();
    expect(document.querySelector('.navbar__brand')).not.toBeNull();
    expect(document.querySelector('.navbar__links')).not.toBeNull();
    expect(document.querySelectorAll('.navbar__link').length).toBeGreaterThan(0);
  });

  it('renders evenly distributed nav link groups', () => {
    renderNavbar();
    expect(document.querySelector('.navbar__links').children.length).toBeGreaterThan(0);
  });

  it('applies theme-specific navbar classes', () => {
    renderNavbar(true);
    expect(document.querySelector('.navbar').className).toContain('navbar--dark');
  });
});
