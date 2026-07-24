import { BatchZipService } from '../services/batchZip.service.js';
import logger from '../utils/logger.js';

/**
 * Controller handling batch photo download requests.
 * POST /api/batch-export
 * Body: { filenames: string[] }
 */
export const handleBatchExport = async (req, res, next) => {
  try {
    const { filenames } = req.body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain a non-empty filenames array.',
      });
    }

    if (filenames.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Batch export limit exceeded. Maximum 50 files allowed per request.',
      });
    }

    const zipFilename = `snappass-photos-${Date.now()}.zip`;
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFilename}"`,
    });

    const result = await BatchZipService.streamZipArchive(filenames, res);
    logger.info({
      event: 'batch_export_success',
      count: result.count,
      bytes: result.totalBytes,
      correlationId: req.correlationId,
    });
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      logger.error({
        event: 'batch_export_stream_error',
        error: error.message,
        correlationId: req.correlationId,
      });
    }
  }
};
