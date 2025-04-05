const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    parkingID: { type: String, required: true },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date },
    duration: { type: Number }, // Duration in minutes
    fee: { type: Number }, // Calculated fee based on duration
    billingHash: { type: String, required: true },
    paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" }
});

module.exports = mongoose.model("Billing", billingSchema);
