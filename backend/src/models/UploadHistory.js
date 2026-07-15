import mongoose from 'mongoose';

const uploadHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalImage: {
      type: String,
      required: true,
    },
    processedImage: {
      type: String,
    },
    presetSize: {
      type: String,
      enum: ['35x45', '51x51', '33x48', '40x60', '2x2in'],
      required: true,
    },
    backgroundColor: {
      type: String,
      enum: ['white', 'off-white', 'light-gray', 'light-blue', 'light-red'],
      default: 'white',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

uploadHistorySchema.index({ user: 1, createdAt: -1 });
uploadHistorySchema.index({ status: 1, createdAt: -1 });
uploadHistorySchema.index({ presetSize: 1 });

const UploadHistory = mongoose.model('UploadHistory', uploadHistorySchema);

export default UploadHistory;
