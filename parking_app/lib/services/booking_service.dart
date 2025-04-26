import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class BookingService {
  static const String _baseUrl =
      'http://your-backend-api'; // Replace with your backend URL

  // Method to send booking data to the backend
  Future<void> sendBookingData({
    required String parkingName,
    required String vehicleType,
    required String entryTime,
    required String exitTime,
  }) async {
    final Map<String, String> requestData = {
      "parkingName": parkingName,
      "vehicleType": vehicleType,
      "entryTime": DateTime.parse(entryTime).toUtc().toIso8601String(),
      "exitTime": DateTime.parse(exitTime).toUtc().toIso8601String(),
    };

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/booking'), // Endpoint for booking
        headers: {'Content-Type': 'application/json'},
        body: json.encode(requestData),
      );

      if (response.statusCode == 200) {
        // Handle successful response
        if (kDebugMode) {
          print('Booking data sent successfully');
        }
      } else {
        // Handle error response
        throw Exception('Failed to send booking data: ${response.statusCode}');
      }
    } catch (e) {
      // Handle exception (e.g., network error)
      if (kDebugMode) {
        print('Error: Unable to send data: $e');
      }
      throw Exception('Error: Unable to send data');
    }
  }
}
