import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class BillingService {
  // Fetch all billing data for a user
  Future<List<Map<String, dynamic>>> fetchUserBillings() async {
    try {
      // Get user ID from shared preferences (stored during login)
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      if (userId == null) {
        throw Exception('User ID not found. Please login again.');
      }

      // Make API call to get user billings
      final response = await http.get(
        Uri.parse(ApiConfig.userBillings(userId)),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${prefs.getString('token') ?? ''}',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(
          response.statusCode == 404
              ? '[]' // Return empty array if no billings found
              : response.body,
        );
        return data.map((item) => item as Map<String, dynamic>).toList();
      } else if (response.statusCode == 404) {
        // No billings found
        return [];
      } else {
        throw Exception('Failed to load billing data: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching billing data: $e');
      return [];
    }
  }
}
