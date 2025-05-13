import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ParkingService {
  static const String baseUrl =
      // 'http://your-backend-url/parking'; // Replace with your actual backend URL
      'http://192.168.8.145:5000/parking';

  Future<List<Map<String, dynamic>>> getAllParkingLocations() async {
    if (kDebugMode) {
      print("=== Sending request to get parking locations ===");
      print("=== Request URL: $baseUrl/all ===");
    }

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/all'),
        headers: {'Content-Type': 'application/json'},
      );

      if (kDebugMode) {
        print("=== Response status code: ${response.statusCode} ===");
        print("=== Response headers: ${response.headers} ===");
        print("=== Raw response body: ${response.body} ===");
      }

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);

        if (kDebugMode) {
          print("=== Received ${data.length} parking locations ===");
          print("=== Decoded response data: ${json.encode(data)} ===");
        }

        final List<Map<String, dynamic>> transformedData =
            data.map((parking) {
              return {
                'id': parking['id']?.toString() ?? '',
                'name': parking['name']?.toString() ?? '',
                'latitude': parking['latitude']?.toDouble() ?? 0.0,
                'longitude': parking['longitude']?.toDouble() ?? 0.0,
                'address': {
                  'street': parking['address']['street']?.toString() ?? '',
                  'city': parking['address']['city']?.toString() ?? '',
                },
                'slotDetails': {
                  'car': {
                    'availableSlot':
                        parking['slotDetails']['car']['availableSlot']
                            ?.toInt() ??
                        0,
                    'perPrice30Min':
                        parking['slotDetails']['car']['perPrice30Min']
                            ?.toInt() ??
                        0,
                    'perDayPrice':
                        parking['slotDetails']['car']['perDayPrice']?.toInt() ??
                        0,
                  },
                  'bicycle': {
                    'availableSlot':
                        parking['slotDetails']['bicycle']['availableSlot']
                            ?.toInt() ??
                        0,
                    'perPrice30Min':
                        parking['slotDetails']['bicycle']['perPrice30Min']
                            ?.toInt() ??
                        0,
                    'perDayPrice':
                        parking['slotDetails']['bicycle']['perDayPrice']
                            ?.toInt() ??
                        0,
                  },
                  'truck': {
                    'availableSlot':
                        parking['slotDetails']['truck']['availableSlot']
                            ?.toInt() ??
                        0,
                    'perPrice30Min':
                        parking['slotDetails']['truck']['perPrice30Min']
                            ?.toInt() ??
                        0,
                    'perDayPrice':
                        parking['slotDetails']['truck']['perDayPrice']
                            ?.toInt() ??
                        0,
                  },
                },
              };
            }).toList();

        if (kDebugMode) {
          print(
            "=== Successfully transformed ${transformedData.length} parking locations ===",
          );
          print(
            "=== Final transformed data: ${json.encode(transformedData)} ===",
          );
        }

        return transformedData;
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
