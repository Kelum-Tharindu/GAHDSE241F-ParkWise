const Billing = require("../models/billingModel");
const Transaction = require("../models/transactionModel");
const crypto = require("crypto");
const QRCode = require("qrcode");
const mongoose = require("mongoose");

exports.createBilling = async (req, res) => {  try {
    console.log("🛠️ createBilling function called");
    const { parkingID, userID, vehicleType } = req.body;
    console.log("📥 Received data:", { parkingID, userID, vehicleType });if (!parkingID || typeof parkingID !== "string" || parkingID.trim() === "") {
      console.error("❌ Validation Error: Missing or invalid parkingID");
      return res.status(400).json({ error: "Invalid parkingID" });
    }
    
    // Validate if parkingID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(parkingID)) {
      console.error("❌ Validation Error: parkingID is not a valid ObjectId");
      return res.status(400).json({ error: "Invalid parkingID format" });
    }if (!userID || typeof userID !== "string" || userID.trim() === "") {
      console.error("❌ Validation Error: Missing or invalid userID");
      return res.status(400).json({ error: "Invalid userID" });
    }
    
    // Validate if userID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      console.error("❌ Validation Error: userID is not a valid ObjectId");
      return res.status(400).json({ error: "Invalid userID format" });
    }    console.log("✅ Input validated: parkingID and userID received");

    const nowUTC = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000;
    const entryTime = new Date(nowUTC.getTime() + sriLankaOffset);
    console.log("🕒 Entry time (SLST):", entryTime.toISOString());    // Create a JSON object for hash source
    const hashData = {
      type: "billing",
      parkingID: parkingID,
      userID: userID,
      vehicleType: vehicleType || "car",
      entryTime: entryTime.toISOString()
    };
    
    // Convert to JSON string for hashing
    const hashSource = JSON.stringify(hashData);
    const billingHash = crypto.createHash("sha256").update(hashSource).digest("hex");
    console.log("🔐 Billing hash generated:", billingHash);    const qrPayload = {
      type: "billing",
      parkingID: parkingID,
      userID: userID,
      vehicleType: vehicleType || "car",
      entryTime: entryTime,
      billingHash: billingHash
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));
    if (!qrImage) {
      console.error("❌ QR code generation failed");
      return res.status(500).json({ error: "Failed to generate QR code" });
    }    console.log("✅ QR code generated");
    console.log("📸 QR code image data URL:", qrImage);    
    
    // Create billing object with proper ObjectId conversion and include vehicleType
    const billing = new Billing({
      parkingID:   parkingID,
      userID:   userID,
      vehicleType: vehicleType || "car", // Use provided vehicle type or default to "car"
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

    // Create a transaction record linked to the billing
    try {      const transaction = new Transaction({
        type: 'billing',
        billingId: saved._id,
        userId:  userID,
        amount: saved.fee || 0, // Use fee from billing if available, otherwise 0
        method: 'pending', // Will be updated when payment is processed
        status: 'Pending'
      });const savedTransaction = await transaction.save();
      console.log("💰 Transaction record created:", savedTransaction._id);

      // Update the billing record with the transaction ID
      saved.transactionId = savedTransaction._id;
      await saved.save();
      console.log("🔄 Billing record updated with transaction ID");

      res.status(201).json({ 
        billing: saved,
        transaction: savedTransaction 
      });
    } catch (transErr) {
      console.error("❌ Error creating transaction record:", transErr.message);
      // Still return the billing info even if transaction creation fails
      res.status(201).json({ 
        billing: saved,
        transactionError: "Failed to create transaction record"
      });
    }

  } catch (err) {
    console.error("❌ Error in createBilling:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
