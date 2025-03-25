const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const managerSchema = new mongoose.Schema({
  // Core References
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  
  // Business Details
  businessName: {
    type: String,
    trim: true
  },
  businessId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  businessType: {
    type: String,
    enum: ['individual', 'agency', 'fleet'],
    default: 'individual'
  },
  
  // Financial Information
  paymentMethods: [{
    methodType: { type: String, enum: ['bank', 'card', 'digital'] },
    details: mongoose.Schema.Types.Mixed,
    isDefault: Boolean
  }],
  financials: {
    totalPurchased: { type: Number, default: 0 }, // Total spent buying slots
    totalSold: { type: Number, default: 0 },      // Total earned reselling
    availableBalance: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 }
  },
  
  // Inventory Management
  ownedSlots: [{
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot' },
    purchaseDate: Date,
    purchasePrice: Number,
    currentPrice: Number,
    status: { type: String, enum: ['available', 'leased', 'maintenance'] }
  }],
  slotGroups: [{
    name: String,
    slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot' }],
    pricingStrategy: String,
    discountRate: Number
  }],
  
  // Resale Settings
  markupPercentage: {
    type: Number,
    default: 20,
    min: 0,
    max: 100
  },
  autoReprice: {
    enabled: Boolean,
    algorithm: String, // 'demand', 'time', 'fixed'
    parameters: mongoose.Schema.Types.Mixed
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    documentType: String,
    documentUrl: String,
    verified: Boolean,
    verifiedAt: Date
  }],
  
  // Activity Tracking
  lastActive: Date,
  activityLog: [{
    action: String,
    timestamp: Date,
    details: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for populated slots
managerSchema.virtual('slots', {
  ref: 'ParkingSlot',
  localField: 'ownedSlots.slot',
  foreignField: '_id',
  justOne: false
});

// Virtual for current available slots
managerSchema.virtual('availableSlots', {
  ref: 'ParkingSlot',
  localField: 'ownedSlots.slot',
  foreignField: '_id',
  match: { 'ownedSlots.status': 'available' },
  justOne: false
});

// Pre-save hook for financial calculations
managerSchema.pre('save', function(next) {
  if (this.isModified('ownedSlots')) {
    this.financials.totalPurchased = this.ownedSlots.reduce(
      (sum, slot) => sum + (slot.purchasePrice || 0), 0
    );
  }
  next();
});

// Generate JWT token
managerSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      user: this.user,
      role: 'manager',
      company: this.company
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Add new slot to inventory
managerSchema.methods.addSlot = async function(slotId, purchasePrice) {
  this.ownedSlots.push({
    slot: slotId,
    purchaseDate: new Date(),
    purchasePrice,
    currentPrice: purchasePrice * (1 + this.markupPercentage/100),
    status: 'available'
  });
  
  await this.save();
  return this;
};

// Resell slot with markup
managerSchema.methods.resellSlot = async function(slotId, newPrice) {
  const slotIndex = this.ownedSlots.findIndex(s => s.slot.equals(slotId));
  if (slotIndex === -1) throw new Error('Slot not found in inventory');
  
  this.ownedSlots[slotIndex].currentPrice = newPrice;
  this.ownedSlots[slotIndex].status = 'available';
  
  await this.save();
  return this.ownedSlots[slotIndex];
};

// Record sale transaction
managerSchema.methods.recordSale = async function(slotId, salePrice) {
  const slotIndex = this.ownedSlots.findIndex(s => s.slot.equals(slotId));
  if (slotIndex === -1) throw new Error('Slot not found in inventory');
  
  this.ownedSlots[slotIndex].status = 'leased';
  this.financials.totalSold += salePrice;
  this.financials.availableBalance += salePrice;
  
  await this.save();
  return this;
};

// Withdraw funds
managerSchema.methods.withdrawFunds = async function(amount, methodId) {
  if (amount > this.financials.availableBalance) {
    throw new Error('Insufficient balance');
  }
  
  this.financials.availableBalance -= amount;
  this.financials.totalWithdrawn += amount;
  
  this.activityLog.push({
    action: 'withdrawal',
    timestamp: new Date(),
    details: { amount, methodId }
  });
  
  await this.save();
  return this;
};

// Static method to find managers by location
managerSchema.statics.findByLocation = async function(locationId) {
  return this.find({ 'ownedSlots.slot': locationId })
    .populate({
      path: 'ownedSlots.slot',
      match: { location: locationId }
    });
};

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;