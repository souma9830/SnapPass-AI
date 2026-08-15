
const express = require('express');
const router = express.Router();
const controller = require('../controllers/accreditationController');
router.post('/verify', controller.verify);
module.exports = router;
