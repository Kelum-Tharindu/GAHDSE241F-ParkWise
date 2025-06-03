# ParkWise Scanner App - Deployment Guide

## Quick Start Commands

### Development Setup
```powershell
# Navigate to scanner app directory
cd "c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\scanner_app"

# Install dependencies
flutter pub get

# Run on Chrome (Web)
flutter run -d chrome --web-port=8080

# Run on Windows Desktop
flutter run -d windows

# Build for production
flutter build web
flutter build windows
flutter build apk --release
```

## Testing the App

### 1. Test QR Codes
Create test QR codes with this JSON structure:
```json
{
  "bookingId": "BK001",
  "userId": "USR123",
  "parkingSlotId": "A-15",
  "vehicleNumber": "ABC123",
  "parkingLocation": "Downtown Mall",
  "startTime": "2025-06-03T10:00:00Z",
  "endTime": "2025-06-03T12:00:00Z",
  "totalAmount": 25.00,
  "status": "confirmed",
  "createdAt": "2025-06-03T09:30:00Z"
}
```

### 2. Test Login Credentials
Default test credentials (update in backend):
- Email: `staff@parkwise.com`
- Password: `password123`

### 3. Backend Configuration
Update API base URL in `lib/utils/constants.dart`:
```dart
static const String baseUrl = 'http://your-backend-url:5000/api';
```

## Deployment Platforms

### Web Deployment
```powershell
# Build for web
flutter build web

# Deploy to Firebase Hosting, Netlify, or any web server
# Files will be in: build/web/
```

### Mobile Deployment
```powershell
# Android APK
flutter build apk --release

# Android App Bundle (Google Play Store)
flutter build appbundle --release

# iOS (requires macOS and Xcode)
flutter build ios --release
```

### Desktop Deployment
```powershell
# Windows
flutter build windows --release

# Package as installer (using Inno Setup or similar)
```

## Production Checklist

### Security
- [ ] Update API base URL to production server
- [ ] Enable HTTPS for all API calls
- [ ] Implement proper authentication token refresh
- [ ] Add certificate pinning for API security

### Performance
- [ ] Optimize camera preview performance
- [ ] Implement proper error handling for network issues
- [ ] Add offline storage for scanned data
- [ ] Optimize app bundle size

### Testing
- [ ] Test on real devices with various QR code formats
- [ ] Test camera functionality in different lighting conditions
- [ ] Verify API integration with production backend
- [ ] Test offline functionality

### Store Deployment
- [ ] Create app icons and splash screens
- [ ] Write app store descriptions
- [ ] Add screenshots and promotional materials
- [ ] Configure app signing for release builds

## Architecture Overview

### App Flow
```
Welcome Page → Login Page → QR Scanner Page
     ↓             ↓              ↓
  App Intro → Authentication → Camera Scan
     ↓             ↓              ↓
 Get Started → Store Token → Process QR → Show Details
```

### Key Components
- **API Service**: Handles all backend communication
- **QR Data Model**: Parses and validates QR code data
- **Custom Widgets**: Reusable UI components
- **Mobile Scanner**: Camera-based QR code scanning
- **GoRouter**: Navigation between pages

## Troubleshooting

### Common Issues
1. **Camera not working**: Check permissions in device settings
2. **QR codes not scanning**: Ensure good lighting and stable hand
3. **API errors**: Verify backend server is running and accessible
4. **Build failures**: Run `flutter clean && flutter pub get`

### Debug Commands
```powershell
# Check Flutter installation
flutter doctor

# Analyze code issues
flutter analyze

# Run tests
flutter test

# Check dependencies
flutter pub deps
```

## Support & Maintenance

### Regular Updates
- Update Flutter SDK monthly
- Update dependencies quarterly
- Monitor for security vulnerabilities
- Test with new Android/iOS versions

### Monitoring
- Implement crash reporting (Firebase Crashlytics)
- Add analytics for usage tracking
- Monitor API response times
- Track QR scan success rates

---

**Status**: ✅ Ready for deployment
**Last Updated**: June 3, 2025
**Version**: 1.0.0
