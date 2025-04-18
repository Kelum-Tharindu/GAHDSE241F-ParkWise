import 'package:flutter/material.dart';
import '../widgets/glassmorphic_app_bar.dart';
import '../widgets/profile_avatar.dart';
import '../widgets/status_card.dart';
import '../widgets/section_header.dart';
import '../widgets/feature_card.dart';
import '../widgets/activity_item.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

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
      {
        'title': 'Ongoing',
        'subtitle': 'Track active parking sessions',
        'icon': Icons.directions_car,
        'route': '/ongoing',
        'gradient': [const Color(0xFF025939), const Color(0xFF017455)],
      },
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
        'route': '/add-booking',
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
        'title': 'Nearest Parking',
        'subtitle': 'Find parking spots near you',
        'icon': Icons.map,
        'route': '/nearest-parking',
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
            onPressed: () {},
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
                                'John Doe',
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
                      style: ButtonStyle(
                        backgroundColor: WidgetStateProperty.all(
                          Colors.white.withAlpha(20),
                        ),
                        shape: WidgetStateProperty.all(
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
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Colors.white,
        child: Icon(Icons.add, color: primaryColor),
      ),
    );
  }
}
