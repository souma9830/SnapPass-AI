const mongoose = require('mongoose');

const complianceExportTaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true },
  format: { type: String, enum: ['csv', 'json'], default: 'csv' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  fileUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ComplianceExportTask', complianceExportTaskSchema);
