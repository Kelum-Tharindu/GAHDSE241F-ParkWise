import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
// For jsonEncode and jsonDecode

class BookingService {
  static const String baseUrl =
      'http://localhost:5000/api/bookings'; // Replace with your actual API endpoint

  // Method to fetch fee details from the backend
  static Future<Map<String, dynamic>> calculateFees({
    required String parkingName,
    required String vehicleType,
    required DateTime? entryTime,
    required DateTime? exitTime,
  }) async {
    // Return default values if any of the required fields are null
    if (parkingName.isEmpty ||
        vehicleType.isEmpty ||
        entryTime == null ||
        exitTime == null) {
      return {
        "usageFee": 0.0,
        "bookingFee": 0.0,
        "totalFee": 0.0,
        "entryTime": entryTime?.toIso8601String() ?? "",
        "exitTime": exitTime?.toIso8601String() ?? "",
        "totalDuration": "0h 0m",
      };
    }

    try {
      // Format the request payload
      final Map<String, dynamic> requestBody = {
        "parkingName": parkingName,
        "vehicleType": vehicleType,
        "entryTime": entryTime.toIso8601String(),
        "exitTime": exitTime.toIso8601String(),
      };

      if (kDebugMode) {
        print(
          '===================🚀 Sending request to $baseUrl/calculate-fee',
        );
        print(
          '=====================📝 Request body: ${jsonEncode(requestBody)}',
        );
      }

      // Make POST request to the backend
      final response = await http.post(
        Uri.parse('$baseUrl/calculate-fee'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      // Check if the request was successful
      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (kDebugMode) {
          print(
            '===================✅ Response received with status code: ${response.statusCode}',
          );
          print('===================📄 Response body: ${response.body}');
        }

        return responseData;
      } else {
        if (kDebugMode) {
          print(
            '================❌ Error response with status code: ${response.statusCode}',
          );
          print('================📄 Error body: ${response.body}');
        }

        throw Exception('Failed to calculate fees: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('===================⚠️ Exception caught: $e');
      }

      // If there's an error, return default values
      return {
        "usageFee": 0.0,
        "bookingFee": 0.0,
        "totalFee": 0.0,
        "entryTime": entryTime.toIso8601String(),
        "exitTime": exitTime.toIso8601String(),
        "totalDuration": "0h 0m",
      };
    }
  }

  // Method to submit the booking
  static Future<Map<String, dynamic>> confirmBooking({
    required String parkingName,
    required String vehicleType,
    required DateTime entryTime,
    required DateTime exitTime,
  }) async {
    try {
      final Map<String, dynamic> requestBody = {
        "parkingName": parkingName,
        "vehicleType": vehicleType,
        "entryTime": entryTime.toIso8601String(),
        "exitTime": exitTime.toIso8601String(),
      };

      if (kDebugMode) {
        print(
          '===================🚀 Sending request to $baseUrl/confirm-booking',
        );
        print('==============📝 Request body: ${jsonEncode(requestBody)}');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/confirm-booking'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = jsonDecode(response.body);

        if (kDebugMode) {
          print('✅ Response received with status code: ${response.statusCode}');
          print('📄 Response body: ${response.body}');
        }

        return responseData;
      } else {
        if (kDebugMode) {
          print('❌ Error response with status code: ${response.statusCode}');
          print('📄 Error body: ${response.body}');
        }

        throw Exception('Failed to confirm booking: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('⚠️ Exception caught: $e');
      }

      throw Exception('Error confirming booking: $e');
    }
  }
}
