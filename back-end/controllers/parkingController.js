const mongoose = require("mongoose");
const Parking = require("../models/parkingmodel");
const Landowner = require("../models/LandOwner");
const { generateQRCode123 } = require("../utils/qrGenertor");

const addParking = async (req, res) => {
    let newParking;
    try {
        const { name, ownerId, slotDetails, location } = req.body;

        // Check if the parking name already exists
        const existingParking = await Parking.findOne({ name });
        if (existingParking) {
            return res.status(400).json({ message: "Parking with this name already exists." });
        }

        // Verify that the landowner exists
        const landowner = await Landowner.findById(ownerId);
        if (!landowner) {
            return res.status(404).json({ message: "Landowner not found." });
        }

        // Save new parking with the provided details
        newParking = new Parking({ name, ownerId, slotDetails, location });
        console.log("New parking object:", newParking);
        await newParking.save();
        console.log("New parking created:", newParking);

        // Update landowner's parkingIds array
        landowner.parkingIds.push(newParking._id);
        await landowner.save();
        console.log("Updated landowner with new parking ID");

        // Generate QR code with the parking ID and name
        if (!newParking._id) {
            throw new Error("Parking ID is not available.");
        }

        let qrCode;
        try {
            console.log("Generating QR code for:");
            qrCode = await generateQRCode123(newParking._id, name);
        } catch (error) {
            // If QR code generation fails, clean up both parking and landowner
            if (newParking && newParking._id) {
                await Parking.findByIdAndDelete(newParking._id);
                // Remove the parking ID from landowner's array
                landowner.parkingIds = landowner.parkingIds.filter(id => id.toString() !== newParking._id.toString());
                await landowner.save();
            }
            throw new Error("Failed to generate QR code: " + error.message);
        }

        // Update the parking document with the generated QR code
        newParking.qrCode = qrCode;
        await newParking.save();

        res.status(201).json({ message: "Parking added successfully.", parking: newParking });
    } catch (error) {
        // If any error occurs, clean up both parking and landowner
        if (newParking && newParking._id) {
            await Parking.findByIdAndDelete(newParking._id);
            // Remove the parking ID from landowner's array if it exists
            if (landowner) {
                landowner.parkingIds = landowner.parkingIds.filter(id => id.toString() !== newParking._id.toString());
                await landowner.save();
            }
        }

        res.status(500).json({ message: "Error adding parking.", error: error.message });
    }
};

// Get All Parking Details
const getAllParking = async (req, res) => {
    try {
        const parkingList = await Parking.find();
        
        if (!parkingList || parkingList.length === 0) {
            return res.status(404).json({ message: "No parking locations found" });
        }

        const transformedParkingList = parkingList.map(parking => ({
            id: parking._id.toString(),
            name: parking.name,
            ownerId: parking.ownerId,
            slotDetails: {
                car: {
                    totalSlot: parking.slotDetails.car.totalSlot,
                    bookingSlot: parking.slotDetails.car.bookingSlot,
                    bookingAvailableSlot: parking.slotDetails.car.bookingAvailableSlot,
                    withoutBookingSlot: parking.slotDetails.car.withoutBookingSlot,
                    withoutBookingAvailableSlot: parking.slotDetails.car.withoutBookingAvailableSlot,
                    perPrice30Min: parking.slotDetails.car.perPrice30Min,
                    perDayPrice: parking.slotDetails.car.perDayPrice
                },
                bicycle: {
                    totalSlot: parking.slotDetails.bicycle.totalSlot,
                    bookingSlot: parking.slotDetails.bicycle.bookingSlot,
                    bookingAvailableSlot: parking.slotDetails.bicycle.bookingAvailableSlot,
                    withoutBookingSlot: parking.slotDetails.bicycle.withoutBookingSlot,
                    withoutBookingAvailableSlot: parking.slotDetails.bicycle.withoutBookingAvailableSlot,
                    perPrice30Min: parking.slotDetails.bicycle.perPrice30Min,
                    perDayPrice: parking.slotDetails.bicycle.perDayPrice
                },
                truck: {
                    totalSlot: parking.slotDetails.truck.totalSlot,
                    bookingSlot: parking.slotDetails.truck.bookingSlot,
                    bookingAvailableSlot: parking.slotDetails.truck.bookingAvailableSlot,
                    withoutBookingSlot: parking.slotDetails.truck.withoutBookingSlot,
                    withoutBookingAvailableSlot: parking.slotDetails.truck.withoutBookingAvailableSlot,
                    perPrice30Min: parking.slotDetails.truck.perPrice30Min,
                    perDayPrice: parking.slotDetails.truck.perDayPrice
                }
            },
            location: {
                latitude: parking.location.latitude,
                longitude: parking.location.longitude,
                address: {
                    No: parking.location.address.No,
                    street: parking.location.address.street,
                    city: parking.location.address.city,
                    province: parking.location.address.province,
                    country: parking.location.address.country,
                    postalCode: parking.location.address.postalCode
                }
            },
            qrCode: parking.qrCode || null
        }));

        res.status(200).json(transformedParkingList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving parking list.", error: error.message });
    }
};

// Get Parking by ID or Name
const getParkingByIdOrName = async (req, res) => {
    try {
        const { identifier } = req.params;
        let query;

        // Check if identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier }; // Query by ID if valid
        } else {
            query = { name: identifier }; // Otherwise, query by name
        }

        const parking = await Parking.findOne(query);
        if (!parking) {
            return res.status(404).json({ message: "Parking not found." });
        }

        res.status(200).json(parking);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving parking details.", error: error.message });
    }
};

