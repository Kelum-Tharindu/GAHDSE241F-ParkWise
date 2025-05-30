const mongoose = require('mongoose');

// Schema for monthly targets
const monthlyTargetSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number, // 0-11 (January-December)
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Compound index to ensure uniqueness of year-month combination
monthlyTargetSchema.index({ year: 1, month: 1 }, { unique: true });

// Pre-save middleware to update timestamps
monthlyTargetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Others schema to contain various system settings and configurations
const othersSchema = new mongoose.Schema({
  monthlyTargets: [monthlyTargetSchema],
  // Other system settings can be added here in the future
});

const Others = mongoose.model('Others', othersSchema);

module.exports = Others;
