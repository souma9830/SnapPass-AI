
const service = require('../services/spatialClusterService');
exports.searchWorkers = (req, res) => {
    const bounds = req.body.bounds || { minLat: 0, maxLat: 50, minLng: 0, maxLng: 50 };
    const workers = [{ id: 1, lat: 25, lng: 25 }, { id: 2, lat: 90, lng: 90 }];
    res.json(service.clusterWorkers(workers, bounds));
};
