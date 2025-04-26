import 'package:flutter/material.dart';
import 'package:parking_app/widgets/gradient_button.dart';

import 'package:parking_app/widgets/glassmorphic_app_bar.dart';
import 'package:parking_app/widgets/glassmorphic_container.dart';
import 'package:parking_app/widgets/section_header.dart';

class BookingHistory extends StatelessWidget {
  const BookingHistory({super.key});

  @override
  Widget build(BuildContext context) {
    // Theme colors - matching the dashboard screen
    final Color backgroundColor = Colors.black;
    final Color primaryColor = const Color(0xFF013220);
    final Color accentColor = const Color(0xFF025939);
    final Color highlightColor = const Color(0xFF15A66E);
    final Color textColor = Colors.white;

    // Sample booking history data
    final List<Map<String, dynamic>> bookingHistory = [
      {
        'location': 'Downtown Garage',
        'date': 'Apr 15, 2025',
        'duration': '2h 30m',
        'cost': '\$15.50',
        'status': 'Completed',
        'color': highlightColor,
      },
      {
        'location': 'Central Square Parking',
        'date': 'Apr 12, 2025',
        'duration': '3h 15m',
        'cost': '\$18.75',
        'status': 'Completed',
        'color': primaryColor,
      },
      {
        'location': 'Westfield Mall Parking',
        'date': 'Apr 8, 2025',
        'duration': '1h 45m',
        'cost': '\$8.25',
        'status': 'Completed',
        'color': accentColor,
      },
      {
        'location': 'Airport Terminal Parking',
        'date': 'Apr 3, 2025',
        'duration': '5h 00m',
        'cost': '\$28.50',
        'status': 'Completed',
        'color': highlightColor,
      },
      {
        'location': 'City Center Garage',
        'date': 'Mar 29, 2025',
        'duration': '2h 10m',
        'cost': '\$12.00',
        'status': 'Completed',
        'color': primaryColor,
      },
      {
        'location': 'Harbor View Parking',
        'date': 'Mar 23, 2025',
        'duration': '4h 30m',
        'cost': '\$22.50',
        'status': 'Completed',
        'color': accentColor,
      },
    ];

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
          child: CustomScrollView(
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
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                              'April 2025',
                              style: TextStyle(
                                color: textColor.withAlpha(180),
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildSummaryItem(
                              'Total Spent',
                              '\$85.50',
                              Icons.attach_money,
                              highlightColor,
                            ),
                            _buildSummaryItem(
                              'Hours Parked',
                              '16h 40m',
                              Icons.access_time,
                              accentColor,
                            ),
                            _buildSummaryItem(
                              'Bookings',
                              '6',
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
                        _buildFilterChip('All', true, primaryColor, textColor),
                        _buildFilterChip(
                          'This Week',
                          false,
                          primaryColor,
                          textColor,
                        ),
                        _buildFilterChip(
                          'Last Month',
                          false,
                          primaryColor,
                          textColor,
                        ),
                        _buildFilterChip(
                          'This Year',
                          false,
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
                  child: SectionHeader(
                    title: 'Booking History',
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
                          Text('Export', style: TextStyle(color: Colors.white)),
                          const SizedBox(width: 4),
                          Icon(Icons.download, size: 16, color: Colors.white),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Booking history list
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
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
      // Bottom navigation bar has been removed as requested
      floatingActionButton: GradientButton(
        text: 'Filter Results',
        icon: Icons.filter_alt,
        onPressed: () {},
        gradientColors: [primaryColor, highlightColor],
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
        onSelected: (selected) {},
      ),
    );
  }

  Widget _buildBookingHistoryItem(
    Map<String, dynamic> booking,
    Color textColor,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: GlassmorphicContainer(
        height: 180, // Added required height parameter
        gradientColors: [
          booking['color'].withAlpha(100),
          booking['color'].withAlpha(60),
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
                        color: booking['color'],
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
