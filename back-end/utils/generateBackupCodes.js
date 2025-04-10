const crypto = require("crypto");

// Generate an array of backup codes
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(6).toString("hex").toUpperCase(); // 12-character codes
    codes.push(code);
  }
  return codes;
};


module.exports = generateBackupCodes;