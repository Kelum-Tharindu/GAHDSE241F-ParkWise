
const mongoose = require('mongoose');
const LandOwner = require('./LandOwner');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['booking', 'billing', 'bulkbooking', 'admin'],
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: function() { return this.type === 'booking'; }
  },
  billingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billing',
    required: function() { return this.type === 'billing'; }
  },
  bulkBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BulkBookingChunk',
    required: function() { return this.type === 'bulkbooking'; }
  },  LandOwnerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'landowner',
    required: function() { return this.type === 'landowner'; }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type === 'booking'; }
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
