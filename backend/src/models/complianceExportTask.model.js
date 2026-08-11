import mongoose from 'mongoose';

const complianceExportTaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    recordCount: { type: Number, default: 0 },
    errorMessage: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

complianceExportTaskSchema.index({ status: 1 });
complianceExportTaskSchema.index({ createdAt: -1 });

export default mongoose.model('ComplianceExportTask', complianceExportTaskSchema);
