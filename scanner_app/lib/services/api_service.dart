import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/qr_data.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';

  // Get stored token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_token');
  }

  // Get stored user data
  static Future<User?> getStoredUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');
    if (userDataString != null) {
      final userData = jsonDecode(userDataString);
      return User.fromJson(userData);
    }
    return null;
  }

  // Login user
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        // Store user data locally
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_token', data['token'] ?? '');
        await prefs.setString('user_data', jsonEncode(data['user'] ?? {}));

        return {
          'success': true,
          'message': 'Login successful',
          'user': User.fromJson(data['user'] ?? {}),
          'token': data['token'],
        };
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login failed'};
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error. Please check your connection.',
      };
    }
  }

  // Verify QR code with backend
  static Future<Map<String, dynamic>> verifyQRCode(String qrData) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('$baseUrl/qr/verify'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'qrData': qrData}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': 'QR code verified successfully',
          'data': QRData.fromJson(data['bookingData'] ?? {}),
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'QR verification failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to verify QR code. Please try again.',
      };
    }
  }

  // Update booking status
  static Future<Map<String, dynamic>> updateBookingStatus(
    String bookingId,
    String status,
  ) async {
    try {
      final token = await getToken();
      final response = await http.put(
        Uri.parse('$baseUrl/booking/$bookingId/status'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'status': status}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': 'Booking status updated successfully',
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update booking status',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to update booking status. Please try again.',
      };
    }
  }

  // Get user bookings
  static Future<Map<String, dynamic>> getUserBookings() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/booking/user'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': 'Bookings retrieved successfully',
          'bookings': data['bookings'] ?? [],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to get bookings',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to load bookings. Please try again.',
      };
    }
  }

  // Logout user
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_token');
    await prefs.remove('user_data');
  }
}
