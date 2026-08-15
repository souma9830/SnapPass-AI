const crypto = require('crypto');

class ArchiveZipStreamerService {
    createDownloadManifest(fileList = []) {
        const archiveId = 'archive_' + crypto.randomBytes(8).toString('hex');
        return {
            archiveId,
            fileCount: fileList.length,
            createdTimestamp: new Date().toISOString(),
            status: 'READY'
        };
    }
}
module.exports = new ArchiveZipStreamerService();