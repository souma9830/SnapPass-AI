import React from 'react';
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
