const express = require('express');
const router = express.Router();
const bulkBookingController = require('../controllers/bulkbookingController');
const { protect, roleAuth: authorize } = require('../middleware/authMiddleware'); // Changed authorize to roleAuth and aliased to authorize

// Get all bulk booking chunks (admin only)
router.get('/', protect, authorize(['admin']), bulkBookingController.getAllBulkBookingChunks);

// Create a new bulk booking chunk (assuming event coordinators or admins can do this)
router.post('/', protect, authorize(['admin', 'Event Coordinator']), bulkBookingController.createBulkBookingChunk);

// Decrypt bulk booking code (potentially for validation/check-in staff)
router.post('/decrypt', bulkBookingController.decryptBulkBookingCode);

// Update status of a bulk booking chunk (admin or relevant coordinator)
router.put('/:id/status', protect, authorize(['admin', 'Event Coordinator']), bulkBookingController.updateBulkBookingStatus);

// Get bulk booking chunks for a specific user (for Event Coordinators to see their own)
router.get('/user/:userId', protect, authorize(['admin', 'Event Coordinator']), bulkBookingController.getBulkBookingChunksByUser);

module.exports = router;
