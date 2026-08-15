const batchExifSanitizerService = require('../services/batchExifSanitizerService');

exports.sanitizeBatchMetadata = (req, res) => {
    const { items = [] } = req.body || {};
    const sanitizedResults = items.map(item => ({
        id: item.id,
        result: batchExifSanitizerService.sanitizeMetadata(item.metadata || {})
    }));

    return res.status(200).json({
        success: true,
        totalProcessed: sanitizedResults.length,
        items: sanitizedResults
    });
};