import 'package:flutter/material.dart';
import 'glassmorphic_container.dart';
import 'status_indicator.dart';

class StatusCard extends StatelessWidget {
  final String location;
  final String timeLeft;
  final Color primaryColor;
  final Color accentColor;

  const StatusCard({
    super.key,
    required this.location,
    required this.timeLeft,
    required this.primaryColor,
    required this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    return GlassmorphicContainer(
      height: 160, // Added the required height parameter
      gradientColors: [primaryColor.withAlpha(160), accentColor.withAlpha(160)],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withAlpha(40),
                  border: Border.all(color: Colors.white, width: 1),
                ),
                child: const Icon(Icons.local_parking, color: Colors.white),
              ),
              const SizedBox(width: 14),
              const Text(
                'Current Status',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(15),
              color: Colors.white.withAlpha(20),
              border: Border.all(color: Colors.white.withAlpha(40), width: 1),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Ongoing Booking',
                      style: TextStyle(
                        color: Colors.white.withAlpha(180),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const StatusIndicator(color: Colors.greenAccent),
                        const SizedBox(width: 8),
                        Text(
                          location,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30),
                    color: Colors.white,
                  ),
                  child: Text(
                    timeLeft,
                    style: TextStyle(
                      color: primaryColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
