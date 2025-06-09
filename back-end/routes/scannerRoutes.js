const express = require("express");
const router = express.Router();
const scannerController = require("../controllers/scannerController");

/**
 * @route   POST /api/scanner/scan
 * @desc    Process scan data from scanner app
 * @access  Public
 */
router.post("/scan", scannerController.processScan);

module.exports = router;
