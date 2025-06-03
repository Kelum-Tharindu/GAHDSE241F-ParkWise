# ParkWise Scanner App

A Flutter mobile application for ParkWise staff to scan QR codes and manage parking bookings. This app integrates with the ParkWise backend API to authenticate users, verify QR codes, and update booking statuses.

## Features

🚗 **QR Code Scanning**: Real-time camera scanning with flash and camera flip controls
🔐 **User Authentication**: Secure login with JWT token storage
📱 **Modern UI**: Beautiful gradient-based interface with custom components
🔄 **Booking Management**: View and update parking booking statuses
⚡ **Offline Fallback**: Local QR data parsing when backend is unavailable
🎯 **Responsive Design**: Optimized for both phones and tablets

## Screenshots

### Welcome Page
- App introduction and features overview
- Quick access to login

### Login Page
- Email/password authentication
- Form validation and error handling
- Secure token storage

### QR Scanner Page
- Real-time camera preview
- QR code detection and processing
- Interactive booking details dialog
- Status update functionality (Confirm/Complete)

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK (3.0.0 or higher)
- Android Studio / VS Code with Flutter extension
- Physical device or emulator for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/parkwise-scanner.git
   cd scanner_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure Backend URL**
   
   Update the base URL in `lib/utils/constants.dart`:
   ```dart
   static const String baseUrl = 'http://your-backend-url:5000/api';
   ```

4. **Run the app**
   ```bash
   # For Android/iOS device
   flutter run
   
   # For web browser
   flutter run -d chrome
   
   # For Windows desktop
   flutter run -d windows
   ```

## Project Structure

```
lib/
├── main.dart                 # App entry point with routing
├── models/                   # Data models
│   ├── user.dart            # User data model
│   └── qr_data.dart         # QR code data model
├── pages/                    # App screens
│   ├── welcome_page.dart    # Welcome/splash screen
│   ├── login_page.dart      # Authentication page
│   └── qr_scanner_page.dart # QR scanner with camera
├── services/                 # API and business logic
│   └── api_service.dart     # Backend API integration
├── widgets/                  # Reusable UI components
│   └── custom_widgets.dart  # Custom buttons, fields, overlays
└── utils/                    # Constants and utilities
    └── constants.dart       # App configuration
```

## API Integration

### Backend Endpoints

The app integrates with these ParkWise backend endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/qr/verify` - QR code verification
- `PUT /api/booking/{id}/status` - Update booking status
- `GET /api/booking/user` - Get user bookings

### Authentication Flow

1. User enters email/password on login page
2. App calls `/api/auth/login` endpoint
3. Backend returns JWT token and user data
4. Token stored locally using SharedPreferences
5. Token included in subsequent API requests

### QR Code Processing

1. Camera scans QR code containing booking data
2. App attempts to verify QR with backend `/api/qr/verify`
3. If backend unavailable, falls back to local JSON parsing
4. Displays booking details in interactive dialog
5. Allows status updates via API calls

## Configuration

### API Configuration

Update `lib/utils/constants.dart` for your environment:

```dart
class AppConstants {
  static const String baseUrl = 'http://localhost:5000/api';
  static const String defaultApiTimeout = '30';
  // ... other constants
}
```

### Permissions

The app requires camera permissions:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS** (`ios/Runner/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required to scan QR codes</string>
```

## Dependencies

Key packages used in this project:

- `qr_code_scanner: ^1.0.1` - QR code scanning
- `camera: ^0.10.5` - Camera access
- `permission_handler: ^11.0.1` - Permission management
- `http: ^1.1.0` - HTTP requests
- `shared_preferences: ^2.2.2` - Local data storage
- `go_router: ^12.1.3` - Navigation and routing

## Testing

### Device Testing

1. **Physical Device** (Recommended for camera testing):
   ```bash
   flutter run
   ```

2. **Android Emulator**:
   - Enable camera in AVD settings
   - Use webcam for QR code simulation

3. **Web Browser**:
   ```bash
   flutter run -d chrome
   ```

### QR Code Testing

Create test QR codes with booking data:

```json
{
  "bookingId": "BK001",
  "customerName": "John Doe",
  "vehicleNumber": "ABC123",
  "parkingSpot": "A-15",
  "startTime": "2024-06-03T10:00:00Z",
  "endTime": "2024-06-03T12:00:00Z",
  "status": "confirmed",
  "amount": "25.00"
}
```

## Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   - Check device settings and grant camera permission
   - Restart the app after granting permission

2. **Network Connection Error**
   - Verify backend server is running
   - Check API base URL in constants.dart
   - Ensure device/emulator has internet access

3. **QR Code Not Scanning**
   - Ensure good lighting conditions
   - Hold device steady over QR code
   - Try toggling flash or switching camera

4. **Build Errors**
   ```bash
   # Clean and rebuild
   flutter clean
   flutter pub get
   flutter run
   ```

### Backend Integration

Ensure your ParkWise backend is running and accessible:

1. Start the backend server
2. Test API endpoints with Postman/curl
3. Update base URL in app configuration
4. Verify network connectivity from device

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on physical devices
5. Submit a pull request

## License

This project is part of the ParkWise ecosystem and follows the main project's licensing terms.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the ParkWise backend documentation
- Contact the development team

---

**ParkWise Scanner App** - Making parking management efficient and user-friendly! 🚗📱
