import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import FAQPage from '../../pages/FAQPage';

const renderFAQPage = (darkMode = false) => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <FAQPage darkMode={darkMode} />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('FAQPage', () => {
  it('renders the FAQ heading', () => {
    renderFAQPage();
    expect(screen.getByRole('heading', { name: 'FAQ' })).toBeInTheDocument();
  });

  it('renders the FAQ subtitle', () => {
    renderFAQPage();
    expect(
      screen.getByText('Frequently asked questions about SnapPass AI')
    ).toBeInTheDocument();
  });

  it('renders all eight FAQ questions', () => {
    renderFAQPage();
    expect(screen.getByText('How do I upload a photo?')).toBeInTheDocument();
    expect(screen.getByText('Does SnapPass AI work offline?')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(8);
  });

  it('opens a collapsed accordion item on click', () => {
    renderFAQPage();
    fireEvent.click(screen.getByText('Does SnapPass AI work offline?'));
    expect(
      screen.getByText(/Offline sync and local draft caching/)
    ).toBeInTheDocument();
  });

  it('applies dark mode class when darkMode is true', () => {
    const { container } = renderFAQPage(true);
    expect(container.querySelector('.faq-page.dark-mode')).toBeInTheDocument();
  });

  it('sets document title via useDocumentMeta', () => {
    renderFAQPage();
    expect(document.title).toContain('FAQ');
  });
});
