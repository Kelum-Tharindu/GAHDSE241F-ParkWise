const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Landowner',
        required: true 
    },
    
    slotDetails: {
        car: {
            totalSlot: { type: Number, default: 0 },
            bookingSlot: { type: Number, default: 0 },
            bookingAvailableSlot: { type: Number, default: 0 },
            withoutBookingSlot: { type: Number, default: 0 },
            withoutBookingAvailableSlot: { type: Number, default: 0 },
            perPrice30Min: { type: Number, default: 0 },
            perDayPrice: { type: Number, default: 0 }
        },
        bicycle: {
            totalSlot: { type: Number, default: 0 },
            bookingSlot: { type: Number, default: 0 },
            bookingAvailableSlot: { type: Number, default: 0 },
            withoutBookingSlot: { type: Number, default: 0 },
            withoutBookingAvailableSlot: { type: Number, default: 0 },
            perPrice30Min: { type: Number, default: 0 },
            perDayPrice: { type: Number, default: 0 }
        },
        truck: {
            totalSlot: { type: Number, default: 0 },
            bookingSlot: { type: Number, default: 0 },
            bookingAvailableSlot: { type: Number, default: 0 },
            withoutBookingSlot: { type: Number, default: 0 },
            withoutBookingAvailableSlot: { type: Number, default: 0 },
            perPrice30Min: { type: Number, default: 0 },
            perDayPrice: { type: Number, default: 0 }
        }
    },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: {  
            No: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            province: { type: String, required: true },
            country: { type: String, required: true },
            postalCode: { type: String, required: true }
        }
    },
    qrCode: { type: String }
});

// ✅ Prevent OverwriteModelError during development
const Parking = mongoose.models.Parking || mongoose.model('Parking', parkingSchema);

module.exports = Parking;
