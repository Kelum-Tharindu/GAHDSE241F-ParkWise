import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://192.168.8.145:5000/api/billing";

  static Future<Map<String, dynamic>?> sendScannedData(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "parkingID": data['parkingId'],
          "userID": data['userId'],
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body)['billing'];
      }
    } catch (e) {
      if (kDebugMode) {
        print("API error: $e");
      }
    }
    return null;
  }
}
