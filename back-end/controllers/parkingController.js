const Parking = require('../models/parkingmodel');

class ParkingController {
    // Add new parking
    static async addParking(req, res) {
        try {
            console.log("Received Data:", req.body); // Debugging log

            const parking = new Parking(req.body);
            await parking.save();

            res.status(201).json(parking);
        } catch (error) {
            console.error("Error saving parking:", error.message);
            res.status(400).json({ error: error.message });
        }
    }

    // Get all parking
    static async getAllParkings(req, res) {
        try {
            const parkings = await Parking.find();
            res.status(200).json(parkings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get parking by ID
    static async getParkingById(req, res) {
        try {
            const parking = await Parking.findById(req.params.id);
            if (!parking) {
                return res.status(404).json({ message: "Parking not found" });
            }
            res.status(200).json(parking);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete parking
    static async deleteParking(req, res) {
        try {
            const parking = await Parking.findByIdAndDelete(req.params.id);
            if (!parking) {
                return res.status(404).json({ message: "Parking not found" });
            }
            res.status(200).json({ message: "Parking deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ParkingController;
