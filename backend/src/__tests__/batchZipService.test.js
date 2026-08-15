import { generateArchiveManifest } from '../utils/archiveManifest.utils.js';
import { validateBatchExportRequest } from '../validation/batchExport.validation.js';

describe('Batch Archive Compression & Manifest', () => {
  test('generateArchiveManifest generates valid checksum manifest', () => {
    const dummyFiles = [{ name: 'photo1.jpg', buffer: Buffer.from('test-image-1') }];
    const manifestStr = generateArchiveManifest(dummyFiles);
    const parsed = JSON.parse(manifestStr);
    expect(parsed.totalFiles).toBe(1);
    expect(parsed.files[0].checksum).toBeDefined();
  });

  test('validateBatchExportRequest validates request payload', () => {
    expect(validateBatchExportRequest({ files: [{ name: 'img.jpg' }], compressionLevel: 6 }).isValid).toBe(true);
    expect(validateBatchExportRequest({ files: [] }).isValid).toBe(false);
    expect(validateBatchExportRequest({ files: [{ name: 'img.jpg' }], compressionLevel: 12 }).isValid).toBe(false);
  });
});
