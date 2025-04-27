import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:io';
import 'package:path_provider/path_provider.dart';
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
      _logApiCall('calculateFees', 'Invalid input parameters', null, {
        "usageFee": 0.0,
        "bookingFee": 0.0,
        "totalFee": 0.0,
        "totalDuration": "0h 0m",
      });

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

        _logApiCall(
          'calculateFees',
          jsonEncode(requestBody),
          response.statusCode,
          responseData,
        );

        return responseData;
      } else {
        if (kDebugMode) {
          print(
            '================❌ Error response with status code: ${response.statusCode}',
          );
          print('================📄 Error body: ${response.body}');
        }

        _logApiCall(
          'calculateFees',
          jsonEncode(requestBody),
          response.statusCode,
          {'error': response.body},
        );

        throw Exception('Failed to calculate fees: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('===================⚠️ Exception caught: $e');
      }

      _logApiCall('calculateFees', 'Exception occurred', null, {
        'error': e.toString(),
      });

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

        _logApiCall(
          'confirmBooking',
          jsonEncode(requestBody),
          response.statusCode,
          responseData,
        );

        return responseData;
      } else {
        if (kDebugMode) {
          print('❌ Error response with status code: ${response.statusCode}');
          print('📄 Error body: ${response.body}');
        }

        _logApiCall(
          'confirmBooking',
          jsonEncode(requestBody),
          response.statusCode,
          {'error': response.body},
        );

        throw Exception('Failed to confirm booking: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('⚠️ Exception caught: $e');
      }

      _logApiCall('confirmBooking', 'Exception occurred', null, {
        'error': e.toString(),
      });

      throw Exception('Error confirming booking: $e');
    }
  }

  // Log API calls to file
  static Future<void> _logApiCall(
    String endpoint,
    String request,
    int? statusCode,
    Map<String, dynamic> response,
  ) async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final filePath = '${directory.path}/api_logs.txt';
      final file = File(filePath);

      final timestamp = DateTime.now().toIso8601String();
      final logEntry = '''
==========================================================
Time: $timestamp
Endpoint: $endpoint
Status Code: ${statusCode ?? 'N/A'}
Request: $request
Response: ${jsonEncode(response)}
==========================================================

''';

      // Write to file
      if (await file.exists()) {
        await file.writeAsString(logEntry, mode: FileMode.append);
      } else {
        await file.writeAsString(logEntry);
      }

      if (kDebugMode) {
        print('==========================📝 API call logged to: $filePath');
      }
    } catch (e) {
      if (kDebugMode) {
        print('====================⚠️ Failed to log API call: $e');
      }
    }
  }

  // Get log file path
  static Future<String> getLogFilePath() async {
    final directory = await getApplicationDocumentsDirectory();
    return '${directory.path}/api_logs.txt';
  }

  // Read logs
  static Future<String> getApiLogs() async {
    try {
      final filePath = await getLogFilePath();
      final file = File(filePath);

      if (await file.exists()) {
        return await file.readAsString();
      } else {
        return 'No logs available.';
      }
    } catch (e) {
      return 'Error reading logs: $e';
    }
  }

  // Clear logs
  static Future<bool> clearApiLogs() async {
    try {
      final filePath = await getLogFilePath();
      final file = File(filePath);

      if (await file.exists()) {
        await file.delete();
      }

      return true;
    } catch (e) {
      if (kDebugMode) {
        print('====================⚠️ Failed to clear logs: $e');
      }
      return false;
    }
  }
}
