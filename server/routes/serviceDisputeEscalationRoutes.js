
const express = require('express');
const router = express.Router();
const controller = require('../controllers/disputeEscalationController');
router.post('/transition', controller.updateDispute);
module.exports = router;
