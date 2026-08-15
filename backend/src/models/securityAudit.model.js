import mongoose from 'mongoose';

const securityAuditSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., 'LOGIN_SUCCESS', 'AUTH_FAILED', 'PASSWORD_RESET_REQUEST'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    email: { type: String, required: true },
    ip: { type: String, default: '' },
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
    severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], default: 'INFO' },
    userAgent: { type: String, default: '' },
    details: { type: String, default: '' },
    threatScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
  }
);

securityAuditSchema.index({ createdAt: -1 });
securityAuditSchema.index({ action: 1 });
securityAuditSchema.index({ email: 1 });
securityAuditSchema.index({ ip: 1, action: 1 });
securityAuditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90-day TTL

securityAuditSchema.statics.logSecurityEvent = function (eventData) {
  return this.create({
    ...eventData,
    threatScore: eventData.severity === 'CRITICAL' ? 85 : eventData.severity === 'WARNING' ? 45 : 10,
  });
};

export default mongoose.model('SecurityAudit', securityAuditSchema);
