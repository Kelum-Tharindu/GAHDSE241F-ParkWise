import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiService {
  // Try different base URLs in case one fails
  static const List<String> _possibleBaseUrls = [
    'http://192.168.8.145:5000/api', // IP address
    'http://10.0.2.2:5000/api', // Android emulator localhost
    'http://localhost:5000/api', // Local testing
  ];

  // Primary base URL
  static String baseUrl = _possibleBaseUrls[0];
  // Method to send scanned QR data to the server
  static Future<Map<String, dynamic>?> sendScannedData(
    Map<String, dynamic> data,
  ) async {
    //print data
    if (kDebugMode) {
      print('===API Request Data: $data');
    }

    final String requestUrl = '$baseUrl/scanner/scan';
    if (kDebugMode) {
      print('===Request URL (before sending): $requestUrl');
      print('===Request Body: ${jsonEncode(data)}');
    }

    try {
      final response = await http.post(
        Uri.parse(requestUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );
      if (kDebugMode) {
        print('===API Request: ${response.request?.url}');
        print('===API Response: ${response.statusCode} - ${response.body}');
      }

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        if (kDebugMode) {
          print('API Error: ${response.statusCode} - ${response.body}');
        }
        return null;
      }
    } catch (e) {
      if (kDebugMode) {
        print('Exception during API call: $e');
      }

      // Try alternative base URLs if the first one fails
      for (int i = 1; i < _possibleBaseUrls.length; i++) {
        try {
          if (kDebugMode) {
            print('Trying alternative base URL: ${_possibleBaseUrls[i]}');
          }

          final alternativeUrl = '${_possibleBaseUrls[i]}/scanner/scan';
          final response = await http.post(
            Uri.parse(alternativeUrl),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(data),
          );

          if (kDebugMode) {
            print('===Alternative API Request: ${response.request?.url}');
            print(
              '===Alternative API Response: ${response.statusCode} - ${response.body}',
            );
          }

          if (response.statusCode == 200) {
            // Update the base URL to the working one for future requests
            baseUrl = _possibleBaseUrls[i];
            return jsonDecode(response.body);
          }
        } catch (alternativeError) {
          if (kDebugMode) {
            print('Exception with alternative URL: $alternativeError');
          }
        }
      }

      return null;
    }
  }
}
