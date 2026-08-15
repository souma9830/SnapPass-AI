
const express = require('express');
const router = express.Router();
const controller = require('../controllers/payoutManagementController');
router.post('/calculate', controller.getPayout);
module.exports = router;
