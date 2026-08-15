
const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatDeliveryController');
router.post('/ack', controller.ack);
module.exports = router;
