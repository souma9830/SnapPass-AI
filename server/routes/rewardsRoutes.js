
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rewardsController');
router.get('/', controller.getReward);
module.exports = router;
