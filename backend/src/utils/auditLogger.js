import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

export const writeAuditEntry = (action, details) => {
  const timestamp = new Date().toISOString();
  const entry = JSON.stringify({ timestamp, action, details }) + '\n';
  fs.appendFile(path.join(logDirectory, 'audit.log'), entry, (err) => {
    if (err) console.error('[AuditLogger] Failed to write audit entry:', err);
  });
};
