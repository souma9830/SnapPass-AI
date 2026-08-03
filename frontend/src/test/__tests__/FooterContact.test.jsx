import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from '../../components/layout/Footer';
import { LanguageProvider } from '../../context/LanguageContext';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <Footer darkMode={false} />
      </LanguageProvider>
    </MemoryRouter>
  );

describe('Footer contact alignment (issue 1219)', () => {
  it('wraps the email icon and link in a flex contact container', () => {
    const { container } = renderFooter();
    const contact = container.querySelector('.footer__contact');
    expect(contact).not.toBeNull();
    expect(contact.querySelector('svg')).not.toBeNull();
    expect(contact.querySelector('a[href="mailto:support@snappassai.com"]')).not.toBeNull();
  });

  it('places the mail icon immediately before the email link', () => {
    const { container } = renderFooter();
    const contact = container.querySelector('.footer__contact');
    const children = Array.from(contact.children);
    expect(children[0].tagName).toBe('svg');
    expect(children[1].getAttribute('href')).toBe('mailto:support@snappassai.com');
  });
});
