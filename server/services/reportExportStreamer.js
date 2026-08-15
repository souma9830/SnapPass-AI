
const cipher = require('../utils/streamCipher');
class ReportExportStreamer {
    static generateReport(rows) {
        const csv = rows.join('\n');
        return cipher.encrypt(csv);
    }
}
module.exports = ReportExportStreamer;
