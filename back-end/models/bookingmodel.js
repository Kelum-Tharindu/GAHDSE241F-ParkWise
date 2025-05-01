const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  usageFee: { type: Number, required: true },
  bookingFee: { type: Number, required: true },
  totalFee: { type: Number, required: true }
}, { _id: false });

const ExitedBookingTimeSchema = new mongoose.Schema({
  extraTime: { type: String }, // e.g., "00:30:00"
  extraTimeFee: { type: Number, default: 0 },
  exitTime: { type: Date }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  parkingName: { type: String, required: true }, // Changed from parkingName to parkingName
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, required: true },
  vehicleType: { type: String, enum: ['car', 'bicycle', 'truck'], required: true }, 
  entryTime: { type: Date },
  exitTime: { type: Date },
  fee: { type: FeeSchema, required: true, default: () => ({ usageFee: 0, bookingFee: 0, totalFee: 0 }) },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  bookingState: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  exitedBookingTime: {
    type: ExitedBookingTimeSchema,
    default: null
  },
  qrImage: { type: String },
  totalDuration: { type: String },
  billingHash: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
