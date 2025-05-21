const Landowner = require('../models/LandOwner');

// Get all landowners
const getAllLandowners = async (req, res) => {
    try {
        const landowners = await Landowner.find()
            .select('_id username email') // Only select necessary fields
            .sort({ username: 1 }); // Sort by username

        if (!landowners || landowners.length === 0) {
            return res.status(404).json({ message: "No landowners found" });
        }

        res.status(200).json(landowners);
    } catch (error) {
        console.error('Error fetching landowners:', error);
        res.status(500).json({ message: "Error retrieving landowners", error: error.message });
    }
};

module.exports = {
    getAllLandowners
}; 