import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StudioAnalyticsDashboard from '../../pages/StudioAnalyticsDashboard';
import { generateMockAnalyticsSummary, exportAnalyticsToCSV } from '../../services/analyticsExportService';

describe('StudioAnalyticsDashboard & Analytics Export', () => {
  it('renders studio analytics dashboard KPI cards', () => {
    render(<StudioAnalyticsDashboard darkMode={false} />);
    expect(screen.getByText(/Studio Business & Profit Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Revenue/i)).toBeInTheDocument();
  });

  it('generates mock analytics summary dataset', () => {
    const summary = generateMockAnalyticsSummary();
    expect(summary.totalPhotosProcessed).toBeGreaterThan(0);
    expect(summary.metrics.length).toBeGreaterThan(0);
  });
});
