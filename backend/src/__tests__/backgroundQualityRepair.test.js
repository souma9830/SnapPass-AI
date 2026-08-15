import sharp from 'sharp';
import backgroundQualityRepairService from '../services/backgroundQualityRepair.service.js';

describe('AI Background Quality Repair Service', () => {
  let sampleImageBuffer;

  beforeAll(async () => {
    // Create a 200x200 sample PNG buffer with semi-transparent edges
    sampleImageBuffer = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 4,
        background: { r: 50, g: 100, b: 200, alpha: 0.8 },
      },
    })
      .png()
      .toBuffer();
  });

  it('should process image buffer and return refined output PNG', async () => {
    const repaired = await backgroundQualityRepairService.repairQuality(sampleImageBuffer, {
      refineEdges: true,
      removeHalos: true,
      cleanNoise: true,
      bgHex: '#ffffff',
    });

    expect(Buffer.isBuffer(repaired)).toBe(true);
    expect(repaired.length).toBeGreaterThan(0);

    const metadata = await sharp(repaired).metadata();
    expect(metadata.width).toBe(200);
    expect(metadata.height).toBe(200);
    expect(metadata.format).toBe('png');
  });

  it('should fallback gracefully to original buffer if input is invalid', async () => {
    const invalid = await backgroundQualityRepairService.repairQuality('invalid-buffer');
    expect(invalid).toBe('invalid-buffer');
  });
});
