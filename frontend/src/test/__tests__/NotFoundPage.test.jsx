import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage';

const renderNotFoundPage = (darkMode = false) => {
  return render(
    <BrowserRouter>
      <NotFoundPage darkMode={darkMode} />
    </BrowserRouter>
  );
};

describe('NotFoundPage', () => {
  it('renders 404 status code', () => {
    renderNotFoundPage();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the not-found heading', () => {
    renderNotFoundPage();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders a go home link', () => {
    renderNotFoundPage();
    const homeLink = screen.getByText('Go Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders a go back button', () => {
    renderNotFoundPage();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('renders suggestion links', () => {
    renderNotFoundPage();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Upload Photo')).toBeInTheDocument();
    expect(screen.getByText('Photo Studio')).toBeInTheDocument();
  });

  it('applies dark mode class when darkMode is true', () => {
    const { container } = renderNotFoundPage(true);
    expect(container.querySelector('.not-found-page-dark')).toBeInTheDocument();
  });

  it('renders SEOMetadata with correct title', () => {
    renderNotFoundPage();
    expect(document.title).toContain('Page Not Found');
  });

  it('displays the current pathname', () => {
    window.history.pushState({}, '', '/nonexistent-route');
    renderNotFoundPage();
    expect(screen.getByText('/nonexistent-route')).toBeInTheDocument();
  });

  it('renders suggestion section with Try These Pages heading', () => {
    renderNotFoundPage();
    expect(screen.getByText('Try These Pages')).toBeInTheDocument();
  });
});
