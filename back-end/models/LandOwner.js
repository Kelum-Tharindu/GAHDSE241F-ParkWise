const mongoose = require('mongoose');

const LandownerSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  userDocumentId: {
    type: String,
    unique: true,
    required: [true, 'User document ID is required']
  },
  parkingIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking'
  }]
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Landowner', LandownerSchema);