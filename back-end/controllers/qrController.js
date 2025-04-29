// controllers/qrController.js

// In-memory storage for demonstration (use a database in production)
const parkingRecords = {};

// Controller methods for QR code operations
const qrController = {
  // Handle vehicle entry QR scan
  handleEntryQR: (req, res) => {
    const { qrData, timestamp } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No QR data provided' 
      });
    }
    
    // Store entry information
    parkingRecords[qrData] = {
      entryTime: timestamp,
      vehicleId: qrData,
      status: 'active'
    };
    
    console.log('Vehicle entry recorded via QR scan:', qrData);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Entry QR scan processed successfully', 
      data: parkingRecords[qrData]
    });
  },

  // Handle vehicle exit QR scan
  handleExitQR: (req, res) => {
    const { qrData, timestamp } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No QR data provided' 
      });
    }
    
    // Check if vehicle exists in records
    if (!parkingRecords[qrData]) {
      return res.status(404).json({
        success: false,
        message: 'No entry record found for this vehicle'
      });
    }
    
    // Calculate parking duration
    const entryTime = new Date(parkingRecords[qrData].entryTime);
    const exitTime = new Date(timestamp);
    const durationMs = exitTime - entryTime;
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    // Update record
    parkingRecords[qrData] = {
      ...parkingRecords[qrData],
      exitTime: timestamp,
      duration: durationMinutes,
      status: 'completed'
    };
    
    console.log('Vehicle exit recorded via QR scan:', qrData);
    console.log('Parking duration:', durationMinutes, 'minutes');
    
    return res.status(200).json({ 
      success: true, 
      message: `Exit QR scan processed. Parking duration: ${durationMinutes} minutes`, 
      data: parkingRecords[qrData]
    });
  },

  // Get QR code status
  getQRStatus: (req, res) => {
    const qrId = req.params.id;
    
    if (!parkingRecords[qrId]) {
      return res.status(404).json({
        success: false,
        message: 'No record found for this QR code'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: parkingRecords[qrId]
    });
  }
};

module.exports = qrController;