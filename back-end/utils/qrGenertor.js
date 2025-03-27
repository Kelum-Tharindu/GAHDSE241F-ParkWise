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

// Function to decode QR Code from an image buffer
const decodeQRCode = async (imageBuffer) => {
    try {
        const image = await Jimp.read(imageBuffer);
        const imageData = {
            data: new Uint8ClampedArray(image.bitmap.data),
            width: image.bitmap.width,
            height: image.bitmap.height,
        };

        const qrCodeResult = jsQR(imageData.data, imageData.width, imageData.height);
        if (!qrCodeResult) {
            throw new Error("QR code not found in image");
        }

        return qrCodeResult.data; // Decoded QR code data
    } catch (error) {
        throw new Error("Failed to decode QR code: " + error.message);
    }
};

module.exports = { generateQRCode, decodeQRCode };
