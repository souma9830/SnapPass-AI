import mongoose from 'mongoose';

const securityAuditSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., 'LOGIN_SUCCESS', 'PASSWORD_RESET_REQUEST'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    email: { type: String, required: true },
    ip: { type: String, default: '' },
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
    details: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

securityAuditSchema.index({ createdAt: -1 });
securityAuditSchema.index({ action: 1 });
securityAuditSchema.index({ email: 1 });

export default mongoose.model('SecurityAudit', securityAuditSchema);
