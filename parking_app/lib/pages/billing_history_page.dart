import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:convert';
import 'dart:typed_data';

import '../widgets/glassmorphic_app_bar.dart';
import '../widgets/glassmorphic_container.dart';
import '../widgets/section_header.dart';
import '../widgets/glassmorphic_bottom_nav_bar.dart';
import '../services/billing_service.dart';

class BillingHistoryPage extends StatefulWidget {
  const BillingHistoryPage({super.key});

  @override
  State<BillingHistoryPage> createState() => _BillingHistoryPageState();
}

class _BillingHistoryPageState extends State<BillingHistoryPage> {
  // Theme colors - matching the dashboard screen
  final Color backgroundColor = Colors.black;
  final Color primaryColor = const Color(0xFF013220);
  final Color accentColor = const Color(0xFF025939);
  final Color highlightColor = const Color(0xFF15A66E);
  final Color textColor = Colors.white;

  bool isLoading = true;
  List<Map<String, dynamic>> billingHistory = [];
  String selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    fetchBillingHistory();
  }

  Future<void> fetchBillingHistory() async {
    setState(() {
      isLoading = true;
    });

    try {
      final billingService = BillingService();
      final data = await billingService.fetchUserBillings();

      setState(() {
        billingHistory = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      debugPrint('Error fetching billing history: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load billing history: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Billing History',
        primaryColor: primaryColor,
        textColor: textColor,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh, color: textColor),
            onPressed: fetchBillingHistory,
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
                  : billingHistory.isEmpty
                  ? _buildEmptyState()
                  : CustomScrollView(
                    slivers: [                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),                        child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              SectionHeader(
                                title: 'Your Parking Records',
                              ),
                              Text(
                                'Review your parking history',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.7),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: _buildFilters(),
                        ),
                      ),
                      SliverPadding(
                        padding: const EdgeInsets.all(16.0),
                        sliver: SliverList(
                          delegate: SliverChildBuilderDelegate((
                            context,
                            index,
                          ) {
                            return _buildBillingItem(billingHistory[index]);
                          }, childCount: billingHistory.length),
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

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.history_outlined,
            size: 80,
            color: Colors.white.withOpacity(0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'No Parking Records Found',
            style: TextStyle(
              color: textColor,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Your parking history will appear here',
            style: TextStyle(color: textColor.withOpacity(0.7), fontSize: 16),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: fetchBillingHistory,
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryColor,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text('Refresh'),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return SingleChildScrollView(
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
            'Today',
            selectedFilter == 'Today',
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
            'This Month',
            selectedFilter == 'This Month',
            primaryColor,
            textColor,
          ),
        ],
      ),
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
            // TODO: Implement filtering logic based on selected filter
          });
        },
      ),
    );
  }

  Widget _buildBillingItem(Map<String, dynamic> billing) {
    // Format the entry time
    final entryTime =
        billing['entryTime'] != null
            ? DateTime.parse(billing['entryTime'])
            : DateTime.now();

    final formattedDate = DateFormat('MMM d, yyyy').format(entryTime);
    final formattedTime = DateFormat('h:mm a').format(entryTime);

    // Vehicle icon based on type
    IconData vehicleIcon = Icons.directions_car;
    if (billing['vehicleType'] == 'bicycle') {
      vehicleIcon = Icons.pedal_bike;
    } else if (billing['vehicleType'] == 'truck') {
      vehicleIcon = Icons.local_shipping;
    }

    return GestureDetector(
      onTap: () => _showBillingDetailsDialog(context, billing),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        child: GlassmorphicContainer(
          height: 130,
          gradientColors: [
            primaryColor.withAlpha(100),
            primaryColor.withAlpha(60),
          ],
          padding: const EdgeInsets.all(16),
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          billing['parkingName'] ?? 'Unknown Parking',
                          style: TextStyle(
                            color: textColor,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              color: textColor.withOpacity(0.7),
                              size: 14,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              formattedDate,
                              style: TextStyle(
                                color: textColor.withOpacity(0.7),
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.access_time,
                              color: textColor.withOpacity(0.7),
                              size: 14,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              formattedTime,
                              style: TextStyle(
                                color: textColor.withOpacity(0.7),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(
                        billing['paymentStatus'],
                      ).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: _getStatusColor(billing['paymentStatus']),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      billing['paymentStatus']?.toUpperCase() ?? 'PENDING',
                      style: TextStyle(
                        color: _getStatusColor(billing['paymentStatus']),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          vehicleIcon,
                          color: highlightColor,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        billing['vehicleType']?.toString().toUpperCase() ??
                            'CAR',
                        style: TextStyle(color: textColor, fontSize: 14),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Icon(Icons.qr_code, color: highlightColor, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'View QR',
                        style: TextStyle(
                          color: highlightColor,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showBillingDetailsDialog(
    BuildContext context,
    Map<String, dynamic> billing,
  ) {
    // Format the entry time
    final entryTime =
        billing['entryTime'] != null
            ? DateTime.parse(billing['entryTime'])
            : DateTime.now();

    final formattedDate = DateFormat('MMMM d, yyyy').format(entryTime);
    final formattedTime = DateFormat('h:mm a').format(entryTime);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(20),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: backgroundColor.withOpacity(0.9),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withAlpha(30), width: 1),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Parking Details',
                        style: TextStyle(
                          color: textColor,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.close, color: textColor),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // QR Code Section
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child:
                        billing['qrImage'] != null
                            ? Image.memory(
                              _convertBase64ToImage(billing['qrImage']),
                              width: 200,
                              height: 200,
                            )
                            : QrImageView(
                              data: billing['billingHash'] ?? 'Invalid QR Data',
                              version: QrVersions.auto,
                              size: 200,
                              backgroundColor: Colors.white,
                            ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Scan to validate parking',
                    style: TextStyle(
                      color: textColor.withOpacity(0.7),
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Parking Information
                  _buildInfoSection('Parking Information', [
                    _buildInfoRow(
                      'Location',
                      billing['parkingName'] ?? 'Unknown',
                      Icons.location_on,
                    ),
                    _buildInfoRow(
                      'Entry Date',
                      formattedDate,
                      Icons.calendar_today,
                    ),
                    _buildInfoRow(
                      'Entry Time',
                      formattedTime,
                      Icons.access_time,
                    ),
                    _buildInfoRow(
                      'Vehicle Type',
                      billing['vehicleType']?.toString().toUpperCase() ?? 'CAR',
                      Icons.directions_car,
                    ),
                    _buildInfoRow(
                      'Status',
                      billing['paymentStatus']?.toString().toUpperCase() ??
                          'PENDING',
                      Icons.info_outline,
                    ),
                  ]),
                  const SizedBox(height: 16),

                  // Billing Hash (ID)
                  _buildInfoSection('Billing ID', [
                    _buildInfoRow(
                      'Hash',
                      billing['billingHash'] ?? 'N/A',
                      Icons.tag,
                    ),
                  ]),
                  const SizedBox(height: 24),

                  // Action Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildActionButton('Share', Icons.share, () {
                        // TODO: Implement share functionality
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Sharing functionality coming soon'),
                          ),
                        );
                      }),
                      _buildActionButton('Download', Icons.download, () {
                        // TODO: Implement download functionality
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Download functionality coming soon'),
                          ),
                        );
                      }),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoSection(String title, List<Widget> items) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: textColor,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...items,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 16, color: highlightColor),
          const SizedBox(width: 8),
          Text(
            '$label:',
            style: TextStyle(color: textColor.withOpacity(0.7), fontSize: 14),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: textColor,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    String label,
    IconData icon,
    VoidCallback onPressed,
  ) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: Colors.white),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return Colors.green;
      case 'active':
        return Colors.blue;
      case 'cancelled':
        return Colors.red;
      case 'pending':
        return Colors.orange;
      default:
        return Colors.white;
    }
  }

  // Helper function to convert base64 string to image
  Uint8List _convertBase64ToImage(String base64String) {
    String base64 = base64String;
    // Remove data:image/png;base64, if it exists
    if (base64.contains(',')) {
      base64 = base64.split(',')[1];
    }
    return base64Decode(base64);
  }
}
