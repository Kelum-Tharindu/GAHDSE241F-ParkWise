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
            totalSlot: { type: Number, required: true },
            bookingSlot: { type: Number, required: true },
            availableSlot: { type: Number, required: true },
            perPrice30Min: { type: Number, required: true },
            perDayPrice: { type: Number, required: true }
        },
        bicycle: {
            totalSlot: { type: Number, required: true },
            bookingSlot: { type: Number, required: true },
            availableSlot: { type: Number, required: true },
            perPrice30Min: { type: Number, required: true },
            perDayPrice: { type: Number, required: true }
        },
        truck: {
            totalSlot: { type: Number, required: true },
            bookingSlot: { type: Number, required: true },
            availableSlot: { type: Number, required: true },
            perPrice30Min: { type: Number, required: true },
            perDayPrice: { type: Number, required: true }
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
    qrCode: { type: String } // New field to store QR code URL or encoded data
});

// ✅ Prevent OverwriteModelError during development
const Parking = mongoose.models.Parking || mongoose.model('Parking', parkingSchema);

module.exports = Parking;
