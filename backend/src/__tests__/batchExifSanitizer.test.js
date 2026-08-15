const batchExifSanitizerService = require('../services/batchExifSanitizerService');

describe('BatchExifSanitizerService', () => {
    it('removes sensitive EXIF tags while retaining basic dimensions', () => {
        const raw = { gps: { lat: 12.34 }, cameraSerialNumber: 'SN9981', width: 600, height: 600 };
        const result = batchExifSanitizerService.sanitizeMetadata(raw);
        expect(result.cleanMetadata.gps).toBeUndefined();
        expect(result.cleanMetadata.cameraSerialNumber).toBeUndefined();
        expect(result.cleanMetadata.width).toBe(600);
        expect(result.removedCount).toBe(2);
    });
});