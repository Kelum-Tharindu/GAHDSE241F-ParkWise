const { generateQRCode } = require('../utils/qrGenertor.js'); // Import the utility function

// Controller function to generate QR code for parkingID
const createQRCodeForParkingID = async (req, res) => {
    try {
        const { parkingID } = req.body;

        // Generate QR code using the utility function
        const qrCodeData = await generateQRCode(parkingID); // Correct function call

        // Send the QR code as part of the response
        res.status(200).json({ message: "QR code generated successfully", qrCode: qrCodeData });
    } catch (error) {
        res.status(500).json({ message: "Error generating QR code", error: error.message });
    }
};

// If you're also handling other QR code operations
const decodeQRCodeData = (req, res) => {
    // Implement decoding logic if needed
};

module.exports = { createQRCodeForParkingID, decodeQRCodeData };
