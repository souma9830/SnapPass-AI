
class WarrantyManagerEngine {
    static verifyClaim(claimDate, warrantyExpiry) {
        return new Date(claimDate) <= new Date(warrantyExpiry);
    }
}
module.exports = WarrantyManagerEngine;
