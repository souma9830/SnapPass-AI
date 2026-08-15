import { exportStudioFinancialPdf } from '../../utils/exportStudioFinancialPdf';

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      setTextColor: jest.fn(),
      setFillColor: jest.fn(),
      setLineWidth: jest.fn(),
      setDrawColor: jest.fn(),
      text: jest.fn(),
      rect: jest.fn(),
      line: jest.fn(),
      save: jest.fn(),
    })),
  };
});

describe('exportStudioFinancialPdf Utility', () => {
  it('instantiates jsPDF and generates studio report without errors', () => {
    const doc = exportStudioFinancialPdf({
      studioName: 'Test Passport Studio',
      photosPrepared: 50,
      sheetsPrinted: 10,
      grossRevenue: 120.0,
      totalExpense: 6.0,
      netProfit: 114.0,
      profitMargin: 95.0,
    });

    expect(doc).toBeDefined();
    expect(doc.save).toHaveBeenCalled();
  });
});
