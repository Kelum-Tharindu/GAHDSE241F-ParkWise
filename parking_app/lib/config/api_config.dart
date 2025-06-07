class ApiConfig {
  // Base URL for API calls
  static const String baseUrl = 'http://192.168.8.145:5000/api';
  // static const String baseUrl = 'http://Localhost:5000/api';

  // Endpoint URLs
  static String userProfile(String userId) => '$baseUrl/users/$userId/profile';
  static String login() => '$baseUrl/auth/login';
  static String register() => '$baseUrl/auth/register';

  // Booking endpoints
  static String bookings() => '$baseUrl/bookings';
  static String parkingNames() => '${bookings()}/parking-names';
  static String calculateFee() => '${bookings()}/calculate-fee';
  static String confirmBooking() => '${bookings()}/confirm-booking';
  static String bookingHistory(String userId) =>
      '${bookings()}/booking-history/$userId';

  // Billing endpoints
  static String billing() => '$baseUrl/billing';

  // Transaction endpoints
  static String transactions() => '$baseUrl/transactions';
  static String userTransactions(String userId) =>
      '${transactions()}/user/$userId';

  // QR endpoints
  static String qrGenerate() => '$baseUrl/qr/generate';
  static String qrScan() => '$baseUrl/qr/scan';
}
