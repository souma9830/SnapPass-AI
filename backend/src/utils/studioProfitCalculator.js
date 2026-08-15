/**
 * Studio Profitability Calculator
 * Computes consumable paper/ink costs, gross customer revenue, and net profit margins.
 */

export function calculateStudioProfit({
  totalSheetsPrinted = 0,
  customerPricePerSheet = 10.0,
  paperCostPerSheet = 0.35,
  inkCostPerSheet = 0.15,
  softwareFeePerSheet = 0.10,
}) {
  const parsedSheets = Math.max(0, Number(totalSheetsPrinted) || 0);
  const price = Math.max(0, Number(customerPricePerSheet) || 0);
  const paperCost = Math.max(0, Number(paperCostPerSheet) || 0);
  const inkCost = Math.max(0, Number(inkCostPerSheet) || 0);
  const softwareFee = Math.max(0, Number(softwareFeePerSheet) || 0);

  const grossRevenue = parsedSheets * price;
  const costPerSheet = paperCost + inkCost + softwareFee;
  const totalExpense = parsedSheets * costPerSheet;
  const netProfit = grossRevenue - totalExpense;
  const profitMarginPercentage = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  return {
    totalSheetsPrinted: parsedSheets,
    grossRevenue: Number(grossRevenue.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    profitMarginPercentage: Number(profitMarginPercentage.toFixed(1)),
    costPerSheet: Number(costPerSheet.toFixed(2)),
  };
}
