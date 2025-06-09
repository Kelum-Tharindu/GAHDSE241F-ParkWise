const mongoose = require('mongoose');

const SubBulkBookingSchema = new mongoose.Schema({
  bulkBookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BulkBookingChunk', 
    required: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  assignedSpots: {
    type: Number,
    required: true,
    min: 1
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validTo: { 
    type: Date, 
    required: true 
  },
  qrCode: {
    type: String,
    default: ''
  },
  lastAccessDate: {
    type: Date,
    default: null
  },
  usageTime: {
    type: Number,
    default: 0,
    comment: 'Usage time in hours'
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Suspended', 'FullyUsed'],
    default: 'Active'
  },
  parkingLocation: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    default: '',
    comment: 'Hash value for data verification and security'
  },
  notes: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Index for better query performance
SubBulkBookingSchema.index({ ownerId: 1, status: 1 });
SubBulkBookingSchema.index({ customerId: 1 });
SubBulkBookingSchema.index({ bulkBookingId: 1 });

// Virtual to check if assignment is currently valid
SubBulkBookingSchema.virtual('isCurrentlyValid').get(function() {
  const now = new Date();
  return now >= this.validFrom && now <= this.validTo && this.status === 'Active';
});

// Pre-save middleware to validate dates against bulk booking
SubBulkBookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('validFrom') || this.isModified('validTo') || this.isModified('bulkBookingId')) {
    try {
      const BulkBookingChunk = mongoose.model('BulkBookingChunk');
      const bulkBooking = await BulkBookingChunk.findById(this.bulkBookingId);
      
      if (!bulkBooking) {
        return next(new Error('Referenced bulk booking not found'));
      }
      
      // Validate that sub booking dates are within bulk booking dates
      if (this.validFrom < bulkBooking.validFrom || this.validTo > bulkBooking.validTo) {
        return next(new Error('Sub booking dates must be within bulk booking valid period'));
      }
      
      // Auto-update status based on dates
      const now = new Date();
      if (now > this.validTo) {
        this.status = 'Expired';
      } else if (now >= this.validFrom && now <= this.validTo) {
        this.status = 'Active';
      }
      
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('SubBulkBooking', SubBulkBookingSchema);
