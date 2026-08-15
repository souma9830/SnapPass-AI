
class AccreditationVerifier {
    static verifyDocument(doc) {
        if (doc && doc.validDate) return { verified: true, badge: "TRUSTED_PRO" };
        return { verified: false, badge: "UNVERIFIED" };
    }
}
module.exports = AccreditationVerifier;
