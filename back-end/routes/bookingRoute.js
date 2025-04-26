const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/calculate-fee', bookingController.calculateFee);
router.post('/confirm-booking', bookingController.confirmBooking);

module.exports = router;
