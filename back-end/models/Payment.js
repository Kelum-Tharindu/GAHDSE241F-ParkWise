const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const paymentSchema = new mongoose.Schema({
  // Core References
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payer: {
    type: String,
    enum: ['user', 'company', 'manager', 'system'],
    required: true
  },

  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'wallet', 'bank_transfer', 'cash', 'company_credit', 'voucher'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay', 'square', 'manual', 'none'],
    default: 'none'
  },

  // Transaction Information
  transactionId: {
    type: String,
    index: true
  },
  gatewayResponse: mongoose.Schema.Types.Mixed,
  invoiceNumber: String,
  receiptUrl: String,

  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded', 'disputed'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedAt: Date,
    reason: String
  }],

  // Financial Breakdown
  baseAmount: Number,
  taxes: [{
    name: String,
    amount: Number
  }],
  fees: [{
    name: String,
    amount: Number,
    receiver: String // 'platform', 'landowner', 'manager'
  }],
  netAmount: Number, // Amount after fees/taxes
  recipientAmount: Number, // Final amount to recipient

  // Recipient Information
  recipientType: {
    type: String,
    enum: ['landowner', 'manager', 'platform', 'company'],
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientType'
  },

  // Metadata
  description: String,
  notes: String,
  ipAddress: String,
  deviceInfo: mongoose.Schema.Types.Mixed,

  // Refund Information
  refunds: [{
    amount: Number,
    reason: String,
    processedAt: Date,
    processedBy: mongoose.Schema.Types.ObjectId,
    gatewayResponse: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pagination plugin
paymentSchema.plugin(mongoosePaginate);

// Indexes for performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ recipient: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'statusHistory.changedAt': -1 });

// Virtual for total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
});

// Virtual for isRefundable
paymentSchema.virtual('isRefundable').get(function() {
  return ['completed', 'partially_refunded'].includes(this.status) && 
         (this.totalRefunded < this.amount);
});

// Pre-save hooks
paymentSchema.pre('save', function(next) {
  // Set default netAmount if not specified
  if (this.isModified('amount') && !this.netAmount) {
    this.netAmount = this.amount;
  }

  // Update status history
  if (this.isModified('status')) {
    this.statusHistory = this.statusHistory || [];
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      reason: this.status === 'failed' ? this.gatewayResponse?.message : undefined
    });
  }

  next();
});

// Static Methods
paymentSchema.statics.createForBooking = async function(booking, paymentData) {
  const Payment = this;
  
  // Calculate fees (example: 10% platform fee)
  const platformFee = booking.totalAmount * 0.10;
  const recipientAmount = booking.totalAmount - platformFee;

  const payment = new Payment({
    booking: booking._id,
    user: booking.user,
    payer: 'user',
    amount: booking.totalAmount,
    baseAmount: booking.basePrice,
    taxes: [], // Would be calculated based on location
    fees: [{
      name: 'Platform Fee',
      amount: platformFee,
      receiver: 'platform'
    }],
    netAmount: booking.totalAmount,
    recipientAmount,
    recipientType: booking.landowner ? 'landowner' : booking.manager ? 'manager' : 'platform',
    recipient: booking.landowner || booking.manager || null,
    paymentMethod: paymentData.method,
    paymentGateway: paymentData.gateway,
    description: `Parking booking #${booking._id.toString().slice(-6)}`,
    ...paymentData
  });

  await payment.save();
  return payment;
};

paymentSchema.statics.createCompanyBulkPayment = async function(companyId, bookings, paymentData) {
  const Payment = this;
  const totalAmount = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  const payment = new Payment({
    user: companyId,
    payer: 'company',
    amount: totalAmount,
    paymentMethod: 'company_credit',
    description: `Monthly parking for ${bookings.length} bookings`,
    recipientType: 'platform',
    status: 'completed', // Company payments are typically post-paid
    ...paymentData
  });

  await payment.save();
  
  // Link bookings to this payment
  await mongoose.model('Booking').updateMany(
    { _id: { $in: bookings.map(b => b._id) } },
    { payment: payment._id, paymentStatus: 'paid' }
  );

  return payment;
};

// Instance Methods
paymentSchema.methods.processRefund = async function(refundData) {
  if (!this.isRefundable) {
    throw new Error('Payment is not refundable');
  }

  const maxRefundable = this.amount - this.totalRefunded;
  if (refundData.amount > maxRefundable) {
    throw new Error(`Cannot refund more than ${maxRefundable}`);
  }

  // In production: Call payment gateway API here
  const refundResponse = {
    success: true,
    refundId: `ref_${Date.now()}`
  };

  this.refunds.push({
    amount: refundData.amount,
    reason: refundData.reason,
    processedAt: new Date(),
    processedBy: refundData.processedBy,
    gatewayResponse: refundResponse
  });

  if (refundData.amount === maxRefundable) {
    this.status = 'refunded';
  } else {
    this.status = 'partially_refunded';
  }

  await this.save();
  
  // Update linked booking if exists
  if (this.booking) {
    await mongoose.model('Booking').findByIdAndUpdate(
      this.booking,
      { paymentStatus: 'refunded' }
    );
  }

  return this;
};

paymentSchema.methods.addDispute = async function(disputeData) {
  if (this.status !== 'completed') {
    throw new Error('Only completed payments can be disputed');
  }

  this.status = 'disputed';
  this.statusHistory.push({
    status: 'disputed',
    changedAt: new Date(),
    reason: disputeData.reason
  });

  await this.save();
  return this;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;