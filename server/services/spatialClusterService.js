
const { inBounds } = require('../utils/geoBoundingBox');
class SpatialClusterService {
    static clusterWorkers(workers, bounds) {
        const filtered = workers.filter(w => inBounds(w, bounds));
        return { count: filtered.length, workers: filtered };
    }
}
module.exports = SpatialClusterService;
