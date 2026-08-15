import mongoose from 'mongoose';

const studioActivityLogSchema = new mongoose.Schema(
  {
    studioId: {
      type: String,
      required: true,
      index: true,
      default: 'default_studio',
    },
    presetUsed: {
      type: String,
      required: true,
      default: '35x45',
    },
    sheetQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    photosCount: {
      type: Number,
      default: 6,
      min: 1,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

studioActivityLogSchema.index({ studioId: 1, timestamp: -1 });

const StudioActivityLog = mongoose.model('StudioActivityLog', studioActivityLogSchema);
export default StudioActivityLog;
