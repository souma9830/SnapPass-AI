import { describe, it, expect } from 'vitest';
import { calculateStudioFinancials } from '../../utils/studioFinancialCalculator';

describe('studioFinancialCalculator', () => {
  it('calculates studio profit margins correctly', () => {
    const result = calculateStudioFinancials({
      paperCostPerSheet: 0.50,
      inkCostPerSheet: 0.30,
      photosPerSheet: 4, // $0.20 unit cost
      sellingPricePerPhoto: 2.00,
      monthlyVolumePhotos: 100
    });

    expect(result.costPerPhoto).toBe(0.20);
    expect(result.profitPerPhoto).toBe(1.80);
    expect(result.profitMarginPercent).toBe(90);
    expect(result.monthlyProfit).toBe(180);
  });
});
