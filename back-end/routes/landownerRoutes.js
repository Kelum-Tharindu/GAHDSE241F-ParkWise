const express = require('express');
const router = express.Router();
const landownerController = require('../controllers/landownerController');

// Get all landowners
router.get('/all', landownerController.getAllLandowners);

module.exports = router; 