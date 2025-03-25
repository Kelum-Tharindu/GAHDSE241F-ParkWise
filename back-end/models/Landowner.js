const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const landownerSchema = new mongoose.Schema({
  // Basic Information
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  companyName: {
    type: String,
    trim: true
  },
  taxId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Allows null values but enforces uniqueness for non-null values
  },
  
  // Contact Information
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Bank Details for Payouts
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    branchCode: String,
    swiftCode: String
  },
  
  // Parking Business Details
  parkingLocations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLocation'
  }],
  totalSlots: {
    type: Number,
    default: 0
  },
  availableSlots: {
    type: Number,
    default: 0
  },
  
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    documentType: String, // e.g., 'business_license', 'tax_certificate'
    documentUrl: String,
    verified: Boolean,
    verifiedAt: Date
  }],
  
  // Settings
  autoApproveBookings: {
    type: Boolean,
    default: true
  },
  notificationPreferences: {
    email: Boolean,
    sms: Boolean,
    push: Boolean
  },
  
  // Financials
  earnings: {
    totalEarned: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for populated slots
landownerSchema.virtual('slots', {
  ref: 'ParkingSlot',
  localField: '_id',
  foreignField: 'ownerId',
  justOne: false
});

// Virtual for populated bookings
landownerSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'landowner',
  justOne: false
});

// Pre-save hook to update slot counts
landownerSchema.pre('save', async function(next) {
  if (this.isModified('parkingLocations')) {
    const slotCount = await mongoose.model('ParkingSlot').countDocuments({
      ownerType: 'landowner',
      ownerId: this._id
    });
    this.totalSlots = slotCount;
    this.availableSlots = await mongoose.model('ParkingSlot').countDocuments({
      ownerType: 'landowner',
      ownerId: this._id,
      status: 'available'
    });
  }
  next();
});

// Generate JWT token for landowners
landownerSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      user: this.user,
      role: 'landowner'
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Method to verify document
landownerSchema.methods.verifyDocument = function(documentType) {
  const docIndex = this.verificationDocuments.findIndex(doc => doc.documentType === documentType);
  if (docIndex !== -1) {
    this.verificationDocuments[docIndex].verified = true;
    this.verificationDocuments[docIndex].verifiedAt = new Date();
  }
  
  // Check if all required docs are verified
  if (this.verificationDocuments.every(doc => doc.verified)) {
    this.isVerified = true;
  }
  
  return this.save();
};

// Method to add earnings
landownerSchema.methods.addEarnings = function(amount) {
  this.earnings.totalEarned += amount;
  this.earnings.availableBalance += amount;
  return this.save();
};

// Method to withdraw funds
landownerSchema.methods.withdrawFunds = function(amount) {
  if (amount > this.earnings.availableBalance) {
    throw new Error('Insufficient balance');
  }
  
  this.earnings.availableBalance -= amount;
  this.earnings.totalWithdrawn += amount;
  return this.save();
};

// Static method to find by location
landownerSchema.statics.findByLocation = async function(locationId) {
  return this.find({ parkingLocations: locationId }).populate('parkingLocations');
};

const Landowner = mongoose.model('Landowner', landownerSchema);

module.exports = Landowner;