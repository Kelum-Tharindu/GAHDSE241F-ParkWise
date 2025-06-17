import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ParkingService {
  static const String baseUrl =
      // 'http://your-backend-url/parking'; // Replace with your actual backend URL
      'http://192.168.8.100:5000/parking';
  Future<List<Map<String, dynamic>>> getAllParkingLocations() async {
    if (kDebugMode) {
      print("===REQUEST=== Fetching parking locations");
      print("===REQUEST URL=== $baseUrl/frontend");
    }

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/frontend'),
        headers: {'Content-Type': 'application/json'},
      );

      if (kDebugMode) {
        print("===RESPONSE=== Status code: ${response.statusCode}");
        if (response.body.length > 300) {
          print(
            "===RESPONSE BODY PREVIEW=== ${response.body.substring(0, 300)}...",
          );
        } else {
          print("===RESPONSE BODY=== ${response.body}");
        }
      }

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);

        if (kDebugMode) {
          print("===RECEIVED DATA=== Found ${data.length} parking locations");
        }

        // No need for transformation, return the data as is since our model now matches
        // the backend response structure
        final List<Map<String, dynamic>> locations =
            data.map((item) => item as Map<String, dynamic>).toList();

        if (kDebugMode) {
          print(
            "===PROCESSED=== Successfully processed ${locations.length} parking locations",
          );
          if (locations.isNotEmpty) {
            print("===SAMPLE=== First location: ${locations[0]['name']}");
          }
        }

        return locations;
      } else {
        if (kDebugMode) {
          print(
            "=== Failed to load parking locations. Status code: ${response.statusCode} ===",
          );
          print("=== Error response body: ${response.body} ===");
        }
        throw Exception('Failed to load parking locations');
      }
    } catch (e) {
      if (kDebugMode) {
        print("=== Error fetching parking locations: $e ===");
      }
      throw Exception('Error fetching parking locations: $e');
    }
  }
}
