const streamer = require('../services/complianceReportStreamer');

console.log('Testing Compliance Report Streamer...');

const header = streamer.formatHeader();
if (!header.includes('timestamp,photoId')) {
  console.error('FAILED: Invalid CSV header');
  process.exit(1);
}

const auditStream = streamer.createAuditStream([{ photoId: 'P-1', preset: '35x45', status: 'PASSED' }]);
let dataReceived = '';

auditStream.on('data', (chunk) => {
  dataReceived += chunk.toString();
});

auditStream.on('end', () => {
  if (dataReceived.includes('P-1')) {
    console.log('SUCCESS: Compliance report streamer verified!');
  } else {
    console.error('FAILED: Stream data missing target photoId');
    process.exit(1);
  }
});
