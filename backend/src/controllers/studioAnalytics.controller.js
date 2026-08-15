import StudioAnalytics from '../models/studioAnalytics.model.js';
import { successResponse, errorResponse } from '../utils/httpResponse.js';

export async function logPrintTransaction(req, res, next) {
  try {
    const { studioId = 'default_studio', photosCount = 1, sheetsCount = 1, pricePerSheet = 10, preset = '35x45' } = req.body;
    const today = new Date().toISOString().split('T')[0];

    let record = await StudioAnalytics.findOne({ studioId, date: today });
    if (!record) {
      record = new StudioAnalytics({
        studioId,
        date: today,
        photosProcessedCount: 0,
        sheetsPrintedCount: 0,
        grossRevenue: 0,
        presetBreakdown: {},
      });
    }

    record.photosProcessedCount += Number(photosCount);
    record.sheetsPrintedCount += Number(sheetsCount);
    record.grossRevenue += Number(sheetsCount) * Number(pricePerSheet);
    
    const currentPresetCount = record.presetBreakdown.get(preset) || 0;
    record.presetBreakdown.set(preset, currentPresetCount + Number(photosCount));

    await record.save();

    return successResponse(res, record, 'Studio transaction logged successfully');
  } catch (err) {
    next(err);
  }
}

export async function getDailyAnalytics(req, res, next) {
  try {
    const { studioId = 'default_studio', days = 30 } = req.query;
    const records = await StudioAnalytics.find({ studioId })
      .sort({ date: -1 })
      .limit(Number(days))
      .lean();

    return successResponse(res, records, 'Daily studio analytics retrieved successfully');
  } catch (err) {
    next(err);
  }
}
