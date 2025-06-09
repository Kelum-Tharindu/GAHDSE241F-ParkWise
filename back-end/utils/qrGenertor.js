const Jimp = require('jimp');
const jsQR = require('jsqr');


const QRCode = require('qrcode');

// Function to generate a QR Code with parking ID and name
const generateQRCode123 = async (parkingID, name) => {
    try {
        // Generate QR code as a JSON string for better compatibility
        const qrContent = JSON.stringify({ parkingID, name });
        const qrCodeData = await QRCode.toDataURL(qrContent);
        return qrCodeData;
    } catch (error) {
        throw new Error("Failed to generate QR code");
    }
};







async function generateQR(data) {
    try {
        // If data is a string, assume it's already formatted correctly
        // Otherwise, format it as a JSON object with type and billingHash
        const qrContent = typeof data === 'string' 
            ? data 
            : JSON.stringify({
                type: data.type || 'booking',
                billingHash: data.billingHash || data,
                parkingName: data.parkingName,
                userId: data.userId,
                EntryTime: new Date().toISOString()
              });
              
        console.log('Generating QR with data:', qrContent);
        return await QRCode.toDataURL(qrContent);
    } catch (error) {
        console.error("QR Generation Error:", error);
        throw new Error("QR Code Generation Failed");
    }
}

module.exports = { generateQR,generateQRCode123 };