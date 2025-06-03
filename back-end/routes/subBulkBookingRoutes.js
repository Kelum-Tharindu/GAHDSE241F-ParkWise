const express = require('express');
const router = express.Router();
const subBulkBookingController = require('../controllers/subBulkBookingController');
const { protect, roleAuth: authorize } = require('../middleware/authMiddleware');

// Get all sub bulk bookings for a specific owner (Event Coordinator)
router.get('/owner/:ownerId', protect, subBulkBookingController.getSubBulkBookingsByOwner);

// Get sub bulk bookings for a specific customer
router.get('/customer/:customerId', protect, subBulkBookingController.getSubBulkBookingsByCustomer);

// Get available bulk bookings for assignment (owner's active bookings with available spots)
router.get('/available/:ownerId', protect, subBulkBookingController.getAvailableBulkBookings);

// Create a new sub bulk booking assignment
router.post('/', protect, subBulkBookingController.createSubBulkBooking);

// Update a sub bulk booking
router.put('/:id', protect, subBulkBookingController.updateSubBulkBooking);

// Delete a sub bulk booking
router.delete('/:id', protect, subBulkBookingController.deleteSubBulkBooking);

// Update last access date when customer uses the assignment
router.patch('/:id/access', protect, subBulkBookingController.updateLastAccess);

module.exports = router;
