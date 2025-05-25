const Landowner = require('../models/LandOwner');
const User = require('../models/usermodel');
const Parking = require('../models/parkingmodel');

// Get all landowners
const getAllLandowners = async (req, res) => {
    try {
        const landowners = await Landowner.find()
            .select('_id username') // Only select necessary fields
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

// Get detailed landowner information including parking and user details
const getLandownerDetails = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // Find landowner and populate parking details
        const landowner = await Landowner.findById(ownerId)
            .populate({
                path: 'parkingIds',
                select: 'name location slotDetails qrCode'
            });

        if (!landowner) {
            return res.status(404).json({ message: "Landowner not found" });
        }

        // Get user details using userDocumentId
        const userDetails = await User.findById(landowner.userDocumentId)
            .select('-password -otpSecret -backupCodes -hashedBackupCodes -resetPasswordToken -resetPasswordExpire');

        if (!userDetails) {
            return res.status(404).json({ message: "User details not found" });
        }

        // Combine all information
        const landownerDetails = {
            landowner: {
                _id: landowner._id,
                username: landowner.username,
                userDocumentId: landowner.userDocumentId
            },
            userDetails: userDetails,
            parkingDetails: landowner.parkingIds
        };

        res.status(200).json(landownerDetails);
    } catch (error) {
        console.error('Error fetching landowner details:', error);
        res.status(500).json({ message: "Error retrieving landowner details", error: error.message });
    }
};

// Get all landowners with complete details
const getAllLandownersWithDetails = async (req, res) => {
    try {
        // Find all landowners and populate parking details
        const landowners = await Landowner.find()
            .populate({
                path: 'parkingIds',
                select: 'name location slotDetails qrCode'
            })
            .sort({ username: 1 });

        if (!landowners || landowners.length === 0) {
            return res.status(404).json({ message: "No landowners found" });
        }

        // Get user details for all landowners
        const landownersWithDetails = await Promise.all(
            landowners.map(async (landowner) => {
                const userDetails = await User.findById(landowner.userDocumentId)
                    .select('-password -otpSecret -backupCodes -hashedBackupCodes -resetPasswordToken -resetPasswordExpire');

                return {
                    landowner: {
                        _id: landowner._id,
                        username: landowner.username,
                        userDocumentId: landowner.userDocumentId
                    },
                    userDetails: userDetails,
                    parkingDetails: landowner.parkingIds
                };
            })
        );

        res.status(200).json(landownersWithDetails);
    } catch (error) {
        console.error('Error fetching all landowners details:', error);
        res.status(500).json({ message: "Error retrieving landowners details", error: error.message });
    }
};

module.exports = {
    getAllLandowners,
    getLandownerDetails,
    getAllLandownersWithDetails
}; 