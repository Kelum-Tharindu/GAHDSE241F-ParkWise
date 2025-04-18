import 'package:flutter/material.dart';
import 'package:parking_app/widgets/glassmorphic_app_bar.dart';
import 'package:parking_app/widgets/glassmorphic_container.dart';
import 'package:parking_app/widgets/gradient_button.dart';
import 'dart:ui';

class AddBooking extends StatefulWidget {
  const AddBooking({super.key});

  @override
  State<AddBooking> createState() => _AddBookingScreenState();
}

class _AddBookingScreenState extends State<AddBooking> {
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _timeController = TextEditingController();
  final TextEditingController _durationController = TextEditingController();
  String _selectedLocation = 'Downtown Garage';
  String _selectedVehicle = 'Tesla Model 3';

  @override
  void initState() {
    super.initState();
    _dateController.text = 'Apr 18, 2025';
    _timeController.text = '14:30';
    _durationController.text = '2h 00m';
  }

  @override
  void dispose() {
    _dateController.dispose();
    _timeController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Theme colors - matching the dashboard screen
    final Color backgroundColor = Colors.black;
    final Color primaryColor = const Color(0xFF013220);
    final Color accentColor = const Color(0xFF025939);
    final Color highlightColor = const Color(0xFF15A66E);
    final Color textColor = Colors.white;

    // Sample location data
    final List<String> locations = [
      'Downtown Garage',
      'Central Square Parking',
      'Westfield Mall Parking',
      'Airport Terminal Parking',
      'City Center Garage',
      'Harbor View Parking',
    ];

    // Sample vehicles
    final List<String> vehicles = [
      'Tesla Model 3',
      'Toyota Camry',
      'Honda Civic',
    ];

    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Add Booking',
        primaryColor: primaryColor,
        textColor: textColor,
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header section
                SectionHeader(
                  title: 'New Parking Reservation',
                  trailing: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withAlpha(30),
                      border: Border.all(
                        color: Colors.white.withAlpha(70),
                        width: 1,
                      ),
                    ),
                    child: Icon(
                      Icons.local_parking,
                      color: highlightColor,
                      size: 24,
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Location selection
                _buildSectionTitle(
                  'Select Parking Location',
                  Icons.location_on,
                  textColor,
                ),
                const SizedBox(height: 12),
                GlassmorphicContainer(
                  gradientColors: [
                    primaryColor.withAlpha(140),
                    accentColor.withAlpha(140),
                  ],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 4,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      isExpanded: true,
                      value: _selectedLocation,
                      dropdownColor: primaryColor.withAlpha(240),
                      style: TextStyle(color: textColor, fontSize: 16),
                      icon: Icon(Icons.keyboard_arrow_down, color: textColor),
                      items:
                          locations.map((String location) {
                            return DropdownMenuItem<String>(
                              value: location,
                              child: Text(location),
                            );
                          }).toList(),
                      onChanged: (String? newValue) {
                        if (newValue != null) {
                          setState(() {
                            _selectedLocation = newValue;
                          });
                        }
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Vehicle selection
                _buildSectionTitle(
                  'Select Vehicle',
                  Icons.directions_car,
                  textColor,
                ),
                const SizedBox(height: 12),
                GlassmorphicContainer(
                  gradientColors: [
                    primaryColor.withAlpha(140),
                    accentColor.withAlpha(140),
                  ],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 4,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      isExpanded: true,
                      value: _selectedVehicle,
                      dropdownColor: primaryColor.withAlpha(240),
                      style: TextStyle(color: textColor, fontSize: 16),
                      icon: Icon(Icons.keyboard_arrow_down, color: textColor),
                      items:
                          vehicles.map((String vehicle) {
                            return DropdownMenuItem<String>(
                              value: vehicle,
                              child: Text(vehicle),
                            );
                          }).toList(),
                      onChanged: (String? newValue) {
                        if (newValue != null) {
                          setState(() {
                            _selectedVehicle = newValue;
                          });
                        }
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Date and time section
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle(
                            'Date',
                            Icons.calendar_today,
                            textColor,
                          ),
                          const SizedBox(height: 12),
                          _buildInputField(
                            controller: _dateController,
                            hintText: 'Select date',
                            icon: Icons.event,
                            onTap: () async {
                              // Date picker would be implemented here
                            },
                            readOnly: true,
                            primaryColor: primaryColor,
                            accentColor: accentColor,
                            textColor: textColor,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle(
                            'Time',
                            Icons.access_time,
                            textColor,
                          ),
                          const SizedBox(height: 12),
                          _buildInputField(
                            controller: _timeController,
                            hintText: 'Select time',
                            icon: Icons.access_time_filled,
                            onTap: () async {
                              // Time picker would be implemented here
                            },
                            readOnly: true,
                            primaryColor: primaryColor,
                            accentColor: accentColor,
                            textColor: textColor,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Duration section
                _buildSectionTitle('Parking Duration', Icons.timer, textColor),
                const SizedBox(height: 12),
                _buildInputField(
                  controller: _durationController,
                  hintText: 'Enter duration',
                  icon: Icons.timer_outlined,
                  onTap: () async {
                    // Duration selector would be implemented here
                  },
                  readOnly: true,
                  primaryColor: primaryColor,
                  accentColor: accentColor,
                  textColor: textColor,
                ),

                const SizedBox(height: 24),

                // Pricing summary
                _buildSectionTitle(
                  'Pricing Summary',
                  Icons.attach_money,
                  textColor,
                ),
                const SizedBox(height: 12),
                GlassmorphicContainer(
                  gradientColors: [
                    highlightColor.withAlpha(140),
                    highlightColor.withAlpha(100),
                  ],
                  padding: const EdgeInsets.all(16),
                  borderRadius: BorderRadius.circular(16),
                  child: Column(
                    children: [
                      _buildPricingRow(
                        'Parking Rate',
                        '\$6.50/hour',
                        textColor,
                      ),
                      const SizedBox(height: 8),
                      _buildPricingRow('Duration', '2 hours', textColor),
                      const SizedBox(height: 8),
                      _buildPricingRow('Reservation Fee', '\$1.50', textColor),
                      const SizedBox(height: 8),
                      Divider(color: Colors.white.withAlpha(100)),
                      const SizedBox(height: 8),
                      _buildPricingRow(
                        'Total',
                        '\$14.50',
                        textColor,
                        isTotal: true,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // Action buttons
                Row(
                  children: [
                    Expanded(
                      child: GradientButton(
                        text: 'Cancel',
                        icon: Icons.close,
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        gradientColors: [
                          Colors.grey.shade700,
                          Colors.grey.shade600,
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      flex: 2,
                      child: GradientButton(
                        text: 'Confirm Booking',
                        icon: Icons.check_circle_outline,
                        onPressed: () {
                          // Implement booking confirmation logic
                        },
                        gradientColors: [primaryColor, highlightColor],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon, Color textColor) {
    return Row(
      children: [
        Icon(icon, color: textColor, size: 18),
        const SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            color: textColor,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    required Function() onTap,
    required bool readOnly,
    required Color primaryColor,
    required Color accentColor,
    required Color textColor,
  }) {
    return GlassmorphicContainer(
      gradientColors: [primaryColor.withAlpha(140), accentColor.withAlpha(140)],
      padding: const EdgeInsets.symmetric(horizontal: 16),
      borderRadius: BorderRadius.circular(16),
      child: TextField(
        controller: controller,
        readOnly: readOnly,
        onTap: onTap,
        style: TextStyle(color: textColor),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: textColor.withAlpha(150)),
          border: InputBorder.none,
          suffixIcon: Icon(icon, color: textColor),
        ),
      ),
    );
  }

  Widget _buildPricingRow(
    String label,
    String value,
    Color textColor, {
    bool isTotal = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: textColor.withAlpha(isTotal ? 255 : 180),
            fontSize: isTotal ? 16 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: textColor,
            fontSize: isTotal ? 18 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String title;
  final Widget? trailing;

  const SectionHeader({super.key, required this.title, this.trailing});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        if (trailing != null) trailing!,
      ],
    );
  }
}
