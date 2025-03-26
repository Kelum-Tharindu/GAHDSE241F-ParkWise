const QRCode = require("qrcode");
const crypto = require("crypto");

// Function to generate unique QR code with a random salt
async function generateQRCode(billingData) {
    const { _id, parkingID, entryTime } = billingData;

    // Generate a random salt (could be timestamp or UUID)
    const salt = crypto.randomBytes(8).toString("hex");

    // Combine _id with the salt to generate a unique hash
    const hash = crypto.createHash('sha256')
        .update(_id.toString() + salt)
        .digest('hex');

    // Generate the QR code with the hash and other details
    const qrData = { parkingID, entryTime, billingHash: hash };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Return the QR code and billing hash (for storing in DB)
    return { qrCode, billingHash: hash };
}

module.exports = generateQRCode;
