const express = require('express');
const router = express.Router();
const bulkbookingController = require('../controllers/bulkbookingController');

// Get all bulk booking chunks
router.get('/', bulkbookingController.getAllBulkBookingChunks);

// Create a new bulk booking chunk
router.post('/', bulkbookingController.createBulkBookingChunk);
// router.post('/create', bulkbookingController.createBulkBookingChunk);

// PATCH route for updating status in back-end/routes/bulkbooking.js
router.patch('/:id', bulkbookingController.updateBulkBookingStatus);

// Route to decrypt and get details from encrypted code
router.post('/decrypt', bulkbookingController.decryptBulkBookingCode);

module.exports = router;
