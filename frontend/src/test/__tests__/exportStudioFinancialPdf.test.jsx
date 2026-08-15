import { describe, it, expect, vi } from 'vitest';
import { exportStudioFinancialPdf } from '../../utils/exportStudioFinancialPdf';

vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn().mockImplementation(() => ({
      setFillColor: vi.fn(),
      rect: vi.fn(),
      setFont: vi.fn(),
      setFontSize: vi.fn(),
      setTextColor: vi.fn(),
      text: vi.fn(),
      setLineWidth: vi.fn(),
      setDrawColor: vi.fn(),
      line: vi.fn(),
      save: vi.fn(),
    })),
  };
});

describe('exportStudioFinancialPdf Utility', () => {
  it('instantiates jsPDF and generates studio report without throwing error', () => {
    const doc = exportStudioFinancialPdf({
      studioName: 'Test Studio',
      photosPrepared: 10,
      sheetsPrinted: 2,
      grossRevenue: 24,
      totalExpense: 1.2,
      netProfit: 22.8,
      profitMargin: 95.0,
      currencySymbol: '$',
    });

    expect(doc).toBeDefined();
  });
});
