/**
 * Studio Customer Pricing Configurator
 * Manages customer billing pricing tiers for printed sheets, digital copies, and custom paper card sizes.
 */

export const DEFAULT_STUDIO_PRICING = {
  a4SheetPrice: 12.0,
  card4x6Price: 8.0,
  digitalCopyPrice: 5.0,
};

export function calculateCustomerBilling({
  a4SheetsCount = 0,
  cardsCount = 0,
  digitalCopiesCount = 0,
  customRates = {},
}) {
  const rates = { ...DEFAULT_STUDIO_PRICING, ...customRates };

  const a4Total = Math.max(0, Number(a4SheetsCount) || 0) * rates.a4SheetPrice;
  const cardsTotal = Math.max(0, Number(cardsCount) || 0) * rates.card4x6Price;
  const digitalTotal = Math.max(0, Number(digitalCopiesCount) || 0) * rates.digitalCopyPrice;
  const grossBillingTotal = a4Total + cardsTotal + digitalTotal;

  return {
    a4Total: Number(a4Total.toFixed(2)),
    cardsTotal: Number(cardsTotal.toFixed(2)),
    digitalTotal: Number(digitalTotal.toFixed(2)),
    grossBillingTotal: Number(grossBillingTotal.toFixed(2)),
  };
}
