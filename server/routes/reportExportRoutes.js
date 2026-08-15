
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportExportController');
router.get('/export', controller.exportReport);
module.exports = router;
