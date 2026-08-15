
const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceWarrantyManagerController');
router.post('/claim', controller.claim);
module.exports = router;
