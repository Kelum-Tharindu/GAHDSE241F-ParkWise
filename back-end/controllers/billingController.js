const Billing = require("../models/BillingModel");
const generateQRCode = require("../utils/qrGenertor");

// ✅ Entry: Generate QR and save to MongoDB with billing hash
exports.createEntry = async (req, res) => {
    try {
        const { parkingID } = req.body;
        if (!parkingID) {
            return res.status(400).json({ error: "Parking ID is required" });
        }

        const entryTime = new Date();

        // Create a new billing document
        const newBilling = new Billing({ parkingID, entryTime });

        // Generate QR Code and Billing Hash
        const { qrCode, billingHash } = await generateQRCode(newBilling);
        newBilling.qrCode = qrCode;
        newBilling.billingHash = billingHash;

        console.log(`🟢 New Billing Entry: ${billingHash}`); // Debugging

        // Save to MongoDB
        await newBilling.save();

        res.status(201).json({ message: "Entry recorded", qrCode, billingHash, entryTime });
    } catch (error) {
        console.error("❌ Error in createEntry:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Exit: Scan the QR, check payment status, and calculate fee
exports.processExit = async (req, res) => {
    try {
        const { qrCode } = req.body; // Scanned QR

        if (!qrCode) {
            return res.status(400).json({ error: "QR code is required" });
        }

        // Check if the QR code is a valid base64-encoded string
        const base64Pattern = /^data:image\/png;base64,/;
        if (!base64Pattern.test(qrCode)) {
            return res.status(400).json({ error: "Invalid QR code format" });
        }

        // Remove the prefix `data:image/png;base64,` to extract the base64 data
        const base64Data = qrCode.replace(base64Pattern, "");

        // Log the base64 data to check if it's correct
        console.log("Base64 Data:", base64Data);

        let decodedData;
        try {
            // Decode the base64 data into a JSON string
            decodedData = JSON.parse(Buffer.from(base64Data, "base64").toString());
        } catch (decodeError) {
            return res.status(400).json({ error: "Error decoding QR code" });
        }

        const { billingHash } = decodedData;

        // Find the billing record by billingHash
        const billingRecord = await Billing.findOne({ billingHash });

        if (!billingRecord) {
            return res.status(404).json({ error: "No billing record found" });
        }

        // If payment is already completed, return a message
        if (billingRecord.paymentState === "completed") {
            return res.status(200).json({ message: "Payment already completed." });
        }

        // Calculate fee ($2 per hour)
        const exitTime = new Date();
        const duration = (exitTime - new Date(billingRecord.entryTime)) / (1000 * 60 * 60);
        const fee = Math.ceil(duration) * 2;

        // Update the billing record with exit time and payment details
        billingRecord.exitTime = exitTime;
        billingRecord.fee = fee;
        billingRecord.duration = duration;
        billingRecord.paymentState = "completed";
        await billingRecord.save();

        console.log(`🟢 Payment Completed for ${billingHash}: $${fee}`); // Debugging

        res.status(200).json({ message: "Exit recorded. Payment completed.", fee, duration });
    } catch (error) {
        console.error("❌ Error in processExit:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
