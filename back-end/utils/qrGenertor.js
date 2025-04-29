
const Jimp = require('jimp');
const jsQR = require('jsqr');


const QRCode = require('qrcode');

// Function to generate a QR Code with parking ID and name
const generateQRCode123 = async (parkingID, name) => {
    try {

        // console.log("Generating QR code for:", parkingID, name);
        const qrCodeData = await QRCode.toDataURL(`${parkingID}:${name}`);
        return qrCodeData;
    } catch (error) {
        throw new Error("Failed to generate QR code");
    }
};







async function generateQR(data) {
    try {
        return await QRCode.toDataURL(JSON.stringify(data));
    } catch (error) {
        throw new Error("QR Code Generation Failed");
    }
}

module.exports = { generateQR,generateQRCode123 };