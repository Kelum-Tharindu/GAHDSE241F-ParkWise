const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    parkingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true }, // Reference to Parking model
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }, // Reference to Transaction model
    entryTime: { type: Date, required: true },
    exitTime: { type: Date },
    vehicleType: { type: String, default: "car" }, // Vehicle type with default as "car"
    duration: { type: Number }, // Duration in minutes
    fee: { type: Number }, // Calculated fee based on duration
    billingHash: { type: String, required: true },
    paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
    qrImage: { type: String } // Data URL or image path for QR code
});

// Fix for OverwriteModelError in development (prevents redefining model)
module.exports = mongoose.models.Billing || mongoose.model("Billing", billingSchema);
