const express = require('express');
const { getParkingNames } = require('../controllers/bookingController');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/calculate-fee', bookingController.calculateFee);
router.post('/confirm-booking', bookingController.confirmBooking);
router.get('/parking-names', getParkingNames);
router.get('/booking-history/:userId', bookingController.getBookingHistoryByUserId);

module.exports = router;
