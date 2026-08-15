const biometricComplianceService = require('../services/biometricComplianceService');

exports.checkEyeDistanceCompliance = async (req, res, next) => {
    try {
        const { landmarks, width } = req.body || {};
        if (!width || width <= 0) {
            return res.status(400).json({ error: 'Canvas width must be a positive integer.' });
        }

        const evaluation = biometricComplianceService.validateEyeDistance(landmarks, width);
        return res.status(200).json({
            success: true,
            data: evaluation,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};