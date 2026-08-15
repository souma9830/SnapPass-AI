
const express = require('express');
const router = express.Router();
const controller = require('../controllers/spatialSearchController');
router.post('/cluster', controller.searchWorkers);
module.exports = router;
