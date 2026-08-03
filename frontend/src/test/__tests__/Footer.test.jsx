import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from '../../components/layout/Footer';
import { LanguageProvider } from '../../context/LanguageContext';

const renderFooter = (darkMode = false) =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <Footer darkMode={darkMode} />
      </LanguageProvider>
    </MemoryRouter>
  );

describe('Footer layout (issue 931)', () => {
  it('renders brand, link columns, and bottom bar', () => {
    const { container } = renderFooter();
    expect(container.querySelector('.footer')).not.toBeNull();
    expect(container.querySelector('.footer__container')).not.toBeNull();
    expect(container.querySelector('.footer__top')).not.toBeNull();
    expect(container.querySelectorAll('.footer__column').length).toBe(3);
    expect(container.querySelector('.footer__bottom')).not.toBeNull();
  });

  it('renders copyright and status in the bottom bar', () => {
    const { container } = renderFooter();
    expect(container.querySelector('.footer__copy').textContent).toMatch(/SnapPass AI/);
    expect(container.querySelector('.footer__status')).not.toBeNull();
  });

  it('applies dark mode classes when darkMode is enabled', () => {
    const { container } = renderFooter(true);
    expect(container.querySelector('.footer').className).toContain('footer-dark');
    expect(container.querySelector('.footer__cta').className).toContain('footer__cta-dark');
  });
});
