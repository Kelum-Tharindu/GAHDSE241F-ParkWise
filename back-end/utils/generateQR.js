const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const twofaQR = async (userEmail, secret) => {
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

module.exports = twofaQR; // Default export