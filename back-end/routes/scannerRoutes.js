const express = require("express");
const router = express.Router();
const scannerController = require("../controllers/scannerController");

/**
 * @route   POST /api/scanner/scan
 * @desc    Process scan data from scanner app
 * @access  Public
 */
router.post("/scan", scannerController.processScan);

/**
 * @route   POST /api/scanner/confirm-payment
 * @desc    Confirm payment for billing - updates billing and transaction records
 * @access  Public
 */
router.post("/confirm-payment", scannerController.confirmBillingPayment);

/**
 * @route   POST /api/scanner/check-extra-fee
 * @desc    Check ongoing booking for extra time and calculate extra fees
 * @access  Public
 */
router.post("/check-extra-fee", scannerController.checkOngoingBookingExtraFee);

module.exports = router;
