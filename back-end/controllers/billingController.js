const Billing = require("../models/billingModel");
const crypto = require("crypto");
const QRCode = require("qrcode");

exports.createBilling = async (req, res) => {
  try {
    const { parkingID, userID } = req.body;

    // ✅ Step 1: Validate input
    if (!parkingID || typeof parkingID !== "string" || parkingID.trim() === "") {
      console.error("❌ Validation Error: Missing or invalid parkingID");
      return res.status(400).json({ error: "Invalid parkingID" });
    }

    if (!userID || typeof userID !== "string" || userID.trim() === "") {
      console.error("❌ Validation Error: Missing or invalid userID");
      return res.status(400).json({ error: "Invalid userID" });
    }

    console.log("✅ Input validated: parkingID and userID received");

    // ✅ Step 2: Generate entry time
    const entryTime = new Date();
    console.log("🕒 Entry time:", entryTime.toISOString());

    // ✅ Step 3: Generate SHA-256 hash
    const hashSource = `${parkingID}_${userID}_${entryTime.toISOString()}`;
    const billingHash = crypto.createHash("sha256").update(hashSource).digest("hex");
    console.log("🔐 Billing hash generated:", billingHash);

    // ✅ Step 4: Create QR payload
    const qrPayload = {
      parkingID,
      userID,
      createdTime: entryTime,
      billingHash,
    };

    // ✅ Step 5: Generate QR Code image
    const qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));
    if (!qrImage) {
      console.error("❌ QR code generation failed");
      return res.status(500).json({ error: "Failed to generate QR code" });
    }
    console.log("✅ QR code generated");

    // ✅ Step 6: Save billing data
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

    // ✅ Step 7: Send success response
    res.status(201).json({ billing: saved });

  } catch (err) {
    console.error("❌ Error in createBilling:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
