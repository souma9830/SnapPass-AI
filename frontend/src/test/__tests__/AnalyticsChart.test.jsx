import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsTrendChart, SystemHealthCard } from '../../components/AnalyticsChart';

describe('Analytics Components', () => {
  it('renders system health card with service statuses', () => {
    render(<SystemHealthCard darkMode={false} />);
    expect(screen.getByText(/System Infrastructure & Microservice Health/i)).toBeTruthy();
    expect(screen.getByText(/Python AI Microservice/i)).toBeTruthy();
  });

  it('renders trend chart with dataset bars', () => {
    const mockData = [
      { _id: '2026-08-07', count: 12 },
      { _id: '2026-08-08', count: 25 },
    ];
    render(<AnalyticsTrendChart data={mockData} darkMode={false} />);
    expect(screen.getByText(/Daily Activity & Processing Volume/i)).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('25')).toBeTruthy();
  });
});
