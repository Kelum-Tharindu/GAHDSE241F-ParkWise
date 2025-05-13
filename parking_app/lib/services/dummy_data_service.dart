import 'package:parking_app/models/parking_location.dart';

class DummyDataService {
  static List<ParkingLocation> getDummyParkingLocations() {
    return [
      ParkingLocation(
        id: '1',
        name: 'Colombo City Center Parking',
        latitude: 6.9271,
        longitude: 79.8612,
        address: Address(street: 'No. 100, Galle Road', city: 'Colombo 03'),
        slotDetails: SlotDetails(
          car: VehicleSlots(
            availableSlot: 15,
            perPrice30Min: 50,
            perDayPrice: 500,
          ),
          bicycle: VehicleSlots(
            availableSlot: 20,
            perPrice30Min: 20,
            perDayPrice: 200,
          ),
          truck: VehicleSlots(
            availableSlot: 5,
            perPrice30Min: 100,
            perDayPrice: 1000,
          ),
        ),
      ),
      ParkingLocation(
        id: '2',
        name: 'One Galle Face Parking',
        latitude: 6.9285,
        longitude: 79.8427,
        address: Address(street: '1A, Centre Road', city: 'Colombo 01'),
        slotDetails: SlotDetails(
          car: VehicleSlots(
            availableSlot: 25,
            perPrice30Min: 75,
            perDayPrice: 750,
          ),
          bicycle: VehicleSlots(
            availableSlot: 30,
            perPrice30Min: 25,
            perDayPrice: 250,
          ),
          truck: VehicleSlots(
            availableSlot: 8,
            perPrice30Min: 150,
            perDayPrice: 1500,
          ),
        ),
      ),
    ];
  }
}
