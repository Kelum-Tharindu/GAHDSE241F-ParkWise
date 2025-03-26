const Billing = require("../models/BillingModel");
const generateQRCode = require("../utils/qrGenertor");

// Entry: Generate QR and save to MongoDB with billing hash
exports.createEntry = async (req, res) => {
    try {
        const { parkingID } = req.body;
        const entryTime = new Date();

        // Create a new billing document (without saving yet)
        const newBilling = new Billing({
            parkingID,
            entryTime,
        });

        // Generate QR Code and Billing Hash
        const { qrCode, billingHash } = await generateQRCode(newBilling);

        // Save entry details along with the generated QR code and hash
        newBilling.qrCode = qrCode;
        newBilling.billingHash = billingHash;
        //print hash to console
        console.log(billingHash);

        // Save to MongoDB
        await newBilling.save();

        res.status(201).json({ message: "Entry recorded", qrCode, billingHash, entryTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exit: Scan the QR, check payment status, and calculate fee
exports.processExit = async (req, res) => {
    try {
        const { qrCode } = req.body; // Scanned QR

        if (!qrCode) {
            return res.status(400).json({ message: "QR code required" });
        }

        // Decode the QR code
        const decodedData = JSON.parse(Buffer.from(qrCode.split(",")[1], "base64").toString());
        const { billingHash } = decodedData;

        // Find the billing record by billingHash
        const billingRecord = await Billing.findOne({ billingHash });

        if (!billingRecord) {
            return res.status(404).json({ message: "No record found" });
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

        res.status(200).json({ message: "Exit recorded. Payment completed.", fee, duration });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
