const express = require("express");
const router = express.Router();
const scanBillingController = require("../controllers/scannercontroller/scanBillingController");
const scanBookingController = require("../controllers/scannercontroller/scanBookingController");
const scanSubBulkBookingController = require("../controllers/scannercontroller/scanSubBulkBookingController");

// Billing scan routes
router.post("/scan-billing", scanBillingController.handleScan);

// Payment confirmation route
router.post("/confirm-payment", scanBillingController.confirmPayment);

// Booking scan route
router.post("/scan-booking", scanBookingController.handleBooking);

// Booking checkout route
router.post("/booking-checkout", scanBookingController.handleBookingCheckout);

// Booking checkout confirmation route
router.post(
  "/confirm-booking-checkout",
  scanBookingController.confirmBookingCheckout
);

module.exports = router;
