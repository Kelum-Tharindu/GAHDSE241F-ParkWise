import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ParkingService {
  static const String baseUrl =
      // Replace with your actual backend URL
      'http://192.168.8.100:5000/parking';

  Future<List<Map<String, dynamic>>> getAllParkingLocations() async {
    if (kDebugMode) {
      print(
        "===REQUEST=== Sending request to get parking locations for frontend",
      );
      print("===REQUEST URL=== $baseUrl/frontend");
    }

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/frontend'),
        headers: {'Content-Type': 'application/json'},
      );

      if (kDebugMode) {
        print("===RESPONSE=== Status code: ${response.statusCode}");
        print("===RESPONSE HEADERS=== ${response.headers}");
        print(
          "===RESPONSE BODY PREVIEW=== ${response.body.substring(0, response.body.length > 200 ? 200 : response.body.length)}...",
        );
      }

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);

        if (kDebugMode) {
          print(
            "===RESPONSE DATA=== Received ${data.length} parking locations",
          );
        }

        final List<Map<String, dynamic>> transformedData =
            data.map((parking) {
              return {
                'id': parking['id']?.toString() ?? '',
                'name': parking['name']?.toString() ?? '',
                'latitude': parking['location']['latitude']?.toDouble() ?? 0.0,
                'longitude':
                    parking['location']['longitude']?.toDouble() ?? 0.0,
                'address': {
                  'street':
                      parking['location']['address']['street']?.toString() ??
                      '',
                  'city':
                      parking['location']['address']['city']?.toString() ?? '',
                },
                'slotDetails': {
                  'car': {
                    'availableSlot':
                        parking['slotDetails']['car']['bookingAvailableSlot']
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
                        parking['slotDetails']['bicycle']['bookingAvailableSlot']
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
                        parking['slotDetails']['truck']['bookingAvailableSlot']
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
            "===TRANSFORMED DATA=== Successfully transformed ${transformedData.length} parking locations",
          );
          if (transformedData.isNotEmpty) {
            print("===SAMPLE DATA=== ${json.encode(transformedData[0])}");
          }
        }

        return transformedData;
      } else {
        if (kDebugMode) {
          print(
            "===ERROR RESPONSE=== Failed to load parking locations. Status code: ${response.statusCode}",
          );
          print("===ERROR BODY=== ${response.body}");
        }
        throw Exception('Failed to load parking locations');
      }
    } catch (e) {
      if (kDebugMode) {
        print("===REQUEST ERROR=== Error fetching parking locations: $e");
      }
      throw Exception('Error fetching parking locations: $e');
    }
  }
}
