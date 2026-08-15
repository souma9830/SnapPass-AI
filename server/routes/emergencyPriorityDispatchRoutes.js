
const express = require('express');
const router = express.Router();
const controller = require('../controllers/emergencyPriorityDispatchController');
router.post('/sos', controller.triggerSOS);
module.exports = router;
