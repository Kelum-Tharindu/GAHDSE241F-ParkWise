import 'package:flutter/material.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';

class OngoingBookingPage extends StatelessWidget {
  const OngoingBookingPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("ongoing booking")),
      body: const Center(child: Text("Ongoing Booking Page")),
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 3, // This seems to be related to the Saved/Ongoing tab
        onTap: (index) {
          // Handle navigation based on index
          switch (index) {
            case 0:
              Navigator.pushReplacementNamed(context, '/dashboard');
              break;
            case 1:
              // Search functionality
              break;
            case 2:
              Navigator.pushReplacementNamed(context, '/enter-parking');
              break;
            case 3:
              // Already on ongoing bookings
              break;
            case 4:
              Navigator.pushReplacementNamed(context, '/profile');
              break;
          }
        },
        primaryColor: Theme.of(context).colorScheme.primary,
        items: const [
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
        ],
      ),
    );
  }
}
