const express = require('express');
const router = express.Router();
const scanBillingController = require('../controllers/scannercontroller/scanBillingController');
const scanBookingController = require('../controllers/scannercontroller/scanBookingController');
const scanSubBulkBookingController = require('../controllers/scannercontroller/scanSubBulkBookingController');

// Billing scan routes
router.post('/scan-billing', scanBillingController.handleScan);

module.exports = router;



