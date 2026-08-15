
const verifier = require('../services/accreditationVerifier');
exports.verify = (req, res) => res.json(verifier.verifyDocument(req.body));
