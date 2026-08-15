import { Readable } from 'node:stream';
import { Router } from 'express';

const router = Router();

function createAuditStream(records) {
  let index = 0;
  return new Readable({
    read() {
      if (index >= records.length) {
        this.push(null);
        return;
      }

      const item = records[index++];
      const timestamp = item.timestamp || new Date().toISOString();
      this.push(`${timestamp},${item.photoId},${item.preset},${item.status}\n`);
    }
  });
}

router.get('/export-stream', (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=compliance_report.csv');

  const records = [
    { photoId: 'P-101', preset: '35x45', status: 'PASSED' },
    { photoId: 'P-102', preset: '2x2in', status: 'REJECTED' }
  ];

  res.write('timestamp,photoId,preset,status\n');
  createAuditStream(records).pipe(res);
});

export default router;
