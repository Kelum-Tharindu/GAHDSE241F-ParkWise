import 'package:flutter/material.dart';
import 'package:parking_app/pages/generate_page.dart';
import 'package:parking_app/pages/nearest_parking_page.dart';
import 'package:parking_app/pages/ongoing_booking_page.dart';
import 'package:parking_app/pages/read_page.dart';
// import 'package:parking_app/pages/home_page.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';
import 'package:parking_app/pages/dashboard_screen.dart';
import 'package:parking_app/pages/profile_page.dart';

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
        // '/home': (context) => const HomePage(),
        // '/search': (context) => const SearchPage(),
        // '/scan': (context) => const ScanPage(),
        // '/saved': (context) => const SavedPage(),
        '/profile': (context) => const ProfilePage(),
        '/add-booking': (context) => const Placeholder(),
        '/booking-history': (context) => const Placeholder(),
        '/ongoing': (context) => const Placeholder(),
        '/nearest-parking': (context) => const Placeholder(),
        '/enter-parking': (context) => const ReadPage(),
        //qr-preview: (context) => const Placeholder(),
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
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ProfilePage(),
    const NearestParkingPage(),
    const OngoingBookingPage(),
    const GeneratePage(),
  ];

  final List<BottomNavigationBarItem> _navItems = const [
    BottomNavigationBarItem(
      icon: Icon(Icons.home_outlined),
      activeIcon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.search_outlined),
      activeIcon: Icon(Icons.search),
      label: 'Search',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.qr_code_scanner_outlined),
      activeIcon: Icon(Icons.qr_code_scanner),
      label: 'Scan',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.bookmark_outline),
      activeIcon: Icon(Icons.bookmark),
      label: 'Saved',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person_outline),
      activeIcon: Icon(Icons.person),
      label: 'Profile',
    ),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        primaryColor: Theme.of(context).colorScheme.primary,
        items: _navItems,
      ),
    );
  }
}
