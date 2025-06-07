import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
// ignore: unused_import
import 'package:shared_preferences/shared_preferences.dart';
import 'package:parking_app/config/api_config.dart';
// For jsonEncode and jsonDecode

class BookingService {
  // Using the methods from ApiConfig
  static String get bookingsEndpoint => ApiConfig.bookings();

  // Method to fetch parking names from the backend
  static Future<List<String>> fetchParkingNames() async {
    try {
      if (kDebugMode) {
        print(
          '=====Attempting to fetch parking names from ${ApiConfig.parkingNames()}',
        );
      }

      final response = await http.get(Uri.parse(ApiConfig.parkingNames()));

      if (response.statusCode == 200) {
        final List<dynamic> names = jsonDecode(response.body);
        if (kDebugMode) {
          print('================Fetched parking names: $names');
        }
        return names.cast<String>();
      } else {
        if (kDebugMode) {
          print(
            '=====Failed to load parking names: ${response.statusCode} - ${response.body}',
          );
        }
        throw Exception(
          '===========Failed to load parking names: Status ${response.statusCode}',
        );
      }
    } catch (e) {
      if (kDebugMode) {
        print('===========Error fetching parking names: $e');
      }

      throw Exception('========Error fetching parking names: $e');
    }
  }

  // Method to fetch fee details from the backend
  static Future<Map<String, dynamic>> calculateFees({
    required String parkingName,
    required String vehicleType,
    required DateTime? entryTime,
    required DateTime? exitTime,
  }) async {
    // Throw exception if any of the required fields are null
    if (parkingName.isEmpty ||
        vehicleType.isEmpty ||
        entryTime == null ||
        exitTime == null) {
      throw Exception('==========Missing required fields for fee calculation');
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
          '===================🚀 Sending request to $bookingsEndpoint/calculate-fee',
        );
        print(
          '=====================📝 Request body: ${jsonEncode(requestBody)}',
        );
      }

      // Get shared preferences to retrieve auth token
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final headers = {'Content-Type': 'application/json'};

      // Add auth token if available
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }

      // Make POST request to the backend
      final response = await http.post(
        Uri.parse('$bookingsEndpoint/calculate-fee'),
        headers: headers,
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

        throw Exception(
          '==========Failed to calculate fees: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      if (kDebugMode) {
        print('===================⚠️ Exception caught: $e');
      }

      // Rethrow the exception instead of returning default values
      throw Exception('========Error calculating fees: $e');
    }
  }

  // Method to submit the booking
  static Future<Map<String, dynamic>> confirmBooking({
    required String parkingName,
    required DateTime bookingDate,
    required DateTime entryTime,
    required DateTime exitTime,
    required double usageFee,
    required double bookingFee,
    required double totalFee,
    required String vehicleType,
  }) async {
    try {
      // Get shared preferences to retrieve user ID
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      if (userId == null || userId.isEmpty) {
        throw Exception('User ID not found. Please log in again.');
      }

      final Map<String, dynamic> requestBody = {
        "parkingName": parkingName,
        "userId": userId,
        "bookingDate": bookingDate.toIso8601String(),
        "entryTime": entryTime.toIso8601String(),
        "exitTime": exitTime.toIso8601String(),
        "fee": {
          "usageFee": usageFee,
          "bookingFee": bookingFee,
          "totalFee": totalFee,
        },
        "paymentStatus": "pending", // Hardcoded value
        "bookingState": "active", // Hardcoded value
        "vehicleType": vehicleType,
      };
      if (kDebugMode) {
        print(
          '===================🚀 Sending request to $bookingsEndpoint/confirm-booking',
        );
        print('==============📝 Request body: ${jsonEncode(requestBody)}');
      }

      // Get auth token
      final token = prefs.getString('token');
      final headers = {'Content-Type': 'application/json'};

      // Add auth token if available
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }

      final response = await http.post(
        Uri.parse('$bookingsEndpoint/confirm-booking'),
        headers: headers,
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = jsonDecode(response.body);

        if (kDebugMode) {
          print(
            '============✅ Response received with status code: ${response.statusCode}',
          );
          print('============📄 Response body: ${response.body}');
        }

        return responseData;
      } else {
        if (kDebugMode) {
          print(
            '===============❌ Error response with status code: ${response.statusCode}',
          );
          print('============📄 Error body: ${response.body}');
        }

        throw Exception('Failed to confirm booking: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('=============⚠️ Exception caught: $e');
      }

      throw Exception('================Error confirming booking: $e');
    }
  }

  // Method to fetch booking data
  Future<Map<String, dynamic>> fetchBookingData() async {
    try {
      if (kDebugMode) {
        print('===== Starting fetchBookingData method =====');
      }

      // Get the shared preferences instance
      final prefs = await SharedPreferences.getInstance();
      // Get user ID from SharedPreferences
      final userId = prefs.getString('userId');
      if (kDebugMode) {
        print('===== User id: $userId =====');
      }

      if (userId == null || userId.isEmpty) {
        throw Exception('User ID not found. Please log in again.');
      }

      if (kDebugMode) {
        print('===== Retrieved userId: $userId =====');
      }
      final url = '$bookingsEndpoint/booking-history/$userId';
      if (kDebugMode) {
        print('===== Sending GET request to: $url =====');
      }

      // Get auth token
      final token = prefs.getString('token');
      final headers = {'Content-Type': 'application/json'};

      // Add auth token if available
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }

      final response = await http.get(Uri.parse(url), headers: headers);

      if (kDebugMode) {
        print(
          '===== Response received with status code: ${response.statusCode} =====',
        );
      }

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        if (kDebugMode) {
          print('===== Successfully fetched booking data: $responseData =====');
        }
        return responseData;
      } else {
        if (kDebugMode) {
          print('===== Failed to fetch booking data: ${response.body} =====');
        }
        throw Exception('=========Failed to fetch booking data');
      }
    } catch (e) {
      if (kDebugMode) {
        print('===== Error fetching booking data: $e =====');
      }
      throw Exception('=====Error fetching booking data: $e');
    }
  }
}
