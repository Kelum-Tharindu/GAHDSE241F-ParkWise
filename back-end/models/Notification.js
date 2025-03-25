const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const notificationSchema = new mongoose.Schema({
  // Recipient Information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel'
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['User', 'Landowner', 'Manager', 'Company', 'Admin']
  },

  // Notification Content
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Reference to Related Entity
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedEntityModel'
  },
  relatedEntityModel: {
    type: String,
    enum: ['Booking', 'Payment', 'ParkingSlot', 'User', 'Review', null]
  },

  // Notification Metadata
  notificationType: {
    type: String,
    required: true,
    enum: [
      'booking_created',
      'booking_reminder',
      'booking_cancelled',
      'payment_success',
      'payment_failed',
      'slot_available',
      'promotional',
      'system_alert',
      'account_activity',
      'support_response'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // Delivery Information
  channels: [{
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    required: true
  }],
  deliveryStatus: [{
    channel: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'read'],
      default: 'pending'
    },
    deliveredAt: Date,
    readAt: Date,
    error: String
  }],

  // Expiration & Timing
  scheduledAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
  },

  // Status Tracking
  isArchived: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pagination plugin
notificationSchema.plugin(mongoosePaginate);

// Indexes for performance
notificationSchema.index({ recipient: 1, recipientModel: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ notificationType: 1 });
notificationSchema.index({ 'deliveryStatus.status': 1 });
notificationSchema.index({ isArchived: 1 });
notificationSchema.index({ scheduledAt: 1 });
notificationSchema.index({ expiresAt: 1 });

// Virtual for isRead
notificationSchema.virtual('isRead').get(function() {
  return this.deliveryStatus.some(
    ds => ds.channel === 'in_app' && ds.status === 'read'
  );
});

// Virtual for isDelivered
notificationSchema.virtual('isDelivered').get(function() {
  return this.deliveryStatus.every(
    ds => ['delivered', 'read'].includes(ds.status)
  );
});

// Pre-save hooks
notificationSchema.pre('save', function(next) {
  // Set default scheduledAt if not specified
  if (!this.scheduledAt) {
    this.scheduledAt = new Date();
  }

  // Initialize delivery status for each channel
  if (this.isModified('channels')) {
    this.deliveryStatus = this.channels.map(channel => ({
      channel,
      status: 'pending'
    }));
  }

  next();
});

// Static Methods
notificationSchema.statics.createBookingNotification = async function(booking, type) {
  const Notification = this;
  const messages = {
    booking_created: {
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.slot.location} is confirmed for ${booking.startTime}`
    },
    booking_reminder: {
      title: 'Upcoming Booking',
      message: `Reminder: Your parking at ${booking.slot.location} starts in 1 hour`
    },
    booking_cancelled: {
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.slot.location} has been cancelled`
    }
  };

  const notification = new Notification({
    recipient: booking.user,
    recipientModel: 'User',
    relatedEntity: booking._id,
    relatedEntityModel: 'Booking',
    notificationType: type,
    title: messages[type].title,
    message: messages[type].message,
    data: {
      bookingId: booking._id,
      slotId: booking.slot._id,
      startTime: booking.startTime,
      endTime: booking.endTime
    },
    channels: ['in_app', 'email'],
    priority: type === 'booking_reminder' ? 'high' : 'medium'
  });

  await notification.save();
  return notification;
};

notificationSchema.statics.createPaymentNotification = async function(payment, type) {
  const Notification = this;
  const messages = {
    payment_success: {
      title: 'Payment Successful',
      message: `Your payment of $${payment.amount} was processed successfully`
    },
    payment_failed: {
      title: 'Payment Failed',
      message: `Payment of $${payment.amount} failed. Please update your payment method`
    }
  };

  const notification = new Notification({
    recipient: payment.user,
    recipientModel: 'User',
    relatedEntity: payment._id,
    relatedEntityModel: 'Payment',
    notificationType: type,
    title: messages[type].title,
    message: messages[type].message,
    data: {
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      bookingId: payment.booking?._id
    },
    channels: ['in_app', 'email'],
    priority: 'high'
  });

  await notification.save();
  return notification;
};

// Instance Methods
notificationSchema.methods.markAsRead = function(channel = 'in_app') {
  const status = this.deliveryStatus.find(ds => ds.channel === channel);
  if (status) {
    status.status = 'read';
    status.readAt = new Date();
  }
  return this.save();
};

notificationSchema.methods.updateDeliveryStatus = function(channel, status, error = null) {
  const deliveryStatus = this.deliveryStatus.find(ds => ds.channel === channel);
  if (deliveryStatus) {
    deliveryStatus.status = status;
    deliveryStatus.deliveredAt = status === 'delivered' ? new Date() : undefined;
    deliveryStatus.error = error || undefined;
  }
  return this.save();
};

notificationSchema.methods.resend = function() {
  this.deliveryStatus.forEach(ds => {
    if (['failed', 'pending'].includes(ds.status)) {
      ds.status = 'pending';
      ds.error = undefined;
    }
  });
  return this.save();
};

// Query Helpers
notificationSchema.query.byRecipient = function(recipientId, recipientModel) {
  return this.where({ 
    recipient: recipientId,
    recipientModel: recipientModel || 'User'
  });
};

notificationSchema.query.unread = function() {
  return this.where({
    'deliveryStatus.channel': 'in_app',
    'deliveryStatus.status': { $ne: 'read' }
  });
};

notificationSchema.query.recent = function(days = 7) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.where({ createdAt: { $gte: cutoffDate } });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;