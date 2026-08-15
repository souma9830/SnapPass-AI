import { stripImageExifData } from '../exifScrubber.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('EXIF Scrubber Utility', () => {
  test('strips EXIF metadata cleanly from image', async () => {
    const testFile = path.join(os.tmpdir(), `test-exif-${Date.now()}.jpg`);
    await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).toFile(testFile);

    const res = await stripImageExifData(testFile);
    expect(res.success).toBe(true);

    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });
});
