const mongoose = require('mongoose');

const parkingLocationSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landowner',
    required: true
  },
  totalSlots: Number,
  features: [String], // e.g., ['security', 'covered', 'lighting']
  operatingHours: {
    open: String,
    close: String,
    days: [String] // ['mon', 'tue', ...]
  },
  photos: [String], // URLs to photos
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('ParkingLocation', parkingLocationSchema);