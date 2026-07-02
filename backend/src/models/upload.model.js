import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema({
  filename: String,
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Upload', UploadSchema);