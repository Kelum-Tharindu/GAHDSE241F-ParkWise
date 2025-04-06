const Billing = require("../models/billingmodel");
const crypto = require("crypto");
const QRCode = require("qrcode");

exports.createBilling = async (req, res) => {
  try {
    const { parkingID, userID } = req.body;

    if (!parkingID || !userID) {
      return res.status(400).json({ error: "parkingID and userID are required" });
    }

    const entryTime = new Date();

    // Generate hash
    const hashString = `${parkingID}_${userID}_${entryTime.toISOString()}`;
    const billingHash = crypto.createHash("sha256").update(hashString).digest("hex");

    // QR payload
    const qrPayload = {
      parkingID,
      entryTime,
      billingHash
    };

    const qrText = JSON.stringify(qrPayload);

    // Generate QR image as base64
    const qrImage = await QRCode.toDataURL(qrText);

    // Save billing with QR image
    const newBilling = new Billing({
      userID,
      parkingID,
      entryTime,
      billingHash,
      qrImage // 🆕 base64 stored here
    });

    const savedBilling = await newBilling.save();

    res.status(201).json({
      message: "Billing created with QR image stored",
      billing: savedBilling
    });

  } catch (error) {
    console.error("Error creating billing:", error);
    res.status(500).json({ error: "Server error" });
  }
};
