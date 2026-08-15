const archiveZipStreamerService = require('../services/archiveZipStreamerService');

exports.generateArchive = (req, res) => {
    const { files = [] } = req.body || {};
    const manifest = archiveZipStreamerService.createDownloadManifest(files);
    return res.status(200).json({ success: true, manifest });
};