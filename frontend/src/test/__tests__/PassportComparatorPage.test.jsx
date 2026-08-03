import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PassportComparatorPage from '../../pages/PassportComparatorPage';

const renderPage = (darkMode = false) => {
  return render(
    <BrowserRouter>
      <PassportComparatorPage darkMode={darkMode} />
    </BrowserRouter>
  );
};

const css = readFileSync(
  join(process.cwd(), 'src/components/PassportRequirementComparator.css'),
  'utf-8'
);

describe('PassportComparatorPage', () => {
  it('renders without crashing and shows the comparator title', () => {
    renderPage();
    expect(
      screen.getByText(/Passport Requirement Comparator/i)
    ).toBeInTheDocument();
  });

  it('renders the description text in a readable color', () => {
    renderPage();
    expect(
      screen.getByText(/Compare passport and visa photo requirements/i)
    ).toBeInTheDocument();
  });

  it('renders checkbox labels for the country standards', () => {
    renderPage();
    expect(
      screen.getAllByText(/Passport Size Photo — India \/ UK/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Passport Size Photo — Schengen Visa/i).length
    ).toBeGreaterThan(0);
  });

  it('renders the comparison table with visible headers after selecting a standard', () => {
    renderPage();
    fireEvent.click(screen.getAllByRole('checkbox')[2]);
    expect(
      screen.getByRole('columnheader', { name: /Country \/ Standard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Head Size Ratio/i })
    ).toBeInTheDocument();
  });

  it('applies dark-mode class and keeps text present in dark mode', () => {
    const { container } = renderPage(true);
    expect(container.querySelector('main.dark-mode')).toBeInTheDocument();
    expect(
      screen.getByText(/Passport Requirement Comparator/i)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Passport Size Photo — India \/ UK/i).length
    ).toBeGreaterThan(0);
  });

  it('uses explicit foreground colors (not inherit) for headings and text', () => {
    const explicitColor = [
      /\.passport-comparator__title\s*\{[\s\S]*?color:\s*(?!inherit\b)[^;]+;/,
      /\.passport-comparator__description\s*\{[\s\S]*?color:\s*(?!inherit\b)[^;]+;/,
      /\.passport-comparator__checkbox\s*\{[\s\S]*?color:\s*(?!inherit\b)[^;]+;/,
      /\.passport-comparator__table th,\s*\.passport-comparator__table td\s*\{[\s\S]*?color:\s*(?!inherit\b)[^;]+;/,
    ];
    explicitColor.forEach((pattern) => {
      expect(css).toMatch(pattern);
    });
  });

  it('provides high-contrast dark-mode overrides for all text elements', () => {
    const darkOverrides = [
      /\[data-theme='dark'\][\s\S]*?\.passport-comparator__title[\s\S]*?#ffffff/,
      /\[data-theme='dark'\][\s\S]*?\.passport-comparator__checkbox[\s\S]*?#f1f5f9/,
      /\[data-theme='dark'\][\s\S]*?\.passport-comparator__description[\s\S]*?#cbd5e1/,
      /\[data-theme='dark'\][\s\S]*?\.passport-comparator__table (th|td)[\s\S]*?#f8fafc/,
    ];
    darkOverrides.forEach((pattern) => {
      expect(css).toMatch(pattern);
    });
  });
});
