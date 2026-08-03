import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../../context/LanguageContext';
import CountryRequirementsExplorer from '../../components/HomePage/CountryRequirementsExplorer';

function renderExplorer(props = {}) {
  return render(
    <LanguageProvider>
      <CountryRequirementsExplorer {...props} />
    </LanguageProvider>
  );
}

describe('CountryRequirementsExplorer Component', () => {
  test('renders title, subtitle and search input', () => {
    renderExplorer();
    expect(
      screen.getByRole('heading', { name: /Explore Global Passport Requirements/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search a country or region/i)
    ).toBeInTheDocument();
  });

  test('shows details for the first country by default', () => {
    renderExplorer();
    expect(screen.getByRole('heading', { name: 'India / UK' })).toBeInTheDocument();
    expect(screen.getByText(/35 × 45 mm \(300 DPI\)/i)).toBeInTheDocument();
    expect(screen.getByText('Glasses & Accessories')).toBeInTheDocument();
    expect(screen.getByText(/No tinted glasses/i)).toBeInTheDocument();
  });

  test('filters countries by search query', () => {
    renderExplorer();
    const searchInput = screen.getByPlaceholderText(/Search a country or region/i);

    fireEvent.change(searchInput, { target: { value: 'Japan' } });
    expect(screen.getByRole('button', { name: /Japan/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Canada/i })).not.toBeInTheDocument();
  });

  test('selecting a country updates the details card', async () => {
    renderExplorer();
    fireEvent.click(screen.getByRole('button', { name: /Canada/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Canada' })).toBeInTheDocument();
    });
    expect(screen.getByText(/50 × 70 mm \(300 DPI\)/i)).toBeInTheDocument();
  });

  test('shows empty state when no country matches', () => {
    renderExplorer();
    fireEvent.change(screen.getByPlaceholderText(/Search a country or region/i), {
      target: { value: 'Atlantis' },
    });
    expect(screen.getByText(/No matching countries found/i)).toBeInTheDocument();
  });

  test('renders region tags and flag emoji for countries', () => {
    renderExplorer();
    expect(screen.getByRole('button', { name: /Singapore/i })).toBeInTheDocument();
    expect(screen.getByText('🇸🇬')).toBeInTheDocument();
  });
});
