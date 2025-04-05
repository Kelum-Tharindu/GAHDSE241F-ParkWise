const express = require("express");
const { entryScan, exitScan } = require("../controllers/billingController");

const router = express.Router();

router.post("/entry", entryScan);
router.post("/exit", exitScan);

module.exports = router;
