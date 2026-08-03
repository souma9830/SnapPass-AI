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

describe('Footer mobile layout (issue 1014)', () => {
  it('renders brand block, link columns, and bottom bar', () => {
    const { container } = renderFooter();
    expect(container.querySelector('.footer__brand')).not.toBeNull();
    expect(container.querySelector('.footer__columns')).not.toBeNull();
    expect(container.querySelectorAll('.footer__column').length).toBe(3);
    expect(container.querySelector('.footer__bottom')).not.toBeNull();
  });

  it('renders Product, Company, and Contact columns', () => {
    const { container } = renderFooter();
    const headings = Array.from(container.querySelectorAll('.footer__heading')).map(
      (el) => el.textContent
    );
    expect(headings.join(' ')).toMatch(/Product/);
    expect(headings.join(' ')).toMatch(/Company/);
    expect(headings.join(' ')).toMatch(/Contact/);
  });

  it('renders the mobile responsive stylesheet', () => {
    const { container } = renderFooter();
    expect(container.querySelector('.footer')).not.toBeNull();
  });
});
