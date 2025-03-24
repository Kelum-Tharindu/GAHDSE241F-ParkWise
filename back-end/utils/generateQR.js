const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// Function to generate a QR code for 2FA
const generate2FAQRCode = async (userEmail, secret) => {
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `ParkBooking:${userEmail}`,
    issuer: "ParkBooking",
  });

  return new Promise((resolve, reject) => {
    qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        reject(new Error("Error generating 2FA QR code"));
      } else {
        resolve(dataUrl);
      }
    });
  });
};

module.exports = generate2FAQRCode;