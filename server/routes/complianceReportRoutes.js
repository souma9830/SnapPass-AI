const express = require('express');
const router = express.Router();
const streamer = require('../services/complianceReportStreamer');

router.get('/export-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=compliance_report.csv');

  const dummyData = [
    { photoId: 'P-101', preset: '35x45', status: 'PASSED' },
    { photoId: 'P-102', preset: '2x2in', status: 'REJECTED' }
  ];

  res.write(streamer.formatHeader());
  const auditStream = streamer.createAuditStream(dummyData);
  auditStream.pipe(res);
});

module.exports = router;
