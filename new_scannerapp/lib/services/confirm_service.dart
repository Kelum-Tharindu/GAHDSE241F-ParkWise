import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

/// Service class that handles payment confirmation API calls for the ParkWise Scanner app.
///
/// This service is responsible for sending payment confirmation requests to the backend API.
/// It provides a clean abstraction over the HTTP calls, allowing for better code organization
/// and testability compared to making API calls directly from UI components.
class ConfirmService {
  /// Base URL for all API calls
  static const String baseUrl =
      'http://192.168.8.100:5000/api'; // Using the same URL as in the original code

  /// Endpoint for payment confirmation
  static const String confirmEndpoint = '/scanner/confirm-payment';

  /// Endpoint for booking checkout confirmation
  static const String confirmBookingCheckoutEndpoint =
      '/scanner/confirm-booking-checkout';

  /// Confirms a payment based on the response data from a billing scan
  ///
  /// Takes the complete response data from the billing scan and sends it to the
  /// payment confirmation endpoint. Returns a map with status information.
  static Future<Map<String, dynamic>> confirmPayment(
    Map<String, dynamic> billingData,
  ) async {
    try {
      if (kDebugMode) {
        print(
          '=== Sending payment confirmation request for: ${billingData['data']?['parkingName'] ?? 'Unknown Parking'}',
        );
        print("=====response: $billingData");
      }

      final response = await http.post(
        Uri.parse('$baseUrl$confirmEndpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(billingData),
      );

      if (kDebugMode) {
        print('=== Payment confirmation status: ${response.statusCode}');
      }

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body) as Map<String, dynamic>;
        return {
          'success': true,
          'data': result,
          'message': 'Payment confirmed successfully',
        };
      } else {
        // Handle various error status codes
        String errorMessage = 'Failed to confirm payment';
        if (response.statusCode == 400) {
          errorMessage = 'Invalid payment data';
        } else if (response.statusCode == 404) {
          errorMessage = 'Payment record not found';
        } else if (response.statusCode == 409) {
          errorMessage = 'Payment already confirmed';
        } else if (response.statusCode == 500) {
          errorMessage = 'Server error during payment confirmation';
        }

        return {
          'success': false,
          'statusCode': response.statusCode,
          'message': errorMessage,
        };
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during payment confirmation: $e');
      }
      return {
        'success': false,
        'message': 'Error connecting to payment server: ${e.toString()}',
      };
    }
  }

  /// Confirms a booking checkout based on the response data from a booking scan
  ///
  /// Takes the complete response data from the booking checkout calculation and sends it to the
  /// booking checkout confirmation endpoint. Returns a map with status information.
  static Future<Map<String, dynamic>> confirmBookingCheckout(
    Map<String, dynamic> checkoutData,
  ) async {
    try {
      if (kDebugMode) {
        print(
          '=== Sending booking checkout confirmation request for: ${checkoutData['data']?['parkingName'] ?? 'Unknown Parking'}',
        );
        print("=====checkout data: $checkoutData");
      }

      final response = await http.post(
        Uri.parse('$baseUrl$confirmBookingCheckoutEndpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(checkoutData),
      );

      if (kDebugMode) {
        print(
          '=== Booking checkout confirmation status: ${response.statusCode}',
        );
      }

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body) as Map<String, dynamic>;
        return {
          'success': true,
          'data': result,
          'message': 'Booking checkout confirmed successfully',
        };
      } else {
        // Handle various error status codes
        String errorMessage = 'Failed to confirm booking checkout';
        if (response.statusCode == 400) {
          errorMessage = 'Invalid checkout data';
        } else if (response.statusCode == 404) {
          errorMessage = 'Booking record not found';
        } else if (response.statusCode == 409) {
          errorMessage = 'Booking already checked out';
        } else if (response.statusCode == 500) {
          errorMessage = 'Server error during checkout confirmation';
        }

        return {
          'success': false,
          'statusCode': response.statusCode,
          'message': errorMessage,
        };
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during booking checkout confirmation: $e');
      }
      return {
        'success': false,
        'message': 'Error connecting to server: ${e.toString()}',
      };
    }
  }
}
