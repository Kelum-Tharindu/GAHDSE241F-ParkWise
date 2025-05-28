const express = require('express');
const router = express.Router();
const { 
    getAllLandowners, 
    getLandownerDetails, 
    getAllLandownersWithDetails 
} = require('../controllers/landownerController');


// Get all landowners (basic info)
router.get('/all', getAllLandowners);

// Get all landowners with complete details
router.get('/details', getAllLandownersWithDetails);

// Get specific landowner details by ID
router.get('/:ownerId', getLandownerDetails);

module.exports = router; 