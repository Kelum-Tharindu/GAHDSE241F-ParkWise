// Add to your existing ParkingSlot model
const parkingSlotSchema = new mongoose.Schema({
    // ... existing fields ...
    ownershipType: {
      type: String,
      enum: ['direct', 'managed'],
      default: 'direct'
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager'
    },
    originalOwner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'ownerType'
    },
    purchaseHistory: [{
      from: mongoose.Schema.Types.ObjectId,
      to: mongoose.Schema.Types.ObjectId,
      price: Number,
      date: Date
    }]
  });