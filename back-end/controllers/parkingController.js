const mongoose = require("mongoose");
const Parking = require("../models/parkingmodel");
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

        // Save new parking with the provided details
        newParking = new Parking({ name, ownerId, slotDetails, location });
        console.log("New parking object:", newParking);
        await newParking.save();
        console.log("New parking created:", newParking);

        // Generate QR code with the parking ID and name
        if (!newParking._id) {
            throw new Error("Parking ID is not available.");
        }

        let qrCode;
        try {
            console.log("Generating QR code for:");
            qrCode = await generateQRCode123(newParking._id, name); // This will assign the QR code to the qrCode variable
        } catch (error) {
            if (newParking && newParking._id) {
                await Parking.findByIdAndDelete(newParking._id); // Delete the created parking record if QR code generation fails
            }
            throw new Error("Failed to generate QR code: " + error.message);
        }

        // Update the parking document with the generated QR code
        newParking.qrCode = qrCode;
        await newParking.save();

        res.status(201).json({ message: "Parking added successfully.", parking: newParking });
    } catch (error) {
        // If any error occurs, delete the parking document created
        if (newParking && newParking._id) {
            await Parking.findByIdAndDelete(newParking._id); // Delete the created parking record
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
            latitude: parking.location.latitude,
            longitude: parking.location.longitude,
            address: {
                street: parking.location.address.street,
                city: parking.location.address.city
            },
            slotDetails: {
                car: {
                    availableSlot: parking.slotDetails.car.availableSlot,
                    perPrice30Min: parking.slotDetails.car.perPrice30Min,
                    perDayPrice: parking.slotDetails.car.perDayPrice
                },
                bicycle: {
                    availableSlot: parking.slotDetails.bicycle.availableSlot,
                    perPrice30Min: parking.slotDetails.bicycle.perPrice30Min,
                    perDayPrice: parking.slotDetails.bicycle.perDayPrice
                },
                truck: {
                    availableSlot: parking.slotDetails.truck.availableSlot,
                    perPrice30Min: parking.slotDetails.truck.perPrice30Min,
                    perDayPrice: parking.slotDetails.truck.perDayPrice
                }
            }
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

        // Prevent updating the qrCode or _id
        delete updateData.qrCode;
        delete updateData._id;

        let query;

        // Check if identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier }; // Query by ID if valid
        } else {
            query = { name: identifier }; // Otherwise, query by Name
        }

        // Find and update parking
        const updatedParking = await Parking.findOneAndUpdate(query, updateData, { new: true });

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

        // Find and delete parking
        const deletedParking = await Parking.findOneAndDelete(query);

        if (!deletedParking) {
            return res.status(404).json({ message: "Parking not found." });
        }

        res.status(200).json({ message: "Parking deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting parking.", error: error.message });
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
