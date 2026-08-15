
const express = require('express');
const router = express.Router();
const controller = require('../controllers/referralController');
router.post('/evaluate', controller.evaluateReferral);
module.exports = router;
