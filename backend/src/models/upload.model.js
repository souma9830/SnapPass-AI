import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema({
  filename: { type: String, index: true },
  originalImage: String,
  status: { type: String, default: 'pending', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  fileSize: Number,
  mimeType: String,
  createdAt: { type: Date, default: Date.now, index: true },
});

UploadSchema.index({ userId: 1, createdAt: -1 });
UploadSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Upload', UploadSchema);
