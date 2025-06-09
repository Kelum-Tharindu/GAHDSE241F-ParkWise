const { response } = require("express");
const Billing = require("../models/Billingmodel");
const Parking = require("../models/parkingmodel");
const Transaction = require("../models/transactionModel");

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
    },
    
    /**
     * Confirm billing payment and update transaction
     * @param {Object} req - Request object with billing ID, exit time, fee, duration and payment method
     * @param {Object} res - Response object
     */
    confirmBillingPayment: async (req, res) => {
        try {
            const { billingId, exitTime, fee, duration, paymentMethod } = req.body;
            
            console.log(`Confirming payment for billing: ${billingId}`);
            console.log(`Fee: ${fee}, Duration: ${duration}, Payment Method: ${paymentMethod}`);
            
            if (!billingId || !exitTime || fee === undefined || duration === undefined || !paymentMethod) {
                console.log("Missing required parameters for payment confirmation");
                return res.status(400).json({ 
                    success: false, 
                    message: "billingId, exitTime, fee, duration, and paymentMethod are required" 
                });
            }
            
            // Find the billing document
            const billing = await Billing.findById(billingId);
            
            if (!billing) {
                console.log(`No billing found with ID: ${billingId}`);
                return res.status(404).json({ success: false, message: "Billing not found" });
            }
            
            console.log(`Found billing: ${billing._id} for user: ${billing.userID}`);
            
            // Check payment status before proceeding
            if (billing.paymentStatus === "completed") {
                console.log(`Billing ${billing._id} has already been paid`);
                return res.status(200).json({
                    success: false,
                    message: "This billing has already been paid",
                });
            }
            
            // Find or create transaction if it doesn't exist
            let transaction;
            
            if (billing.transactionId) {
                transaction = await Transaction.findById(billing.transactionId);
                console.log(`Found existing transaction: ${transaction._id}`);
            } else {
                // Create a new transaction
                transaction = new Transaction({
                    type: 'billing',
                    billingId: billing._id,
                    userId: billing.userID,
                    amount: 0, // Will be updated with the fee
                    method: paymentMethod,
                    status: 'Pending'
                });
                console.log(`Created new transaction for billing: ${billing._id}`);
            }
            
            // Update transaction with payment details
            transaction.amount = fee;
            transaction.method = paymentMethod;
            transaction.status = 'Completed';
            transaction.date = new Date();
            
            // Save transaction first
            await transaction.save();
            console.log(`Updated transaction: ${transaction._id}`);
            
            // Update billing with transaction ID if it doesn't have one
            if (!billing.transactionId) {
                billing.transactionId = transaction._id;
            }
            
            // Update billing with exit time, fee, duration, and status
            billing.exitTime = new Date(exitTime);
            billing.fee = fee;
            billing.duration = duration;
            billing.paymentStatus = "completed";
            
            await billing.save();
            console.log(`Updated billing: ${billing._id}`);
            
            // Update parking slot availability - Increment withoutBookingAvailableSlot for the vehicle type
            try {
                const parkingId = billing.parkingID;
                let vehicleType = billing.vehicleType?.toLowerCase() || 'car'; // Default to 'car' if not specified
                
                // Validate vehicle type (ensure it's one of the supported types)
                if (!['car', 'bicycle', 'truck'].includes(vehicleType)) {
                    console.log(`Unsupported vehicle type: ${vehicleType}, defaulting to 'car'`);
                    vehicleType = 'car';
                }
                
                // Find the parking and increment withoutBookingAvailableSlot
                const updateField = `slotDetails.${vehicleType}.withoutBookingAvailableSlot`;
                
                const updatedParking = await Parking.findByIdAndUpdate(
                    parkingId,
                    { $inc: { [updateField]: 1 } },
                    { new: true }
                );
                
                if (updatedParking) {
                    console.log(`Updated ${vehicleType} withoutBookingAvailableSlot for parking ${parkingId} to ${updatedParking.slotDetails[vehicleType].withoutBookingAvailableSlot}`);
                } else {
                    console.log(`Could not update parking ${parkingId} - not found`);
                }
            } catch (parkingError) {
                // Just log the error but don't fail the transaction
                console.error(`Error updating parking slot availability: ${parkingError.message}`);
            }
            
            return res.status(200).json({
                success: true,
                message: "Payment confirmed successfully",
                data: {
                    billing: billing,
                    transaction: transaction
                }
            });
        } catch (error) {
            console.error("Error confirming payment:", error);
            return res.status(500).json({ 
                success: false, 
                message: "Server error", 
                error: error.message 
            });
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
