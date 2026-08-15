
const express = require('express');
const router = express.Router();
const controller = require('../controllers/estimateController');
router.post('/calculate', controller.getEstimate);
module.exports = router;
