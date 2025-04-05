const Billing = require("../models/billingModel");
const { generateQR } = require("../utils/qrGenertor");

exports.entryScan = async (req, res) => {
    try {
        const { userID, parkingID } = req.body;

        if (!userID || !parkingID) {
            return res.status(400).json({ message: "User ID and Parking ID are required" });
        }

        const entryTime = new Date();
        const billingHash = `${userID}-${parkingID}-${entryTime.getTime()}`;

        const newBilling = new Billing({
            userID,
            parkingID,
            entryTime,
            billingHash,
        });

        await newBilling.save();

        const qrCode = await generateQR({ billingHash });

        res.status(201).json({ message: "Entry recorded", qrCode, billingHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.exitScan = async (req, res) => {
    try {
        const { billingHash } = req.body;

        const billing = await Billing.findOne({ billingHash });

        if (!billing || billing.exitTime) {
            return res.status(400).json({ message: "Invalid or already exited QR" });
        }

        const exitTime = new Date();
        const duration = Math.round((exitTime - billing.entryTime) / (1000 * 60)); 
        const fee = duration * 0.5;

        billing.exitTime = exitTime;
        billing.duration = duration;
        billing.fee = fee;
        billing.paymentStatus = "pending";
        await billing.save();

        res.status(200).json({ message: "Exit recorded", duration, fee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
