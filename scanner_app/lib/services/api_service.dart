import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl =
      'https://parkwise-api.example.com/api'; // Replace with your actual API URL

  // Method to send scanned QR data to the server
  static Future<Map<String, dynamic>?> sendScannedData(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/scanner/verify'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('API Error: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Exception during API call: $e');
      return null;
    }
  }
}
