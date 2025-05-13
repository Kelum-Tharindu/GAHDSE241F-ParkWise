import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
// import 'package:parking_app/pages/add_booking_page.dart';
import 'package:parking_app/pages/booking_history_page.dart';
import 'package:parking_app/pages/booking_page.dart';
import 'package:parking_app/pages/login_page.dart';
import 'package:parking_app/pages/read_page.dart';
// import 'package:parking_app/pages/home_page.dart';
import 'package:parking_app/pages/dashboard_screen.dart';
import 'package:parking_app/pages/profile_page.dart';
import 'package:parking_app/pages/register_page.dart';
import 'package:parking_app/pages/forget_password_page.dart';
import 'package:parking_app/pages/rest_password_page.dart';
import 'package:parking_app/pages/map_page.dart';

void main() {
  // Ensure Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize logging configuration
  if (kDebugMode) {
    // Increase the log buffer size and optimize logging
    debugPrint = (String? message, {int? wrapWidth}) {
      if (message != null) {
        if (kDebugMode) {
          print(message);
        }
      }
    };
  }

  // Enable performance overlay in debug mode
  if (kDebugMode) {
    debugPrintRebuildDirtyWidgets = true;
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ParkEase',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF013220),
          brightness: Brightness.dark,
        ),
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
        '/dashboard': (context) => const DashboardScreen(),
        '/profile': (context) => const ProfilePage(),
        '/bookingPage': (context) => const BookingPage(),
        '/booking-history': (context) => const BookingHistory(),
        '/ongoing': (context) => const Placeholder(),
        '/enter-parking': (context) => const ReadPage(),
        '/forgot_password': (context) => ForgotPasswordPage(),
        '/map': (context) => const MapPage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name?.startsWith('/reset_password/') ?? false) {
          final token = settings.name!.substring('/reset_password/'.length);
          return MaterialPageRoute(
            builder: (context) => ResetPasswordPage(token: token),
          );
        }
        return null;
      },
    );
  }
}
