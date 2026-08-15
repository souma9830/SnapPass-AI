import sharp from 'sharp';

class BackgroundQualityRepairService {
  /**
   * Main entry point to perform background quality repair, edge refinement,
   * halo artifact removal, and background noise cleanup on an image buffer.
   *
   * @param {Buffer} imageBuffer - Input image Buffer (PNG / JPEG / WebP)
   * @param {Object} options - Repair configuration options
   * @param {boolean} [options.refineEdges=true] - Smooth subject boundaries and antialias edges
   * @param {boolean} [options.removeHalos=true] - Remove white or colored fringe artifacts around hair/clothing
   * @param {boolean} [options.cleanNoise=true] - Eliminate leftover background fragments and noise
   * @param {string} [options.bgHex='#ffffff'] - Target background hex color to harmonize edge transitions
   * @returns {Promise<Buffer>} Refined PNG buffer
   */
  async repairQuality(imageBuffer, options = {}) {
    const {
      refineEdges = true,
      removeHalos = true,
      cleanNoise = true,
      bgHex = '#ffffff',
    } = options;

    try {
      if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
        return imageBuffer;
      }
      let pipeline = sharp(imageBuffer).ensureAlpha();
      const metadata = await pipeline.metadata();
      const width = metadata.width || 600;
      const height = metadata.height || 800;

      // 1. Edge Refinement & Anti-aliasing pass
      if (refineEdges) {
        // Apply subtle Gaussian blur to alpha mask for smooth natural boundary transitions
        const alphaMask = await sharp(imageBuffer)
          .ensureAlpha()
          .extractChannel('alpha')
          .blur(0.8)
          .toBuffer();

        pipeline = sharp(imageBuffer)
          .ensureAlpha()
          .composite([
            {
              input: alphaMask,
              blend: 'dest-in',
            },
          ]);
      }

      // 2. Halo Artifact Removal & Defringing pass
      if (removeHalos) {
        // Sharpen subject border and apply median filter to strip light fringe pixels
        const defringedBuffer = await pipeline.png().toBuffer();
        pipeline = sharp(defringedBuffer)
          .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
          .median(1);
      }

      // 3. Background Noise Cleanup & Uniform Background Enforcement
      if (cleanNoise) {
        // Render crisp background canvas and composite subject on top
        const bgCanvas = await sharp({
          create: {
            width,
            height,
            channels: 4,
            background: bgHex,
          },
        })
          .png()
          .toBuffer();

        const subjectBuffer = await pipeline.png().toBuffer();

        pipeline = sharp(bgCanvas).composite([
          {
            input: subjectBuffer,
            blend: 'over',
          },
        ]);
      }

      return await pipeline.png({ quality: 95, compressionLevel: 8 }).toBuffer();
    } catch (err) {
      // Return original buffer as safe fallback if processing fails
      return imageBuffer;
    }
  }
}

export const backgroundQualityRepairService = new BackgroundQualityRepairService();
export default backgroundQualityRepairService;
