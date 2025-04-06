const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parkingID: { type: String, required: true },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  duration: { type: Number }, // in minutes
  fee: { type: Number },
  billingHash: { type: String, required: true },
  qrImage: { type: String }, // 🆕 base64-encoded PNG image
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }
});

module.exports = mongoose.model("Billing", billingSchema);
