const express = require('express');
const ParkingController = require('../controllers/parkingController');
const router = express.Router();

router.post('/add', ParkingController.addParking);
router.get('/all', ParkingController.getAllParkings);
router.get('/:id', ParkingController.getParkingById);
router.delete('/:id', ParkingController.deleteParking);

module.exports = router;
