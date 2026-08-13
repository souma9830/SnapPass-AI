import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ComplianceBreakdownCard from '../../components/ComplianceBreakdownCard';

describe('ComplianceBreakdownCard Component', () => {
  const mockMetrics = {
    totalScore: 92,
    grade: 'A+',
    status: 'EXCELLENT',
    checks: [
      {
        id: 'head_size',
        title: 'Head Height & Framing',
        score: 95,
        passed: true,
        recommendation: 'Framing complies with ICAO specifications.',
      },
    ],
  };

  it('renders score gauge and check details', () => {
    render(<ComplianceBreakdownCard metrics={mockMetrics} />);
    expect(screen.getByText(/detailed ai inspection rules/i)).toBeInTheDocument();
    expect(screen.getByText('Head Height & Framing')).toBeInTheDocument();
    expect(screen.getByText(/pass \(95%\)/i)).toBeInTheDocument();
  });

  it('triggers onExportReport when export button is clicked', () => {
    const handleExport = jest.fn();
    render(<ComplianceBreakdownCard metrics={mockMetrics} onExportReport={handleExport} />);

    const exportBtn = screen.getByRole('button', { name: /export audit summary/i });
    fireEvent.click(exportBtn);

    expect(handleExport).toHaveBeenCalled();
  });
});

describe('ComplianceBreakdownCard export report callback', () => {
  const metrics = {
    totalScore: 92,
    grade: 'A',
    status: 'COMPLIANT',
    checks: [
      {
        id: 'head_ratio',
        title: 'Head Ratio',
        passed: true,
        score: 95,
        recommendation: 'Keep current framing.',
      },
      {
        id: 'lighting',
        title: 'Lighting',
        passed: false,
        score: 60,
        recommendation: 'Use even lighting.',
      },
    ],
  };

  it('does not render an export button when onExportReport is absent', () => {
    render(<ComplianceBreakdownCard metrics={metrics} />);
    expect(screen.queryByText('Export Report')).toBeNull();
  });

  it('renders an export button when onExportReport is provided', () => {
    render(<ComplianceBreakdownCard metrics={metrics} onExportReport={() => {}} />);
    expect(screen.getByText('Export Report')).toBeDefined();
  });

  it('invokes onExportReport with the serialized metrics payload', () => {
    const onExportReport = vi.fn();
    render(<ComplianceBreakdownCard metrics={metrics} onExportReport={onExportReport} />);

    fireEvent.click(screen.getByText('Export Report'));

    expect(onExportReport).toHaveBeenCalledTimes(1);
    const payload = onExportReport.mock.calls[0][0];
    expect(payload.totalScore).toBe(92);
    expect(payload.grade).toBe('A');
    expect(payload.status).toBe('COMPLIANT');
    expect(payload.checks.length).toBe(2);
    expect(payload.exportedAt).toBeDefined();
  });
});
