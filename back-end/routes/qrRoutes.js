const express = require("express");
const { createQRCodeForParkingID, decodeQRCodeData } = require("../controllers/qrController");

const router = express.Router();

// Route for generating QR code based on parkingID
router.post("/generate-qr", createQRCodeForParkingID); // This uses the correct controller function

// Route for decoding QR code if needed
router.post("/decode-qr", decodeQRCodeData);

module.exports = router;
