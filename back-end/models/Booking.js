const mongoose = require('mongoose');
const moment = require('moment');

const bookingSchema = new mongoose.Schema({
  // Core References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: true
  },

  // Booking Details
  bookingType: {
    type: String,
    enum: ['instant', 'reservation', 'company', 'recurring', 'visitor'],
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  actualArrival: Date,
  actualDeparture: Date,

  // Pricing Information
  basePrice: {
    type: Number,
    required: true
  },
  dynamicPricing: {
    multiplier: Number,
    reason: String  // 'peak', 'event', 'demand'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    code: String,
    amount: Number,
    description: String
  },

  // Payment Status
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'free'],
    default: 'pending'
  },

  // Booking Status
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled', 'no-show'],
    default: 'upcoming'
  },
  cancellationReason: String,

  // Special Cases
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager'
  },
  landowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landowner'
  },

  // Vehicle Information
  vehicle: {
    make: String,
    model: String,
    color: String,
    licensePlate: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    }
  },

  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'kiosk', 'api', 'admin'],
    default: 'mobile'
  },
  notes: String,
  qrCode: String,
  checkInCode: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for booking duration in hours
bookingSchema.virtual('durationHours').get(function() {
  return moment(this.endTime).diff(moment(this.startTime), 'hours');
});

// Virtual for isActive
bookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startTime <= now && this.endTime >= now && this.status === 'active';
});

// Indexes for performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ slot: 1 });
bookingSchema.index({ startTime: 1, endTime: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'vehicle.licensePlate': 1 });
bookingSchema.index({ company: 1 });
bookingSchema.index({ createdAt: 1 });

// Pre-save hooks
bookingSchema.pre('save', function(next) {
  // Auto-set total amount if not set
  if (this.isModified('basePrice') || this.isModified('dynamicPricing') || this.isModified('discount')) {
    const multiplier = this.dynamicPricing?.multiplier || 1;
    const discount = this.discount?.amount || 0;
    this.totalAmount = (this.basePrice * multiplier) - discount;
  }

  // Auto-set status based on timings
  if (this.isModified('startTime') || this.isModified('endTime') || this.isModified('status')) {
    const now = new Date();
    if (this.status === 'active' && this.endTime < now) {
      this.status = 'completed';
    }
  }

  next();
});

// Static Methods
bookingSchema.statics.findActiveBookings = function(slotId, date) {
  return this.find({
    slot: slotId,
    startTime: { $lte: date },
    endTime: { $gte: date },
    status: { $in: ['upcoming', 'active'] }
  });
};

bookingSchema.statics.findConflictingBookings = function(slotId, startTime, endTime, excludeId = null) {
  const query = {
    slot: slotId,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime: { $gte: startTime, $lt: endTime } }
    ],
    status: { $nin: ['cancelled', 'completed'] }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return this.find(query);
};

// Instance Methods
bookingSchema.methods.checkIn = function() {
  if (this.status !== 'upcoming') {
    throw new Error('Only upcoming bookings can be checked in');
  }

  this.actualArrival = new Date();
  this.status = 'active';
  return this.save();
};

bookingSchema.methods.checkOut = function() {
  if (this.status !== 'active') {
    throw new Error('Only active bookings can be checked out');
  }

  this.actualDeparture = new Date();
  this.status = 'completed';
  return this.save();
};

bookingSchema.methods.cancel = function(reason = 'User cancelled') {
  if (!['upcoming', 'active'].includes(this.status)) {
    throw new Error('Cannot cancel a completed or already cancelled booking');
  }

  this.status = 'cancelled';
  this.cancellationReason = reason;
  return this.save();
};

bookingSchema.methods.extend = async function(additionalMinutes) {
  if (!this.isActive) {
    throw new Error('Only active bookings can be extended');
  }

  this.endTime = moment(this.endTime).add(additionalMinutes, 'minutes').toDate();
  
  // Recalculate pricing
  const extensionPrice = await this.calculateExtensionPrice(additionalMinutes);
  this.totalAmount += extensionPrice;
  
  await this.save();
  return this;
};

bookingSchema.methods.calculateExtensionPrice = async function(minutes) {
  const hours = minutes / 60;
  const slot = await mongoose.model('ParkingSlot').findById(this.slot);
  
  // Get current dynamic pricing if available
  const currentRate = slot.dynamicPricing?.currentRate || slot.hourlyRate;
  
  return currentRate * hours;
};

// Query Helpers
bookingSchema.query.byUser = function(userId) {
  return this.where({ user: userId });
};

bookingSchema.query.bySlot = function(slotId) {
  return this.where({ slot: slotId });
};

bookingSchema.query.active = function() {
  const now = new Date();
  return this.where({
    startTime: { $lte: now },
    endTime: { $gte: now },
    status: 'active'
  });
};

bookingSchema.query.upcoming = function() {
  const now = new Date();
  return this.where({
    startTime: { $gt: now },
    status: 'upcoming'
  });
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;