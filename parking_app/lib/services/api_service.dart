import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = "http://localhost:5000/api/billing";

  static Future<Map<String, dynamic>> scanEntry(
      String userID, String parkingID) async {
    final response = await http.post(
      Uri.parse("$baseUrl/entry"),
      body: jsonEncode({"userID": userID, "parkingID": parkingID}),
      headers: {"Content-Type": "application/json"},
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> scanExit(String billingHash) async {
    final response = await http.post(
      Uri.parse("$baseUrl/exit"),
      body: jsonEncode({"billingHash": billingHash}),
      headers: {"Content-Type": "application/json"},
    );
    return jsonDecode(response.body);
  }
}
