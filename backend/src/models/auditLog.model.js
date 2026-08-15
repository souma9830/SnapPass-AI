import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    endpoint: { type: String, required: true },
    statusCode: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    requestId: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ method: 1, endpoint: 1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ statusCode: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
