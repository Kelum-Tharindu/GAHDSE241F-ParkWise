class QrResult {
  final String type;
  final String hash;
  final bool isValid;
  final Map<String, dynamic> details;

  QrResult({
    required this.type,
    required this.hash,
    required this.isValid,
    required this.details,
  });

  factory QrResult.fromJson(Map<String, dynamic> json) {
    return QrResult(
      type: json['type'] as String,
      hash: json['hash'] as String,
      isValid: json['valid'] as bool? ?? false,
      details: Map<String, dynamic>.from(json),
    );
  }

  String get displayTitle {
    switch (type.toLowerCase()) {
      case 'billing':
        return 'Billing Verification';
      case 'booking':
        return 'Parking Booking';
      case 'subbulkbooking':
        return 'Sub-Bulk Booking';
      default:
        return 'QR Verification';
    }
  }

  String get statusMessage {
    return isValid ? 'Valid' : 'Invalid';
  }
}
