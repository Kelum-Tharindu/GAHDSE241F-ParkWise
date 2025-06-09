const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.post('/add', parkingController.addParking);
router.get('/all', parkingController.getAllParking);
router.get('/frontend', parkingController.getAllParkingForFrontend);
router.get('/names', parkingController.getAllParkingNames);
router.get('/:identifier', parkingController.getParkingByIdOrName);
router.get('/owner/:identifier', parkingController.getParkingByOwnerIdOrName);
router.put('/update/:identifier', parkingController.updateParking);
router.delete('/delete/:identifier', parkingController.deleteParking);

module.exports = router;
