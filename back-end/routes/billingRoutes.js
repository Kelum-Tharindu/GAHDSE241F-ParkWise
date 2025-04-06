const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// POST: Create a billing entry and return QR
router.post("/entry", billingController.createBilling);

module.exports = router;
