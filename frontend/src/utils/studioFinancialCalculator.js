/**
 * Commercial Passport Photo Studio Cost & Financial Revenue Exporter
 * Calculates cost breakdown per print sheet and projects monthly studio revenue.
 */

/**
 * Generates financial analytics breakdown for studio operations.
 * @param {Object} input - Operational metrics
 * @returns {{costPerPhoto: number, profitMarginPercent: number, monthlyProfit: number, summaryTable: Array}}
 */
export function calculateStudioFinancials(input) {
  const {
    paperCostPerSheet = 0.50, // $0.50 per A4/4x6 sheet
    inkCostPerSheet = 0.30,   // $0.30 ink cost
    photosPerSheet = 6,       // 6 passport photos per sheet
    sellingPricePerPhoto = 2.50, // $2.50 per photo charged to customer
    monthlyVolumePhotos = 500   // 500 photos sold per month
  } = input || {};

  const totalCostPerSheet = paperCostPerSheet + inkCostPerSheet;
  const costPerPhoto = Math.round((totalCostPerSheet / photosPerSheet) * 100) / 100;
  
  const revenuePerPhoto = sellingPricePerPhoto;
  const profitPerPhoto = Math.round((revenuePerPhoto - costPerPhoto) * 100) / 100;
  const profitMarginPercent = Math.round((profitPerPhoto / revenuePerPhoto) * 100);

  const totalMonthlyRevenue = monthlyVolumePhotos * revenuePerPhoto;
  const totalMonthlyCost = monthlyVolumePhotos * costPerPhoto;
  const monthlyProfit = Math.round(totalMonthlyRevenue - totalMonthlyCost);

  return {
    costPerPhoto,
    profitPerPhoto,
    profitMarginPercent,
    totalMonthlyRevenue,
    monthlyProfit,
    summaryTable: [
      { label: 'Paper & Ink Cost / Sheet', value: `$${totalCostPerSheet.toFixed(2)}` },
      { label: 'Unit Cost / Photo', value: `$${costPerPhoto.toFixed(2)}` },
      { label: 'Customer Retail Price / Photo', value: `$${sellingPricePerPhoto.toFixed(2)}` },
      { label: 'Studio Profit Margin', value: `${profitMarginPercent}%` },
      { label: 'Estimated Monthly Net Profit', value: `$${monthlyProfit}` }
    ]
  };
}
