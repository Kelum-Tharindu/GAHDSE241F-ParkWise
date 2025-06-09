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
      latitude:
          json['location'] != null
              ? double.parse(json['location']['latitude'].toString())
              : 0.0,
      longitude:
          json['location'] != null
              ? double.parse(json['location']['longitude'].toString())
              : 0.0,
      address: Address.fromJson(
        json['location'] != null ? json['location']['address'] : {},
      ),
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
  final String province;
  final String country;

  Address({
    required this.street,
    required this.city,
    required this.province,
    required this.country,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      street: json['street']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      province: json['province']?.toString() ?? '',
      country: json['country']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'street': street,
      'city': city,
      'province': province,
      'country': country,
    };
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
  final int totalSlot;
  final int bookingSlot;
  final int bookingAvailableSlot;
  final int withoutBookingSlot;
  final int withoutBookingAvailableSlot;
  final int perPrice30Min;
  final int perDayPrice;

  VehicleSlots({
    required this.totalSlot,
    required this.bookingSlot,
    required this.bookingAvailableSlot,
    required this.withoutBookingSlot,
    required this.withoutBookingAvailableSlot,
    required this.perPrice30Min,
    required this.perDayPrice,
  });

  // For backwards compatibility
  int get availableSlot => bookingAvailableSlot + withoutBookingAvailableSlot;

  factory VehicleSlots.fromJson(Map<String, dynamic> json) {
    return VehicleSlots(
      totalSlot: json['totalSlot']?.toInt() ?? 0,
      bookingSlot: json['bookingSlot']?.toInt() ?? 0,
      bookingAvailableSlot: json['bookingAvailableSlot']?.toInt() ?? 0,
      withoutBookingSlot: json['withoutBookingSlot']?.toInt() ?? 0,
      withoutBookingAvailableSlot:
          json['withoutBookingAvailableSlot']?.toInt() ?? 0,
      perPrice30Min: json['perPrice30Min']?.toInt() ?? 0,
      perDayPrice: json['perDayPrice']?.toInt() ?? 0,
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'totalSlot': totalSlot,
      'bookingSlot': bookingSlot,
      'bookingAvailableSlot': bookingAvailableSlot,
      'withoutBookingSlot': withoutBookingSlot,
      'withoutBookingAvailableSlot': withoutBookingAvailableSlot,
      'perPrice30Min': perPrice30Min,
      'perDayPrice': perDayPrice,
    };
  }
}
