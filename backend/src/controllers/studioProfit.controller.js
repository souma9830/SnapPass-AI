import { calculateStudioProfit } from '../utils/studioProfitCalculator.js';
import StudioAnalytics from '../models/studioAnalytics.model.js';
import { successResponse } from '../utils/httpResponse.js';

export async function getProfitSummary(req, res, next) {
  try {
    const {
      studioId = 'default_studio',
      customerPrice = 10,
      paperCost = 0.35,
      inkCost = 0.15,
      days = 30,
    } = req.query;

    const records = await StudioAnalytics.find({ studioId })
      .sort({ date: -1 })
      .limit(Number(days))
      .lean();

    const totalSheetsPrinted = records.reduce((sum, r) => sum + (r.sheetsPrintedCount || 0), 0);

    const profitMetrics = calculateStudioProfit({
      totalSheetsPrinted,
      customerPricePerSheet: customerPrice,
      paperCostPerSheet: paperCost,
      inkCostPerSheet: inkCost,
    });

    return successResponse(res, profitMetrics, 'Studio profit breakdown generated successfully');
  } catch (err) {
    next(err);
  }
}
