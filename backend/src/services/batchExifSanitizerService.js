class BatchExifSanitizerService {
    sanitizeMetadata(metadata = {}) {
        const clean = { ...metadata };
        const sensitiveFields = ['gps', 'latitude', 'longitude', 'cameraSerialNumber', 'deviceOwner', 'softwareVersion'];
        
        let removedCount = 0;
        sensitiveFields.forEach(field => {
            if (field in clean) {
                delete clean[field];
                removedCount++;
            }
        });

        return {
            cleanMetadata: clean,
            removedCount,
            sanitizedAt: new Date().toISOString()
        };
    }
}
module.exports = new BatchExifSanitizerService();