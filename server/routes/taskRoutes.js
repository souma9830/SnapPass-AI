
const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskDispatcherController');
router.post('/dispatch', controller.dispatchTask);
module.exports = router;
