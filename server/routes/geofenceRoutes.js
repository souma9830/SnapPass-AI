
const express = require('express');
const router = express.Router();
const controller = require('../controllers/geofenceAuditController');
router.post('/checkin', controller.checkIn);
module.exports = router;