// Get Parking by Owner ID or Name
const getParkingByOwnerIdOrName = async (req, res) => {
    try {
        const { identifier } = req.params;
        let query;

        // Check if identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { ownerId: identifier }; // Query by Owner ID if valid
        } 

        const parking = await Parking.findOne(query);
        if (!parking) {
            return res.status(404).json({ message: "Parking not found." });
        }

        res.status(200).json(parking);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving parking details.", error: error.message });
    }
};

// Update Parking Details
const updateParking = async (req, res) => {
    try {
        const { identifier } = req.params;
        const updateData = req.body;

        // Prevent updating the qrCode, _id, and ownerId
        delete updateData.qrCode;
        delete updateData._id;
        delete updateData.ownerId;

        let query;

        // Check if identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier }; // Query by ID if valid
        } else {
            query = { name: identifier }; // Otherwise, query by Name
        }

        // Find and update parking
        const updatedParking = await Parking.findOneAndUpdate(
            query,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedParking) {
            return res.status(404).json({ message: "Parking not found." });
        }

        res.status(200).json({ message: "Parking updated successfully.", parking: updatedParking });
    } catch (error) {
        res.status(500).json({ message: "Error updating parking.", error: error.message });
    }
};

// Delete Parking
const deleteParking = async (req, res) => {
    try {
        const { identifier } = req.params;
        let query;

        // Check if identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier }; // Query by ID if valid
        } else {
            query = { name: identifier }; // Otherwise, query by Name
        }

        // Find parking before deletion to check if it exists
        const parkingToDelete = await Parking.findOne(query);
        if (!parkingToDelete) {
            return res.status(404).json({ message: "Parking not found." });
        }

        // Check if there are any active bookings
        // TODO: Add booking check if needed
        // const hasActiveBookings = await Booking.exists({ parkingId: parkingToDelete._id, status: 'active' });
        // if (hasActiveBookings) {
        //     return res.status(400).json({ message: "Cannot delete parking with active bookings." });
        // }

        // Delete the parking
        await Parking.findOneAndDelete(query);

        res.status(200).json({ 
            message: "Parking deleted successfully.",
            deletedParking: {
                id: parkingToDelete._id,
                name: parkingToDelete.name
            }
        });
    } catch (error) {
        console.error('Error deleting parking:', error);
        res.status(500).json({ 
            message: "Error deleting parking.", 
            error: error.message 
        });
    }
};

module.exports = {
    addParking,
    getAllParking,
    getParkingByIdOrName,
    getParkingByOwnerIdOrName,
    updateParking,
    deleteParking,
};
