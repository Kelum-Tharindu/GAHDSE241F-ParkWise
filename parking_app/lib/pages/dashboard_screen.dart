import 'package:flutter/material.dart';
import '../widgets/glassmorphic_app_bar.dart';
import '../widgets/profile_avatar.dart';
import '../widgets/status_card.dart';
import '../widgets/section_header.dart';
import '../widgets/feature_card.dart';
import '../widgets/activity_item.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String userName = '';
  String userId = '';
  String userRole = '';
  String token = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      // Get user data from SharedPreferences
      userName = prefs.getString('userName') ?? '';
      userId = prefs.getString('id') ?? '';
      userRole = prefs.getString('role') ?? '';
      token = prefs.getString('token') ?? '';
    });
  }

  Future<void> _logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      // Clear all stored data
      await prefs.clear();

      // Reset state variables
      setState(() {
        userName = '';
        userId = '';
        userRole = '';
        token = '';
      });

      if (!mounted) return;
      // Navigate to login page
      Navigator.pushReplacementNamed(context, '/login');
    } catch (e) {
      // Handle logout errors
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Logout failed. Please try again.')),
      );
    }
  }

  void _showSettingsMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.black.withAlpha(230),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 20),
              // User info section
              Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(25),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: const Color(0xFF15A66E),
                      child: Text(
                        userName.isNotEmpty ? userName[0].toUpperCase() : 'G',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            userName.isNotEmpty ? userName : 'Guest User',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            userRole.isNotEmpty ? userRole : 'Standard Account',
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Logout button
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text(
                  'Logout',
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                onTap: () {
                  Navigator.pop(context); // Close the menu
                  _logout();
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;
    final bool isSmallScreen = screenSize.width < 600;

    // Theme colors
    final Color backgroundColor = Colors.black;
    final Color primaryColor = const Color(0xFF013220);
    final Color accentColor = const Color(0xFF025939);
    final Color highlightColor = const Color(0xFF15A66E);
    final Color textColor = Colors.white;

    // Dashboard features
    final List<Map<String, dynamic>> features = [
      {
        'title': 'Enter Parking',
        'subtitle': 'Start your parking session',
        'icon': Icons.login,
        'route': '/enter-parking',
        'gradient': [const Color(0xFF016747), const Color(0xFF01996D)],
      },
      // {
      //   'title': 'Ongoing',
      //   'subtitle': 'Track active parking sessions',
      //   'icon': Icons.directions_car,
      //   'route': '/reset_password',
      //   'gradient': [const Color(0xFF025939), const Color(0xFF017455)],
      // },
      {
        'title': 'My Profile',
        'subtitle': 'Manage your account details',
        'icon': Icons.person,
        'route': '/profile',
        'gradient': [primaryColor, const Color(0xFF014530)],
      },
      {
        'title': 'Add Booking',
        'subtitle': 'Reserve a parking spot',
        'icon': Icons.add_box,
        'route': '/bookingPage',
        'gradient': [accentColor, const Color(0xFF01573A)],
      },
      {
        'title': 'Booking History',
        'subtitle': 'View your past bookings',
        'icon': Icons.history,
        'route': '/booking-history',
        'gradient': [const Color(0xFF01573A), const Color(0xFF013A25)],
      },
      {
        'title': 'Billing History',
        'subtitle': 'View your parking sessions',
        'icon': Icons.receipt,
        'route': '/billing-history',
        'gradient': [const Color(0xFF013F28), const Color(0xFF012A1A)],
      },
      {
        'title': 'Transaction History',
        'subtitle': 'View all your payments',
        'icon': Icons.receipt_long,
        'route': '/transactions',
        'gradient': [const Color(0xFF015030), const Color(0xFF01432A)],
      },
      {
        'title': 'Nearest Parking',
        'subtitle': 'Find parking spots near you',
        'icon': Icons.map,
        'route': '/map',
        'gradient': [const Color(0xFF015740), highlightColor],
      },
    ];

    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'ParkEase',
        primaryColor: primaryColor,
        textColor: textColor,
        actions: [
          IconButton(
            icon: Icon(Icons.notifications_outlined, color: textColor),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(Icons.settings_outlined, color: textColor),
            onPressed: () => _showSettingsMenu(context),
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          image: const DecorationImage(
            image: NetworkImage(
              'https://www.transparenttextures.com/patterns/carbon-fibre.png',
            ),
            repeat: ImageRepeat.repeat,
          ),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              backgroundColor,
              const Color(0xFF121212),
              const Color(0xFF0A0A0A),
            ],
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          ProfileAvatar(
                            primaryColor: primaryColor,
                            highlightColor: highlightColor,
                          ),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Welcome Back!',
                                style: TextStyle(
                                  color: textColor,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                userName.isEmpty ? 'Guest User' : userName,
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      StatusCard(
                        location: 'Downtown Garage',
                        timeLeft: '2h 15m left',
                        primaryColor: primaryColor,
                        accentColor: accentColor,
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
                  child: SectionHeader(
                    title: 'Quick Access',
                    trailing: TextButton(
                      onPressed: () {},
                      style: ButtonStyle(                        backgroundColor: MaterialStateProperty.all(
                          Colors.white.withAlpha(20),
                        ),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                            side: BorderSide(color: Colors.white.withAlpha(50)),
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          Text(
                            'All Services',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Icon(
                            Icons.arrow_forward,
                            size: 16,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverGrid(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: isSmallScreen ? 2 : 3,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 0.9,
                  ),
                  delegate: SliverChildBuilderDelegate((context, index) {
                    return FeatureCard(
                      title: features[index]['title'],
                      subtitle: features[index]['subtitle'],
                      icon: features[index]['icon'],
                      route: features[index]['route'],
                      gradientColors: features[index]['gradient'],
                      textColor: textColor,
                    );
                  }, childCount: features.length),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SectionHeader(title: 'Recent Activities'),
                      const SizedBox(height: 16),
                      ActivityItem(
                        icon: Icons.local_parking,
                        title: 'Central Square Parking',
                        subtitle: '2 days ago · \$15.00',
                        color: highlightColor,
                      ),
                      ActivityItem(
                        icon: Icons.history,
                        title: 'Downtown Garage',
                        subtitle: '5 days ago · \$8.50',
                        color: accentColor,
                      ),
                      ActivityItem(
                        icon: Icons.directions_car,
                        title: 'Westfield Mall Parking',
                        subtitle: '1 week ago · \$12.00',
                        color: primaryColor,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 0, // Dashboard is usually the home tab (index 0)
        onTap: (index) {
          // Handle navigation based on index
          switch (index) {
            case 0:
              // Already on dashboard
              break;
            case 1:
              // Search functionality
              break;
            case 2:
              Navigator.pushReplacementNamed(context, '/enter-parking');
              break;
            case 3:
              // Saved functionality
              break;
            case 4:
              Navigator.pushReplacementNamed(context, '/profile');
              break;
          }
        },
        primaryColor: primaryColor,
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
