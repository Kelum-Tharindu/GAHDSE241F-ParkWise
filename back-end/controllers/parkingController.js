const Parking = require('../models/parkingmodel');
const { generateQRCode } = require('../utils/qrGenerator'); 

class ParkingController {
    // Add new parking and generate QR code
    static async addParking(req, res) {
        try {
            console.log("Received Data:", req.body);

            // Save parking entry
            const parking = new Parking(req.body);
            await parking.save();
            console.log("Parking Saved:", parking._id);

            // Generate QR code based on the parking ID
            const qrCodeData = await generateQRCode(parking._id.toString());

            // Update parking with QR code
            parking.qrCode = qrCodeData;
            await parking.save();

            res.status(201).json({
                message: "Parking added successfully with QR Code",
                parking
            });
        } catch (error) {
            console.error("Error saving parking:", error.message);
            res.status(400).json({ error: error.message });
        }
    }

    // Get all parking records
    static async getAllParkings(req, res) {
        try {
            const parkings = await Parking.find();
            res.status(200).json({ message: "All parkings retrieved", parkings });
        } catch (error) {
            console.error("Error fetching parkings:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Get a specific parking by ID
    static async getParkingById(req, res) {
        try {
            const parking = await Parking.findById(req.params.id);
            if (!parking) {
                return res.status(404).json({ message: "Parking not found" });
            }
            res.status(200).json({ message: "Parking retrieved", parking });
        } catch (error) {
            console.error("Error fetching parking:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Update parking details
    static async updateParking(req, res) {
        try {
            const updatedParking = await Parking.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                { new: true }
            );

            if (!updatedParking) {
                return res.status(404).json({ message: "Parking not found" });
            }

            res.status(200).json({ message: "Parking updated successfully", updatedParking });
        } catch (error) {
            console.error("Error updating parking:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Delete a parking record
    static async deleteParking(req, res) {
        try {
            const parking = await Parking.findByIdAndDelete(req.params.id);
            if (!parking) {
                return res.status(404).json({ message: "Parking not found" });
            }
            res.status(200).json({ message: "Parking deleted successfully" });
        } catch (error) {
            console.error("Error deleting parking:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Fetch QR code for a parking ID
    static async getParkingQRCode(req, res) {
        try {
            const parking = await Parking.findById(req.params.id);
            if (!parking || !parking.qrCode) {
                return res.status(404).json({ message: "QR Code not found for this parking" });
            }

            res.status(200).json({ qrCode: parking.qrCode });
        } catch (error) {
            console.error("Error fetching QR code:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ParkingController;
