class ParkingLocation {
  final String id;
  final String name;
  final double latitude;
  final double longitude;
  final Address address;
  final SlotDetails slotDetails;

  ParkingLocation({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.slotDetails,
  });

  factory ParkingLocation.fromJson(Map<String, dynamic> json) {
    return ParkingLocation(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      latitude: json['latitude']?.toDouble() ?? 0.0,
      longitude: json['longitude']?.toDouble() ?? 0.0,
      address: Address.fromJson(json['address'] ?? {}),
      slotDetails: SlotDetails.fromJson(json['slotDetails'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'latitude': latitude,
      'longitude': longitude,
      'address': address.toJson(),
      'slotDetails': slotDetails.toJson(),
    };
  }
}

class Address {
  final String street;
  final String city;

  Address({required this.street, required this.city});

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      street: json['street']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'street': street, 'city': city};
  }
}

class SlotDetails {
  final VehicleSlots car;
  final VehicleSlots bicycle;
  final VehicleSlots truck;

  SlotDetails({required this.car, required this.bicycle, required this.truck});

  factory SlotDetails.fromJson(Map<String, dynamic> json) {
    return SlotDetails(
      car: VehicleSlots.fromJson(json['car'] ?? {}),
      bicycle: VehicleSlots.fromJson(json['bicycle'] ?? {}),
      truck: VehicleSlots.fromJson(json['truck'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'car': car.toJson(),
      'bicycle': bicycle.toJson(),
      'truck': truck.toJson(),
    };
  }
}

class VehicleSlots {
  final int availableSlot;
  final int perPrice30Min;
  final int perDayPrice;

  VehicleSlots({
    required this.availableSlot,
    required this.perPrice30Min,
    required this.perDayPrice,
  });

  factory VehicleSlots.fromJson(Map<String, dynamic> json) {
    return VehicleSlots(
      availableSlot: json['availableSlot']?.toInt() ?? 0,
      perPrice30Min: json['perPrice30Min']?.toInt() ?? 0,
      perDayPrice: json['perDayPrice']?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'availableSlot': availableSlot,
      'perPrice30Min': perPrice30Min,
      'perDayPrice': perDayPrice,
    };
  }
}
