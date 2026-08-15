
module.exports = {
    inBounds: (point, bounds) => {
        return point.lat >= bounds.minLat && point.lat <= bounds.maxLat &&
               point.lng >= bounds.minLng && point.lng <= bounds.maxLng;
    }
};
