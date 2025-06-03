class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://localhost:5000/api';
  static const String defaultApiTimeout = '30'; // seconds

  // App Information
  static const String appName = 'ParkWise Scanner';
  static const String appVersion = '1.0.0';

  // Colors
  static const int primaryColor = 0xFF667eea;
  static const int secondaryColor = 0xFF764ba2;

  // Shared Preferences Keys
  static const String userTokenKey = 'user_token';
  static const String userDataKey = 'user_data';
  static const String isFirstLaunchKey = 'is_first_launch';

  // QR Scanner Configuration
  static const double qrScannerCutOutSize = 0.7; // 70% of screen width
  static const int qrBorderWidth = 8;
  static const int qrBorderLength = 40;

  // Animation Durations
  static const int splashDuration = 2000; // milliseconds
  static const int dialogAnimationDuration = 300; // milliseconds

  // API Endpoints
  static const String loginEndpoint = '/auth/login';
  static const String verifyQREndpoint = '/qr/verify';
  static const String updateBookingEndpoint = '/booking/{id}/status';
  static const String userBookingsEndpoint = '/booking/user';

  // Booking Status
  static const String statusPending = 'pending';
  static const String statusConfirmed = 'confirmed';
  static const String statusActive = 'active';
  static const String statusCompleted = 'completed';
  static const String statusCancelled = 'cancelled';

  // Error Messages
  static const String networkErrorMessage =
      'Network error. Please check your connection.';
  static const String cameraPermissionMessage =
      'Camera permission is required to scan QR codes.';
  static const String qrProcessingErrorMessage =
      'Error processing QR code. Please try again.';
  static const String loginFailedMessage =
      'Login failed. Please check your credentials.';
}
