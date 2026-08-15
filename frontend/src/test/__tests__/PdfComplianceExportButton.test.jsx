import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PdfComplianceExportButton from '../../components/PdfComplianceExportButton';

describe('PdfComplianceExportButton', () => {
  it('renders disabled when no compliance result is present', () => {
    render(<PdfComplianceExportButton complianceResult={null} />);
    const btn = screen.getByTestId('pdf-export-button');
    expect(btn).toBeDisabled();
  });

  it('triggers onExport callback when clicked', async () => {
    const handleExport = vi.fn().mockResolvedValue(true);
    const mockCompliance = { overallScore: 90 };

    render(
      <PdfComplianceExportButton
        complianceResult={mockCompliance}
        photoMetadata={{ dimensionsPx: '600x600' }}
        onExport={handleExport}
      />
    );

    const btn = screen.getByTestId('pdf-export-button');
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
