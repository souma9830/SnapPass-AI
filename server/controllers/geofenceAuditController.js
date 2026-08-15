
const auditor = require('../utils/geofenceAuditor');
exports.checkIn = (req, res) => {
    const valid = auditor.validateArrival(req.body.distance);
    res.status(valid ? 200 : 403).json({ valid });
};
