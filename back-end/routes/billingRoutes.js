const express = require("express");
const router = express.Router();
const { createBilling } = require("../controllers/billingController");

router.post("/", createBilling);

module.exports = router;
