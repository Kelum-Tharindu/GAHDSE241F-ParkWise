import 'package:flutter/material.dart';
// ignore: unused_import
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart'; // Add this import for date parsing

import 'package:parking_app/widgets/glassmorphic_app_bar.dart';
import 'package:parking_app/widgets/glassmorphic_container.dart';
import 'package:parking_app/widgets/section_header.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';
import 'package:parking_app/services/booking_service.dart';

class BookingHistory extends StatefulWidget {
  const BookingHistory({super.key});

  @override
  State<BookingHistory> createState() => _BookingHistoryState();
}

class _BookingHistoryState extends State<BookingHistory> {
  // Theme colors - matching the dashboard screen
  final Color backgroundColor = Colors.black;
  final Color primaryColor = const Color(0xFF013220);
  final Color accentColor = const Color(0xFF025939);
  final Color highlightColor = const Color(0xFF15A66E);
  final Color textColor = Colors.white;

  bool isLoading = true;
  List<Map<String, dynamic>> bookingHistory = [];
  Map<String, dynamic> summary = {
    'month': 'N/A',
    'totalSpent': '\$0.00',
    'hoursParked': '0h 0m',
    'bookingsCount': '0',
  };
  String selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    fetchBookingHistory();
  }

  Future<void> fetchBookingHistory() async {
    setState(() {
      isLoading = true;
    });

    try {
      final bookingService = BookingService();
      final data = await bookingService.fetchBookingData();

      List<Map<String, dynamic>> allBookings = List<Map<String, dynamic>>.from(
        data['bookings'] ?? [],
      );

      // Apply filter logic
      List<Map<String, dynamic>> filteredBookings = allBookings;
      if (selectedFilter == 'This Week') {
        final now = DateTime.now();
        final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
        filteredBookings =
            allBookings.where((booking) {
              final bookingDate = DateFormat(
                'MMM d, yyyy',
              ).parse(booking['date']);
              return bookingDate.isAfter(startOfWeek) &&
                  bookingDate.isBefore(now);
            }).toList();
        debugPrint('!!Filtered bookings for "This Week": $filteredBookings');
      } else if (selectedFilter == 'Last Month') {
        final now = DateTime.now();
        final startOfLastMonth = DateTime(now.year, now.month - 1, 1);
        final endOfLastMonth = DateTime(now.year, now.month, 0);
        filteredBookings =
            allBookings.where((booking) {
              final bookingDate = DateFormat(
                'MMM d, yyyy',
              ).parse(booking['date']);
              return bookingDate.isAfter(startOfLastMonth) &&
                  bookingDate.isBefore(endOfLastMonth);
            }).toList();
        debugPrint('!!!Filtered bookings for "Last Month": $filteredBookings');
      } else if (selectedFilter == 'This Year') {
        final now = DateTime.now();
        final startOfYear = DateTime(now.year, 1, 1);
        filteredBookings =
            allBookings.where((booking) {
              final bookingDate = DateFormat(
                'MMM d, yyyy',
              ).parse(booking['date']);
              return bookingDate.isAfter(startOfYear) &&
                  bookingDate.isBefore(now);
            }).toList();
        debugPrint('!!Filtered bookings for "This Year": $filteredBookings');
      } else {
        debugPrint('!!All bookings: $allBookings');
      }

      setState(() {
        bookingHistory = filteredBookings;
        summary =
            data['summary'] ??
            {
              'month': 'N/A',
              'totalSpent': '\$0.00',
              'hoursParked': '0h 0m',
              'bookingsCount': '0',
            };
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      debugPrint('Error fetching booking history: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Booking History',
        primaryColor: primaryColor,
        textColor: textColor,
        actions: [
          IconButton(
            icon: Icon(Icons.filter_list, color: textColor),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(Icons.calendar_today_outlined, color: textColor),
            onPressed: () {},
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          // Add subtle pattern background
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
          child:
              isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : CustomScrollView(
                    slivers: [
                      // Summary Section
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 24, 20, 10),
                          child: GlassmorphicContainer(
                            height: 160, // Added required height parameter
                            gradientColors: [
                              primaryColor.withAlpha(160),
                              accentColor.withAlpha(160),
                            ],
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'This Month',
                                      style: TextStyle(
                                        color: textColor,
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    Text(
                                      summary['month'] ?? 'N/A',
                                      style: TextStyle(
                                        color: textColor.withAlpha(180),
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 20),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    _buildSummaryItem(
                                      'Total Spent',
                                      summary['totalSpent'] ?? '\$0.00',
                                      Icons.attach_money,
                                      highlightColor,
                                    ),
                                    _buildSummaryItem(
                                      'Hours Parked',
                                      summary['hoursParked'] ?? '0h 0m',
                                      Icons.access_time,
                                      accentColor,
                                    ),
                                    _buildSummaryItem(
                                      'Bookings',
                                      summary['bookingsCount'] ?? '0',
                                      Icons.local_parking,
                                      primaryColor,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Filter buttons
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                _buildFilterChip(
                                  'All',
                                  selectedFilter == 'All',
                                  primaryColor,
                                  textColor,
                                ),
                                _buildFilterChip(
                                  'This Week',
                                  selectedFilter == 'This Week',
                                  primaryColor,
                                  textColor,
                                ),
                                _buildFilterChip(
                                  'Last Month',
                                  selectedFilter == 'Last Month',
                                  primaryColor,
                                  textColor,
                                ),
                                _buildFilterChip(
                                  'This Year',
                                  selectedFilter == 'This Year',
                                  primaryColor,
                                  textColor,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // History section header
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                          child: SectionHeader(title: 'Booking History'),
                        ),
                      ),

                      // Booking history list or empty state
                      bookingHistory.isEmpty
                          ? SliverToBoxAdapter(
                            child: Center(
                              child: Padding(
                                padding: const EdgeInsets.all(20.0),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.history,
                                      size: 80,
                                      color: Color.fromRGBO(255, 255, 255, 0.5),
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      'No booking history found',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          )
                          : SliverPadding(
                            padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                            sliver: SliverList(
                              delegate: SliverChildBuilderDelegate((
                                context,
                                index,
                              ) {
                                return _buildBookingHistoryItem(
                                  bookingHistory[index],
                                  textColor,
                                );
                              }, childCount: bookingHistory.length),
                            ),
                          ),
                    ],
                  ),
        ),
      ),

      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 0, // Set appropriate index based on navigation
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

  Widget _buildSummaryItem(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withAlpha(30),
            border: Border.all(color: Colors.white.withAlpha(70), width: 1),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(height: 10),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          title,
          style: TextStyle(color: Colors.white.withAlpha(160), fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildFilterChip(
    String label,
    bool isSelected,
    Color primaryColor,
    Color textColor,
  ) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      child: FilterChip(
        selected: isSelected,
        label: Text(label),
        labelStyle: TextStyle(
          color: isSelected ? primaryColor : textColor,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        backgroundColor: Colors.white.withAlpha(20),
        selectedColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
          side: BorderSide(color: Colors.white.withAlpha(70), width: 1),
        ),
        onSelected: (selected) {
          setState(() {
            selectedFilter = label;
          });
          fetchBookingHistory(); // Ensure the booking history is updated
        },
      ),
    );
  }

  Widget _buildBookingHistoryItem(
    Map<String, dynamic> booking,
    Color textColor,
  ) {
    // Convert JSON map to Color object
    final Color bookingColor =
        booking['color'] != null
            ? Color.fromRGBO(
              booking['color']['r'],
              booking['color']['g'],
              booking['color']['b'],
              booking['color']['a'].toDouble(),
            )
            : primaryColor; // Default to primaryColor if null

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: GlassmorphicContainer(
        height: 180, // Added required height parameter
        gradientColors: [
          bookingColor.withAlpha(100),
          bookingColor.withAlpha(60),
        ],
        padding: const EdgeInsets.all(16),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                      ),
                      child: Icon(
                        Icons.local_parking,
                        color: bookingColor,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          booking['location'],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          booking['date'],
                          style: TextStyle(
                            color: Colors.white.withAlpha(160),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30),
                    color: Colors.white.withAlpha(30),
                    border: Border.all(
                      color: Colors.white.withAlpha(70),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    booking['cost'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: Colors.white.withAlpha(20),
                border: Border.all(color: Colors.white.withAlpha(40), width: 1),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildBookingDetail(
                    'Duration',
                    booking['duration'],
                    Icons.timer_outlined,
                  ),
                  Container(
                    height: 30,
                    width: 1,
                    color: Colors.white.withAlpha(70),
                  ),
                  _buildBookingDetail(
                    'Status',
                    booking['status'],
                    Icons.check_circle_outline,
                  ),
                  Container(
                    height: 30,
                    width: 1,
                    color: Colors.white.withAlpha(70),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: Row(
                      children: [
                        const Text(
                          'Details',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          Icons.arrow_forward_ios,
                          color: Colors.white,
                          size: 12,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingDetail(String title, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Colors.white, size: 16),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                color: Colors.white.withAlpha(160),
                fontSize: 12,
              ),
            ),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
