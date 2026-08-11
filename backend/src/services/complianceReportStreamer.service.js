import { Readable } from 'stream';
import crypto from 'crypto';
import AuditLog from '../models/auditLog.model.js';
import ComplianceExportTask from '../models/complianceExportTask.model.js';

const CSV_HEADER = [
  'timestamp',
  'method',
  'endpoint',
  'statusCode',
  'durationMs',
  'ip',
  'userId',
  'requestId',
  'errorMessage',
];

const BATCH_SIZE = 500;

const escapeCsv = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const rowToCsv = (row) =>
  [
    row.createdAt ? new Date(row.createdAt).toISOString() : '',
    row.method,
    row.endpoint,
    row.statusCode,
    row.durationMs,
    row.ip,
    row.userId ? String(row.userId) : '',
    row.requestId,
    row.errorMessage,
  ]
    .map(escapeCsv)
    .join(',');

/**
 * ComplianceReportStreamer — streams compliance audit log entries as CSV
 * through a Node.js Readable so large enterprise exports never materialize
 * the full report in server memory (#1981).
 */
export class ComplianceReportStreamer extends Readable {
  constructor(options = {}) {
    super({ highWaterMark: options.highWaterMark || 64 * 1024 });
    this.filter = options.filter || {};
    this.recordCount = 0;
    this.exhausted = false;
    this.cursor = null;
    this.taskId = crypto.randomBytes(12).toString('hex');
    this.task = null;
  }

  async _read() {
    try {
      if (this.exhausted) {
        await this.finishTask();
        this.push(null);
        return;
      }

      if (!this.cursor) {
        this.task = await ComplianceExportTask.create({
          taskId: this.taskId,
          fileName: `compliance-export-${this.taskId}.csv`,
          status: 'RUNNING',
        });
        this.cursor = AuditLog.find(this.filter).sort({ createdAt: -1 }).lean().cursor();
      }

      const batch = [];
      for (let i = 0; i < BATCH_SIZE; i += 1) {
        const doc = await this.cursor.next();
        if (doc === null) {
          this.exhausted = true;
          break;
        }
        batch.push(rowToCsv(doc));
      }

      if (batch.length === 0) {
        this.exhausted = true;
        if (!this.headerSent) {
          this.headerSent = true;
          this.push(CSV_HEADER.map(escapeCsv).join(',') + '\n');
        }
        await this.finishTask();
        this.push(null);
        return;
      }

      this.recordCount += batch.length;
      if (!this.headerSent) {
        this.headerSent = true;
        this.push(CSV_HEADER.map(escapeCsv).join(',') + '\n');
      }
      this.push(batch.join('\n') + '\n');
    } catch (error) {
      await this.failTask(error);
      this.destroy(error);
    }
  }

  async finishTask() {
    if (!this.task) return;
    await ComplianceExportTask.findOneAndUpdate(
      { taskId: this.taskId },
      { status: 'COMPLETED', recordCount: this.recordCount }
    ).catch((err) => {
      console.warn('[ComplianceReportStreamer] failed to finalize task:', err.message);
    });
  }

  async failTask(error) {
    if (!this.task) {
      try {
        this.task = await ComplianceExportTask.create({
          taskId: this.taskId,
          fileName: `compliance-export-${this.taskId}.csv`,
          status: 'FAILED',
          errorMessage: error.message,
        });
      } catch (err) {
        console.warn('[ComplianceReportStreamer] failed to record error task:', err.message);
      }
      return;
    }
    await ComplianceExportTask.findOneAndUpdate(
      { taskId: this.taskId },
      { status: 'FAILED', errorMessage: error.message }
    ).catch((err) => {
      console.warn('[ComplianceReportStreamer] failed to fail task:', err.message);
    });
  }
}

export const complianceReportStreamer = {
  createStream(options = {}) {
    return new ComplianceReportStreamer(options);
  },
};

export default complianceReportStreamer;
