import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl =
      'https://api.parkwise.com'; // Replace with your actual API base URL

  // Method to send scanned QR data to the server
  static Future<Map<String, dynamic>?> sendScannedData(
    Map<String, dynamic> qrData,
  ) async {
    try {
      if (kDebugMode) {
        print('=== Sending QR data to server: $qrData');
      }

      // Check QR data type to determine which endpoint to use
      final String endpoint = _getEndpointForQrType(qrData);

      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(qrData),
      );

      if (kDebugMode) {
        print('=== API response status: ${response.statusCode}');
      }

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        if (kDebugMode) {
          print('=== API response body: $result');
        }
        return result as Map<String, dynamic>;
      } else {
        if (kDebugMode) {
          print('=== API error: ${response.body}');
        }
        return null;
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during API call: $e');
      }
      return null;
    }
  }

  // Method to validate QR code data format and extract relevant information
  static Map<String, dynamic>? validateQrData(String rawData) {
    try {
      // Try to parse as JSON first
      final data = jsonDecode(rawData);

      if (data is! Map<String, dynamic>) {
        if (kDebugMode) {
          print('=== QR data is not a valid JSON object');
        }
        return null;
      }

      // Check for required fields based on the type
      if (!data.containsKey('type')) {
        if (kDebugMode) {
          print('=== QR data missing type field');
        }
        return null;
      }

      if (!data.containsKey('billingHash')) {
        if (kDebugMode) {
          print('=== QR data missing hash field');
        }
        return null;
      }

      // Categorize based on type
      final String type = data['type'] as String;
      if (kDebugMode) {
        print('=== QR data type: $type');
      }

      return data;
    } catch (e) {
      if (kDebugMode) {
        print('=== Error parsing QR data: $e');
      }
      return null;
    }
  }

  // Helper method to determine the endpoint based on QR type
  static String _getEndpointForQrType(Map<String, dynamic> qrData) {
    final String type = qrData['type'] as String;

    switch (type.toLowerCase()) {
      case 'billing':
        return '/api/billing/verify';
      case 'booking':
        return '/api/booking/verify';
      case 'subbulkbooking':
        return '/api/subbulkbooking/verify';
      default:
        return '/api/verify';
    }
  }
}
