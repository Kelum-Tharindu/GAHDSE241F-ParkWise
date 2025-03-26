const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// Define routes
router.post("/entry", billingController.createEntry);
router.post("/exit", billingController.processExit);

module.exports = router;
