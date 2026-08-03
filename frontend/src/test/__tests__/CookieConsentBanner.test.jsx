import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import CookieConsentBanner, {
  COOKIE_CONSENT_STORAGE_KEY,
  readConsent,
} from '../../components/CookieConsentBanner';

const renderBanner = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <CookieConsentBanner />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('appears on first visit when no consent is stored', () => {
    renderBanner();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Accept All')).toBeInTheDocument();
    expect(screen.getByText('Reject Non-Essential')).toBeInTheDocument();
    expect(screen.getByText('Customize Preferences')).toBeInTheDocument();
  });

  it('includes a link to the cookies policy page', () => {
    renderBanner();
    const link = screen.getByRole('link', { name: 'Cookies Policy' });
    expect(link).toHaveAttribute('href', '/cookies');
  });

  it('does not appear when consent has already been stored', () => {
    localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify({ essential: true, functional: true, analytics: true })
    );
    renderBanner();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('persists preferences and hides when Accept All is clicked', () => {
    renderBanner();
    fireEvent.click(screen.getByText('Accept All'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const consent = readConsent();
    expect(consent.functional).toBe(true);
    expect(consent.analytics).toBe(true);
  });

  it('persists preferences and hides when Reject Non-Essential is clicked', () => {
    renderBanner();
    fireEvent.click(screen.getByText('Reject Non-Essential'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const consent = readConsent();
    expect(consent.functional).toBe(false);
    expect(consent.analytics).toBe(false);
    expect(consent.essential).toBe(true);
  });

  it('shows customizable preferences and saves the selected choices', () => {
    renderBanner();
    fireEvent.click(screen.getByText('Customize Preferences'));
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();

    const analyticsCheckbox = screen.getByRole('checkbox', {
      name: /Analytics cookies/,
    });
    fireEvent.click(analyticsCheckbox);
    fireEvent.click(screen.getByText('Save Preferences'));

    const consent = readConsent();
    expect(consent.analytics).toBe(true);
    expect(consent.functional).toBe(false);
  });
});
