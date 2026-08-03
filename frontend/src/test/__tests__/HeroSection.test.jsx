import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HeroSection from '../../components/HomePage/HeroSection';
import { LanguageProvider } from '../../context/LanguageContext';

const renderHero = (darkMode) =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <HeroSection darkMode={darkMode} toggleTheme={() => {}} />
      </LanguageProvider>
    </MemoryRouter>
  );

describe('HeroSection CTA button (issue 911)', () => {
  it('renders the upload CTA link', () => {
    const { container } = renderHero(false);
    const cta = container.querySelector('.hero__btn-primary');
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('/upload');
  });

  it('uses the enhanced dark-mode button variant in dark mode', () => {
    const { container } = renderHero(true);
    const cta = container.querySelector('.hero__btn-primary');
    expect(cta.className).toContain('btn-primary-dark');
  });

  it('uses the light button variant in light mode', () => {
    const { container } = renderHero(false);
    const cta = container.querySelector('.hero__btn-primary');
    expect(cta.className).toContain('btn-primary');
    expect(cta.className).not.toContain('btn-primary-dark');
  });
});
