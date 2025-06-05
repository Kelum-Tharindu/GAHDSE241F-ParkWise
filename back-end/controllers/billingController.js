const Billing = require("../models/billingModel");
const crypto = require("crypto");
const QRCode = require("qrcode");

exports.createBilling = async (req, res) => {
  try {
    console.log("🛠️ createBilling function called");
    const { parkingID, userID } = req.body;
    console.log("📥 Received data:", { parkingID, userID });

    if (!parkingID || typeof parkingID !== "string" || parkingID.trim() === "") {
      console.error("❌ Validation Error: Missing or invalid parkingID");
      return res.status(400).json({ error: "Invalid parkingID" });
    }

    if (!userID || typeof userID !== "string" || userID.trim() === "") {
      console.error("❌ Validation Error: Missing or invalid userID");
      return res.status(400).json({ error: "Invalid userID" });
    }

    console.log("✅ Input validated: parkingID and userID received");

    const nowUTC = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000;
    const entryTime = new Date(nowUTC.getTime() + sriLankaOffset);
    console.log("🕒 Entry time (SLST):", entryTime.toISOString());

    const hashSource = `${parkingID}_${userID}_${entryTime.toISOString()}`;
    const billingHash = crypto.createHash("sha256").update(hashSource).digest("hex");
    console.log("🔐 Billing hash generated:", billingHash);

    const qrPayload = {
      parkingID,
      userID,
      createdTime: entryTime,
      billingHash,
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));
    if (!qrImage) {
      console.error("❌ QR code generation failed");
      return res.status(500).json({ error: "Failed to generate QR code" });
    }
    console.log("✅ QR code generated");
    console.log("📸 QR code image data URL:", qrImage);

    const billing = new Billing({
      parkingID,
      userID,
      entryTime,
      billingHash,
      qrImage,
    });

    const saved = await billing.save();
    if (!saved) {
      console.error("❌ Failed to save billing entry");
      return res.status(500).json({ error: "Failed to save billing entry" });
    }

    console.log("💾 Billing entry saved:", saved._id);

    res.status(201).json({ billing: saved });

  } catch (err) {
    console.error("❌ Error in createBilling:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
