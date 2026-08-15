
const streamer = require('../services/reportExportStreamer');
exports.exportReport = (req, res) => res.send(streamer.generateReport(['id,name', '1,Item']));
