const QRCode = require('qrcode');
const Jimp = require('jimp');
const jsQR = require('jsqr');

// Function to generate a QR Code
const generateQRCode = async (parkingID) => {
    try {
        const qrCodeData = await QRCode.toDataURL(parkingID); // Generates QR code as a base64 string
        return qrCodeData;
    } catch (error) {
        throw new Error("Failed to generate QR code");
    }
};

module.exports = { generateQRCode };
