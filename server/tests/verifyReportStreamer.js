
const streamer = require('../services/reportExportStreamer');
const output = streamer.generateReport(['header1,header2', 'val1,val2']);
if (output.startsWith('ENC_')) {
    console.log("PASSED: Stream encrypted report export verified!");
    process.exit(0);
} else {
    console.error("FAILED Report Streamer test");
    process.exit(1);
}
