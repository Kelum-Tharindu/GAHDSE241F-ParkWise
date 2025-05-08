import 'package:flutter/material.dart';
// import 'package:parking_app/pages/add_booking_page.dart';
import 'package:parking_app/pages/booking_history_page.dart';
import 'package:parking_app/pages/booking_page.dart';
import 'package:parking_app/pages/generate_page.dart';
import 'package:parking_app/pages/login_page.dart';
import 'package:parking_app/pages/nearest_parking_page.dart';
import 'package:parking_app/pages/ongoing_booking_page.dart';
import 'package:parking_app/pages/read_page.dart';
// import 'package:parking_app/pages/home_page.dart';
import 'package:parking_app/pages/dashboard_screen.dart';
import 'package:parking_app/pages/profile_page.dart';
import 'package:parking_app/pages/register_page.dart';
import 'package:parking_app/pages/forget_password_page.dart';
import 'package:parking_app/pages/rest_password_page.dart';

void main() {
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
      home: const MainWrapper(),
      routes: {
        '/dashboard': (context) => const DashboardScreen(),
        '/profile': (context) => const ProfilePage(),
        '/bookingPage': (context) => const BookingPage(),
        '/booking-history': (context) => const BookingHistory(),
        '/ongoing': (context) => const Placeholder(),
        '/enter-parking': (context) => const ReadPage(),
        '/login': (context) => const LoginPage(), // Added LoginPage route
        '/register':
            (context) => const RegisterPage(), // Added RegisterPage route
        '/forgot_password': (context) => ForgotPasswordPage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name?.startsWith('/reset_password/') ?? false) {
          // Extract token from the route
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

class MainWrapper extends StatefulWidget {
  const MainWrapper({super.key});

  @override
  State<MainWrapper> createState() => _MainWrapperState();
}

class _MainWrapperState extends State<MainWrapper> {
  final int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ProfilePage(),
    const ReadPage(),
    const NearestParkingPage(),
    const OngoingBookingPage(),
    const GeneratePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      // Navigation bar has been removed
    );
  }
}
