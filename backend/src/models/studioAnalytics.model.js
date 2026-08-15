import mongoose from 'mongoose';

const studioAnalyticsSchema = new mongoose.Schema(
  {
    studioId: {
      type: String,
      required: true,
      index: true,
      default: 'default_studio',
    },
    date: {
      type: String,
      required: true,
      index: true, // Format: YYYY-MM-DD
    },
    photosProcessedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sheetsPrintedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    grossRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    presetBreakdown: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

studioAnalyticsSchema.index({ studioId: 1, date: -1 });

const StudioAnalytics = mongoose.model('StudioAnalytics', studioAnalyticsSchema);
export default StudioAnalytics;
