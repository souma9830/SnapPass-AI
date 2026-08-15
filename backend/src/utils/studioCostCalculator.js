/**
 * Studio Material & Consumable Expense Engine
 * Calculates paper sheet costs, ink cartridge depletion, and maintenance overheads.
 */

export function calculateMaterialExpense({
  sheetsPrinted = 0,
  paperCostPerSheet = 0.35,
  inkDepletionFactor = 0.15,
  overheadPerSheet = 0.05,
}) {
  const parsedSheets = Math.max(0, Number(sheetsPrinted) || 0);
  const paperTotal = parsedSheets * Math.max(0, Number(paperCostPerSheet) || 0);
  const inkTotal = parsedSheets * Math.max(0, Number(inkDepletionFactor) || 0);
  const overheadTotal = parsedSheets * Math.max(0, Number(overheadPerSheet) || 0);
  const totalExpense = paperTotal + inkTotal + overheadTotal;

  return {
    sheetsPrinted: parsedSheets,
    paperExpense: Number(paperTotal.toFixed(2)),
    inkExpense: Number(inkTotal.toFixed(2)),
    overheadExpense: Number(overheadTotal.toFixed(2)),
    totalConsumableExpense: Number(totalExpense.toFixed(2)),
  };
}
