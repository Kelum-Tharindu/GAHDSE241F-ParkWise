const express = require('express');
const router = express.Router();
const bulkbookingController = require('../controllers/bulkbookingController');

// Get all bulk booking chunks
router.get('/', bulkbookingController.getAllBulkBookingChunks);

// Create a new bulk booking chunk
// router.post('/', bulkbookingController.createBulkBookingChunk);
router.post('/create', bulkbookingController.createBulkBookingChunk);

module.exports = router;
