
const express = require('express');
const router = express.Router();
const diag = require('../controllers/rateLimitDiagnosticsController');
router.get('/diagnostics', diag.getMetrics);
module.exports = router;
