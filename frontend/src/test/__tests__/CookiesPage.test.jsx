import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import CookiesPage from '../../pages/CookiesPage';

const renderCookiesPage = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <CookiesPage />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('CookiesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the cookies policy heading', () => {
    renderCookiesPage();
    expect(
      screen.getByRole('heading', { name: 'Cookies Policy' })
    ).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderCookiesPage();
    expect(
      screen.getByText(
        'How SnapPass AI uses cookies and how you can manage them'
      )
    ).toBeInTheDocument();
  });

  it('explains what cookies are', () => {
    renderCookiesPage();
    expect(
      screen.getByRole('heading', { name: 'What are cookies?' })
    ).toBeInTheDocument();
  });

  it('lists all three cookie categories', () => {
    renderCookiesPage();
    expect(
      screen.getByRole('heading', { name: 'Essential cookies' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Functional cookies' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Analytics cookies' })
    ).toBeInTheDocument();
  });

  it('covers retention and management topics', () => {
    renderCookiesPage();
    expect(
      screen.getByRole('heading', { name: 'Cookie retention' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Managing cookies' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact us' })).toBeInTheDocument();
  });

  it('sets document title via useDocumentMeta', () => {
    renderCookiesPage();
    expect(document.title).toContain('Cookies Policy');
  });
});
