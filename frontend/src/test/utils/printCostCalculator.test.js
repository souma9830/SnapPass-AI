import { calculatePrintSheetCost } from '../../utils/printCostCalculator';

describe('calculatePrintSheetCost', () => {
    it('calculates total sheets and material costs accurately for A4', () => {
        const res = calculatePrintSheetCost({ paperSize: 'A4', copies: 13, costPerPage: 0.50 });
        expect(res.totalSheets).toBe(3);
        expect(res.totalCost).toBe(1.50);
        expect(res.wastageSlotCount).toBe(5);
    });
});