const mongoose = require('mongoose');

const watermarkAuditSchema = new mongoose.Schema({
  photoId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true },
  watermarkToken: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: true },
  securityFlags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('WatermarkAudit', watermarkAuditSchema);
