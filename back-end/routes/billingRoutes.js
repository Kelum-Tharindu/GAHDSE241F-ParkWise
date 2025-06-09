const express = require("express");
const router = express.Router();
const { createBilling, getUserBillings } = require("../controllers/billingController");

router.post("/", createBilling);
router.get("/user/:userId", getUserBillings);

module.exports = router;
