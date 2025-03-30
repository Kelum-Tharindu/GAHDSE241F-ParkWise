const mongoose = require("mongoose");
const Parking = require("../models/parkingModel");
const { generateQRCode } = require("../utils/qrGenertor");

// Add a New Parking
const addParking = async (req, res) => {
    try {
        const { name, ownerId, slotDetails, location } = req.body;

        // Check if the parking name already exists
        const existingParking = await Parking.findOne({ name });
        if (existingParking) {
            return res.status(400).json({ message: "Parking with this name already exists." });
        }

        // Generate QR Code
        const qrCode = await generateQRCode(name);

        // Save new parking
        const newParking = new Parking({ name, ownerId, slotDetails, location, qrCode });
        await newParking.save();

        res.status(201).json({ message: "Parking added successfully.", parking: newParking });
    } catch (error) {
        res.status(500).json({ message: "Error adding parking.", error: error.message });
    }
};

// Get All Parking Details
const getAllParking = async (req, res) => {
    try {
        const parkingList = await Parking.find();
        res.status(200).json(parkingList);
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
        } else {
            query = { name: identifier }; // Otherwise, query by Name
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
