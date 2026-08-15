import { calculatePixels, getAspectratio, calculatePrintCapacity } from '../../utils/presetCalculator';
import { exportSheetToPDF } from '../../utils/pdfExport';

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setProperties: jest.fn(),
      addImage: jest.fn(),
      line: jest.fn(),
      save: jest.fn(),
    })),
  };
});

describe('Print Sheet Calculations & PDF Generator', () => {
  describe('calculatePixels', () => {
    test('calculates 300 DPI pixel dimensions correctly for 35x45 mm', () => {
      const { widthPx, heightPx } = calculatePixels(35, 45, 300);
      expect(widthPx).toBe(413);
      expect(heightPx).toBe(531);
    });

    test('calculates aspect ratio correctly', () => {
      expect(getAspectratio(35, 45)).toBeCloseTo(0.777, 2);
    });
  });

  describe('calculatePrintCapacity', () => {
    test('calculates grid rows and total capacity for 4x6 photo card', () => {
      const result = calculatePrintCapacity('4x6', 35, 45);
      expect(result.cols).toBeGreaterThanOrEqual(1);
      expect(result.rows).toBeGreaterThanOrEqual(1);
      expect(result.totalCapacity).toBe(result.cols * result.rows);
      expect(result.inches).toEqual([4, 6]);
    });

    test('calculates capacity for A4 page', () => {
      const result = calculatePrintCapacity('A4', 35, 45);
      expect(result.totalCapacity).toBeGreaterThan(4);
    });
  });

  describe('exportSheetToPDF', () => {
    test('creates PDF instance and adds image blob', async () => {
      const dummyBlob = new Blob(['dummy blob data'], { type: 'image/png' });
      global.URL.createObjectURL = jest.fn().mockReturnValue('blob:test');
      global.URL.revokeObjectURL = jest.fn();

      const imageInstance = {
        onload: null,
        onerror: null,
      };

      global.Image = jest.fn().mockImplementation(() => imageInstance);

      const promise = exportSheetToPDF(dummyBlob, 'test.pdf', [4, 6], { addCropMarks: true });
      imageInstance.onload();

      await expect(promise).resolves.toBeUndefined();
    });
  });
});
