const express = require('express');
const router = express.Router();
const parkingPaymentController = require('../controllers/parkingPaymentController');
const { protect, roleAuth: authorize } = require('../middleware/authMiddleware');

// Get parking payment summary for a specific user (Event Coordinator)
router.get('/user/:userId', protect, parkingPaymentController.getParkingPaymentSummary);

// Get all parking payments (Admin only)
router.get('/all', protect, authorize(['admin']), parkingPaymentController.getAllParkingPayments);

// Get detailed information for a specific parking slot payment
router.get('/details/:slotId', protect, parkingPaymentController.getParkingPaymentDetails);

// Update parking slot usage
router.put('/usage/:slotId', protect, parkingPaymentController.updateSlotUsage);

module.exports = router;
