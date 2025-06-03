class QRData {
  final String? bookingId;
  final String? userId;
  final String? parkingSlotId;
  final String? startTime;
  final String? endTime;
  final String? vehicleNumber;
  final String? parkingLocation;
  final double? totalAmount;
  final String? status;
  final String? createdAt;

  QRData({
    this.bookingId,
    this.userId,
    this.parkingSlotId,
    this.startTime,
    this.endTime,
    this.vehicleNumber,
    this.parkingLocation,
    this.totalAmount,
    this.status,
    this.createdAt,
  });

  factory QRData.fromJson(Map<String, dynamic> json) {
    return QRData(
      bookingId: json['bookingId']?.toString(),
      userId: json['userId']?.toString(),
      parkingSlotId: json['parkingSlotId']?.toString(),
      startTime: json['startTime']?.toString(),
      endTime: json['endTime']?.toString(),
      vehicleNumber: json['vehicleNumber']?.toString(),
      parkingLocation: json['parkingLocation']?.toString(),
      totalAmount: json['totalAmount']?.toDouble(),
      status: json['status']?.toString(),
      createdAt: json['createdAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bookingId': bookingId,
      'userId': userId,
      'parkingSlotId': parkingSlotId,
      'startTime': startTime,
      'endTime': endTime,
      'vehicleNumber': vehicleNumber,
      'parkingLocation': parkingLocation,
      'totalAmount': totalAmount,
      'status': status,
      'createdAt': createdAt,
    };
  }
}
