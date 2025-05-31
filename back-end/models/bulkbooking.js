const mongoose = require('mongoose');

const BulkBookingChunkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseDate: { type: Date, required: true },
  parkingName: { type: String, required: true },
  chunkName: { type: String, required: true },
  company: { type: String, required: true },
  totalSpots: { type: Number, required: true },
  usedSpots: { type: Number, required: true },
  availableSpots: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Full'], required: true },
  remarks: { type: String, default: '' },
  qrImage: { type: String },
  vehicleType: { type: String, enum: ['car', 'bicycle', 'truck'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('BulkBookingChunk', BulkBookingChunkSchema);
