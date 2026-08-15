import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import IcaoReportExportModal from '../../components/IcaoReportExportModal';

describe('IcaoReportExportModal component', () => {
  it('does not render when isOpen is false', () => {
    render(<IcaoReportExportModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByTestId('icao-report-modal')).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(<IcaoReportExportModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByTestId('icao-report-modal')).toBeDefined();
    expect(screen.getByText('Export ICAO 9303 Audit Certificate')).toBeDefined();
  });
});
