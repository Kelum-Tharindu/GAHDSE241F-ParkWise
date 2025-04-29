import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:convert';
import '../widgets/glassmorphic_app_bar.dart';
import '../widgets/glassmorphic_container.dart';
import '../widgets/gradient_button.dart';
import '../widgets/detail_row.dart';

class BookingPreviewScreen extends StatelessWidget {
  final String parkingName;
  final String vehicleType;
  final DateTime entryTime;
  final DateTime exitTime;
  final double usageFee;
  final double bookingFee;
  final double totalFee;
  final String duration;
  final String qrImage;
  final String paymentStatus;
  final String bookingState;

  const BookingPreviewScreen({
    super.key,
    required this.parkingName,
    required this.vehicleType,
    required this.entryTime,
    required this.exitTime,
    required this.usageFee,
    required this.bookingFee,
    required this.totalFee,
    required this.duration,
    required this.qrImage,
    required this.paymentStatus,
    required this.bookingState,
  });

  @override
  Widget build(BuildContext context) {
    // Theme colors
    final Color backgroundColor = Colors.black;
    final Color primaryColor = const Color(0xFF013220);
    final Color accentColor = const Color(0xFF025939);
    final Color highlightColor = const Color(0xFF15A66E);
    final Color textColor = Colors.white;

    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Booking Confirmation',
        primaryColor: primaryColor,
        textColor: textColor,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
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
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  color: Color(0xFF15A66E),
                  size: 80,
                ),
                const SizedBox(height: 16),
                Text(
                  'Booking Confirmed!',
                  style: TextStyle(
                    color: textColor,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your parking has been successfully booked',
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                ),
                const SizedBox(height: 30),
                GlassmorphicContainer(
                  height: 400,
                  gradientColors: const [Color(0xFF013220), Color(0xFF025939)],
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        DetailRow(
                          label: 'Booking ID',
                          value:
                              '#${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
                        ),
                        DetailRow(
                          label: 'Parking Location',
                          value: parkingName,
                        ),
                        DetailRow(
                          label: 'Vehicle Type',
                          value: vehicleType.toUpperCase(),
                        ),
                        DetailRow(
                          label: 'Entry Time',
                          value: DateFormat(
                            'MMM dd, yyyy - HH:mm',
                          ).format(entryTime),
                        ),
                        DetailRow(
                          label: 'Exit Time',
                          value: DateFormat(
                            'MMM dd, yyyy - HH:mm',
                          ).format(exitTime),
                        ),
                        DetailRow(label: 'Duration', value: duration),
                        DetailRow(
                          label: 'Payment Status',
                          value: paymentStatus,
                        ),
                        DetailRow(label: 'Booking State', value: bookingState),
                        const Divider(color: Colors.white30),
                        DetailRow(
                          label: 'Usage Fee',
                          value: '\$${usageFee.toStringAsFixed(2)}',
                        ),
                        DetailRow(
                          label: 'Booking Fee',
                          value: '\$${bookingFee.toStringAsFixed(2)}',
                        ),
                        const Divider(color: Colors.white30),
                        DetailRow(
                          label: 'Total Fee',
                          value: '\$${totalFee.toStringAsFixed(2)}',
                          isHighlighted: true,
                        ),
                        const SizedBox(height: 20),
                        GestureDetector(
                          onTap: () {
                            showDialog(
                              context: context,
                              builder:
                                  (context) => Dialog(
                                    backgroundColor: Colors.transparent,
                                    child: Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: Colors.black,
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Text(
                                            'QR Code Preview',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 18,
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          Image.memory(
                                            base64Decode(qrImage.split(',')[1]),
                                            height: 300,
                                            width: 300,
                                          ),
                                          const SizedBox(height: 16),
                                          TextButton(
                                            onPressed:
                                                () => Navigator.pop(context),
                                            child: const Text(
                                              'Close',
                                              style: TextStyle(
                                                color: Colors.white70,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                            );
                          },
                          child: Image.memory(
                            base64Decode(qrImage.split(',')[1]),
                            height: 150,
                            width: 150,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 30),

                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: GradientButton(
                        text: 'Back to Home',
                        onPressed: () {
                          Navigator.popUntil(context, (route) => route.isFirst);
                        },
                        gradientColors: [accentColor, highlightColor],
                        icon: Icons.home,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
