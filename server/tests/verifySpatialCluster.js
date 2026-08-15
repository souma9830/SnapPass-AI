
const service = require('../services/spatialClusterService');
const workers = [{ id: 1, lat: 10, lng: 10 }, { id: 2, lat: 80, lng: 80 }];
const bounds = { minLat: 0, maxLat: 20, minLng: 0, maxLng: 20 };
const result = service.clusterWorkers(workers, bounds);
if (result.count === 1 && result.workers[0].id === 1) {
    console.log("PASSED: Geospatial bounding box cluster filtering verified!");
    process.exit(0);
} else {
    console.error("FAILED Spatial Cluster test");
    process.exit(1);
}
