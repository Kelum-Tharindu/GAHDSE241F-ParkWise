const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    parkingID: { type: String, required: true },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date },
    fee: { type: Number },
    duration: { type: Number }, // In hours
    paymentState: { type: String, default: "pending" },
    qrCode: { type: String, required: true },
    billingHash: { type: String, required: true, unique: true } // Unique billing hash
});

module.exports = mongoose.model("Billing", billingSchema);
