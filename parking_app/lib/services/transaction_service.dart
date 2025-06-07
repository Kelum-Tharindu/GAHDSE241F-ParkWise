import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:parking_app/config/api_config.dart';
import 'package:parking_app/models/transaction_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TransactionService {
  Future<TransactionResponse> getUserTransactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final userId = prefs.getString('userId');

      if (token == null || userId == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse(ApiConfig.userTransactions(userId)),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return TransactionResponse.fromJson(data);
      } else {
        throw Exception('Failed to load transactions: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching transactions: $e');
      rethrow;
    }
  }
}
