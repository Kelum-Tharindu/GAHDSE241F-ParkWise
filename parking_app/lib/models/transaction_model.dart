import 'package:intl/intl.dart';

class Transaction {
  final String id;
  final String type;
  final String? bookingId;
  final String? billingId;
  final String? bulkBookingId;
  final String? landOwnerId;
  final String userId;
  final double amount;
  final String method;
  final String status;
  final DateTime date;
  final Map<String, dynamic>? bookingDetails;
  final Map<String, dynamic>? billingDetails;

  Transaction({
    required this.id,
    required this.type,
    this.bookingId,
    this.billingId,
    this.bulkBookingId,
    this.landOwnerId,
    required this.userId,
    required this.amount,
    required this.method,
    required this.status,
    required this.date,
    this.bookingDetails,
    this.billingDetails,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['_id'],
      type: json['type'],
      bookingId: json['bookingId'],
      billingId: json['billingId'],
      bulkBookingId: json['bulkBookingId'],
      landOwnerId: json['LandOwnerID'],
      userId: json['userId'],
      amount: json['amount'].toDouble(),
      method: json['method'],
      status: json['status'],
      date: DateTime.parse(json['date']),
      bookingDetails: json['bookingDetails'],
      billingDetails: json['billingDetails'],
    );
  }

  String get formattedDate => DateFormat('MMM dd, yyyy - HH:mm').format(date);

  String get formattedAmount => 'Rs. ${amount.toStringAsFixed(2)}';

  String get typeLabel {
    switch (type) {
      case 'booking':
        return 'Booking Payment';
      case 'billing':
        return 'Billing Payment';
      case 'bulkbooking':
        return 'Bulk Booking';
      case 'admin':
        return 'Admin Transaction';
      default:
        return 'Unknown Transaction';
    }
  }

  String get statusLabel {
    switch (status) {
      case 'Completed':
        return 'Completed';
      case 'Pending':
        return 'Pending';
      case 'Failed':
        return 'Failed';
      case 'Refunded':
        return 'Refunded';
      default:
        return 'Unknown';
    }
  }

  String get parkingName {
    if (type == 'booking' && bookingDetails != null) {
      return bookingDetails!['parkingName'] ?? 'Unknown';
    } else if (type == 'billing' && billingDetails != null) {
      return billingDetails!['parkingName'] ?? 'Unknown';
    }
    return 'N/A';
  }

  String get vehicleNumber {
    if (type == 'booking' && bookingDetails != null) {
      return bookingDetails!['vehicleNumber'] ?? 'Unknown';
    } else if (type == 'billing' && billingDetails != null) {
      return billingDetails!['vehicleNumber'] ?? 'Unknown';
    }
    return 'N/A';
  }

  String get timeDetails {
    if (type == 'booking' && bookingDetails != null) {
      final start =
          bookingDetails!['startTime'] != null
              ? DateTime.parse(bookingDetails!['startTime'])
              : null;
      final end =
          bookingDetails!['endTime'] != null
              ? DateTime.parse(bookingDetails!['endTime'])
              : null;

      if (start != null && end != null) {
        return '${DateFormat('MMM dd, HH:mm').format(start)} - ${DateFormat('HH:mm').format(end)}';
      }
    } else if (type == 'billing' && billingDetails != null) {
      final checkIn =
          billingDetails!['checkInTime'] != null
              ? DateTime.parse(billingDetails!['checkInTime'])
              : null;
      final checkOut =
          billingDetails!['checkOutTime'] != null
              ? DateTime.parse(billingDetails!['checkOutTime'])
              : null;

      if (checkIn != null && checkOut != null) {
        return '${DateFormat('MMM dd, HH:mm').format(checkIn)} - ${DateFormat('HH:mm').format(checkOut)}';
      }
    }
    return 'N/A';
  }
}

class TransactionSummary {
  final Map<String, double> byType;
  final double total;

  TransactionSummary({required this.byType, required this.total});

  factory TransactionSummary.fromJson(Map<String, dynamic> json) {
    final byType = <String, double>{};
    (json['byType'] as Map<String, dynamic>).forEach((key, value) {
      byType[key] = (value as num).toDouble();
    });

    return TransactionSummary(
      byType: byType,
      total: (json['total'] as num).toDouble(),
    );
  }

  double get bookingTotal => byType['booking'] ?? 0.0;
  double get billingTotal => byType['billing'] ?? 0.0;
  double get bulkBookingTotal => byType['bulkbooking'] ?? 0.0;

  String get formattedTotal => 'Rs. ${total.toStringAsFixed(2)}';
  String get formattedBookingTotal => 'Rs. ${bookingTotal.toStringAsFixed(2)}';
  String get formattedBillingTotal => 'Rs. ${billingTotal.toStringAsFixed(2)}';
  String get formattedBulkBookingTotal =>
      'Rs. ${bulkBookingTotal.toStringAsFixed(2)}';
}

class TransactionResponse {
  final List<Transaction> transactions;
  final TransactionSummary summary;

  TransactionResponse({required this.transactions, required this.summary});

  factory TransactionResponse.fromJson(Map<String, dynamic> json) {
    final transactions =
        (json['transactions'] as List)
            .map((e) => Transaction.fromJson(e))
            .toList();

    final summary = TransactionSummary.fromJson(json['summary']);

    return TransactionResponse(transactions: transactions, summary: summary);
  }
}
