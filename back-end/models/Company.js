const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema({
  // Core References
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Company Details
  legalName: {
    type: String,
    required: true,
    trim: true
  },
  tradingName: {
    type: String,
    trim: true
  },
  companyType: {
    type: String,
    enum: ['corporate', 'government', 'institution', 'other'],
    required: true
  },
  industry: String,
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  taxId: String,
  
  // Contact Information
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  
  // Parking Management
  allocatedSlots: [{
    slot: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ParkingSlot',
      required: true 
    },
    purchaseDate: Date,
    contractEndDate: Date,
    price: Number,
    status: {
      type: String,
      enum: ['active', 'expired', 'terminated'],
      default: 'active'
    }
  }],
  parkingPolicy: {
    allocationMethod: {
      type: String,
      enum: ['seniority', 'role', 'shift', 'hybrid'],
      default: 'role'
    },
    allowPersonalUse: Boolean,
    afterHoursAccess: Boolean
  },
  
  // Employee Management
  employees: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    employeeId: String,
    department: String,
    parkingTier: {
      type: String,
      enum: ['standard', 'priority', 'executive'],
      default: 'standard'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Financial Information
  billingDetails: {
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual'],
      default: 'monthly'
    },
    paymentMethod: {
      type: String,
      enum: ['credit', 'invoice', 'direct-debit'],
      default: 'invoice'
    },
    creditLimit: Number,
    outstandingBalance: {
      type: Number,
      default: 0
    }
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
  
  // Settings
  notificationPreferences: {
    bookingConfirmations: Boolean,
    contractAlerts: Boolean,
    billingReminders: Boolean,
    maintenanceUpdates: Boolean
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for active slots
companySchema.virtual('activeSlots', {
  ref: 'ParkingSlot',
  localField: 'allocatedSlots.slot',
  foreignField: '_id',
  match: { 'allocatedSlots.status': 'active' },
  justOne: false
});

// Virtual for employee count
companySchema.virtual('employeeCount').get(function() {
  return this.employees.filter(e => e.isActive).length;
});

// Virtual for utilization rate
companySchema.virtual('utilizationRate').get(function() {
  if (!this.allocatedSlots.length) return 0;
  const activeSlots = this.allocatedSlots.filter(s => s.status === 'active');
  return (activeSlots.length / this.allocatedSlots.length) * 100;
});

// Pre-save hook for coordinates
companySchema.pre('save', function(next) {
  if (this.isModified('address') && this.address.street) {
    // In production: Geocode address to get coordinates
    this.address.coordinates = [0, 0]; // Replace with real geocoding
  }
  next();
});

// Generate JWT token
companySchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      user: this.user,
      role: 'company',
      companyType: this.companyType
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Add new parking slot allocation
companySchema.methods.allocateSlot = async function(slotId, contractDetails) {
  this.allocatedSlots.push({
    slot: slotId,
    purchaseDate: new Date(),
    contractEndDate: contractDetails.endDate,
    price: contractDetails.price,
    status: 'active'
  });
  
  await this.save();
  return this;
};

// Assign slot to employee
companySchema.methods.assignToEmployee = async function(employeeId, slotId) {
  const booking = await this.model('Booking').create({
    user: employeeId,
    slot: slotId,
    startTime: new Date(),
    endTime: this.allocatedSlots.find(s => s.slot.equals(slotId)).contractEndDate,
    bookingType: 'company',
    status: 'active'
  });
  
  return booking;
};

// Bulk assign slots (for shift workers)
companySchema.methods.bulkAssign = async function(assignments) {
  const bookings = await Promise.all(
    assignments.map(async assignment => {
      return this.model('Booking').create({
        user: assignment.employeeId,
        slot: assignment.slotId,
        startTime: assignment.startTime,
        endTime: assignment.endTime,
        bookingType: 'company',
        status: 'active'
      });
    })
  );
  
  return bookings;
};

// Renew contract for slot
companySchema.methods.renewContract = async function(slotId, newEndDate, newPrice) {
  const slotIndex = this.allocatedSlots.findIndex(s => s.slot.equals(slotId));
  if (slotIndex === -1) throw new Error('Slot not allocated to company');
  
  this.allocatedSlots[slotIndex].contractEndDate = newEndDate;
  this.allocatedSlots[slotIndex].price = newPrice;
  
  await this.save();
  return this.allocatedSlots[slotIndex];
};

// Add employee to company
companySchema.methods.addEmployee = async function(userId, employeeData) {
  if (this.employees.some(e => e.user.equals(userId))) {
    throw new Error('Employee already exists');
  }
  
  this.employees.push({
    user: userId,
    employeeId: employeeData.employeeId,
    department: employeeData.department,
    parkingTier: employeeData.parkingTier || 'standard'
  });
  
  await this.save();
  return this;
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;