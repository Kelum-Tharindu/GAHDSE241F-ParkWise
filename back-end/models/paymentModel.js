const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  // Common fields
  paymentId: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['customer', 'landowner'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // Amount in LKR
  method: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Paid'], required: true },
  
  // Customer-specific fields
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  spot: { type: String }, // For customers: specific parking spot
  
  // Landowner-specific fields
  spaces: { type: Number }, // For landowners: number of spaces
  periodStart: { type: Date }, // For landowner payouts: period start
  periodEnd: { type: Date }, // For landowner payouts: period end
  
  // Accounting and reference
  description: { type: String },
  reference: { type: String }, // Reference to external payment system
  adminNotes: { type: String }
}, { timestamps: true });

// Create indexes for frequent queries
PaymentSchema.index({ userId: 1, date: -1 });
PaymentSchema.index({ userType: 1, status: 1 });
PaymentSchema.index({ paymentId: 1 });

module.exports = mongoose.model('Payment', PaymentSchema); 