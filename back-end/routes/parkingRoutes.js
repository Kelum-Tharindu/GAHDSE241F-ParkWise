const express = require('express');
const ParkingController = require('../controllers/ParkingController');

const router = express.Router();

router.post('/parking', ParkingController.addParking);
router.get('/parking', ParkingController.getAllParkings);
router.get('/parking/:id', ParkingController.getParkingById);
router.put('/parking/:id', ParkingController.updateParking);
router.delete('/parking/:id', ParkingController.deleteParking);
router.get('/get-qr/:parkingID', ParkingController.getQRCodeByParkingID);

module.exports = router;
