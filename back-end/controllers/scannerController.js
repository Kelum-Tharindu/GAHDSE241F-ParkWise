const { response } = require("express");
const Billing = require("../models/Billingmodel");
const Parking = require("../models/parkingmodel");

/**
 * Scanner controller for handling scanner app requests
 * Processes different types of scans and performs corresponding actions
 */
const scannerController = {
    /**
     * Process scan data from the scanner app
     * @param {Object} req - Request object with type and hash
     * @param {Object} res - Response object
     */
    processScan: async (req, res) => {
        try {
            const { type, hash } = req.body;
            
            console.log(`Received scan request with type: ${type}, hash: ${hash}`);
            
            if (!type || !hash) {
                console.log("Missing required parameters: type or hash");
                return res.status(400).json({ success: false, message: "Type and hash are required" });
            }
              // Handle different scan types
            if (type === "billing" || type === "booking") {
                return await processBillingScan(hash, res);
            } else {
                console.log(`Unsupported scan type: ${type}`);
                return res.status(400).json({ success: false, message: "Unsupported scan type" });
            }
        } catch (error) {
            console.error("Error processing scan:", error);
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
    }
};

/**
 * Process billing scan - Update exit time and calculate fees
 * @param {String} billingHash - The billing hash to lookup
 * @param {Object} res - Response object
 */
const processBillingScan = async (billingHash, res) => {
    try {
        console.log(`Processing billing scan with hash: ${billingHash}`);
        
        // Find the billing document using the hash
        const billing = await Billing.findOne({ billingHash });
        
        if (!billing) {
            console.log(`No billing found with hash: ${billingHash}`);
            return res.status(404).json({ success: false, message: "Billing not found" });
        }
        
        console.log(`Found billing: ${billing._id} for user: ${billing.userID}`);
        
        // Check payment status before proceeding
        if (billing.paymentStatus === "completed") {
            console.log(`Billing ${billing._id} has already been used and payment is completed`);
            return res.status(200).json({
                success: false,
                message: "This QR code has already been used for payment",
                response_Code: "ALREADY_PAID"
            });
        }
        
        // Get current time for exit time
        const exitTime = new Date();
        const entryTime = new Date(billing.entryTime);
        
        // Calculate duration in minutes
        const durationInMs = exitTime - entryTime;
        const durationInMinutes = Math.ceil(durationInMs / (1000 * 60));
        
        console.log(`Entry time: ${entryTime}, Exit time: ${exitTime}`);
        console.log(`Duration in minutes: ${durationInMinutes}`);
        
        // Get the parking details to calculate fee
        const parking = await Parking.findById(billing.parkingID);
        
        if (!parking) {
            console.log(`No parking found with ID: ${billing.parkingID}`);
            return res.status(404).json({ success: false, message: "Parking not found" });
        }
        
        // Get the fee per 30 minutes for the vehicle type
        const vehicleType = billing.vehicleType || "car"; // Default to car if not specified
        const perPrice30Min = parking.slotDetails[vehicleType]?.perPrice30Min || 0;
        
        console.log(`Vehicle type: ${vehicleType}, Fee per 30 minutes: ${perPrice30Min}`);
        
        // Calculate total fee based on duration (in 30-minute increments)
        const periods = Math.ceil(durationInMinutes / 30);
        const totalFee = periods * perPrice30Min;
        
        console.log(`Total periods (30 min): ${periods}, Total fee: ${totalFee}`);
        
        // Prepare the updated billing info (don't save to DB yet)
        const updatedBilling = {
            ...billing.toObject(),
            exitTime,
            duration: durationInMinutes,
            fee: totalFee
        };
        
        // Return the calculated information without updating the database
        return res.status(200).json({
            success: true,
            message: "Billing information calculated",
            response_Code: "BILLING_CALCULATED",
            data: {
                billing: updatedBilling,
                calculatedFee: totalFee,
                duration: durationInMinutes,
                exitTime
            }
        });
    } catch (error) {
        console.error("Error processing billing scan:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = scannerController;
