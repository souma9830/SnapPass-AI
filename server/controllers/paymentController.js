
const ExternalGatewayService = require('../services/externalGatewayService');
exports.handlePayment = async (req, res) => {
    try {
        const result = await ExternalGatewayService.processPayment(req.body || {});
        return res.status(result.fallback ? 503 : 200).json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
