import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart'; // For date formatting

class QRPreviewPage extends StatefulWidget {
  final Map<String, dynamic> qrData;

  const QRPreviewPage({super.key, required this.qrData});

  @override
  State<QRPreviewPage> createState() => _QRPreviewPageState();
}

class _QRPreviewPageState extends State<QRPreviewPage> {
  String selectedPaymentMethod = 'cash'; // Default payment method
  bool isProcessing = false;

  @override
  Widget build(BuildContext context) {
    // Check response code to determine which view to show
    final String responseCode = widget.qrData['response_Code'] ?? '';

    if (responseCode == 'BILLING_CALCULATED') {
      return _buildBillingReceipt(context);
    } else if (responseCode == 'ALREADY_PAID') {
      return _buildAlreadyPaidView(context);
    }

    // Default QR preview for other response types
    // Extract key data from the QR response
    final String vehicleNumber = widget.qrData['vehicleNumber'] ?? 'Unknown';
    final String parkingSlot = widget.qrData['parkingSlot'] ?? 'Unknown';
    final String status = widget.qrData['status'] ?? 'Unknown';
    final bool isValid = widget.qrData['isValid'] ?? false;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('QR Details'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(
                  color: isValid ? Colors.green.shade300 : Colors.red.shade300,
                  width: 2,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Icon(
                      isValid ? Icons.check_circle : Icons.cancel,
                      color: isValid ? Colors.green : Colors.red,
                      size: 64,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      isValid ? 'Valid QR Code' : 'Invalid QR Code',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color:
                            isValid
                                ? Colors.green.shade700
                                : Colors.red.shade700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      status,
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Vehicle Details
            const Text(
              'Vehicle Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF013220),
              ),
            ),
            const SizedBox(height: 12),
            _buildDetailCard(
              icon: Icons.directions_car,
              title: 'Vehicle Number',
              value: vehicleNumber,
            ),

            const SizedBox(height: 16),
            _buildDetailCard(
              icon: Icons.local_parking,
              title: 'Parking Slot',
              value: parkingSlot,
            ),

            // Additional details can be added here
            const Spacer(),

            // Action buttons
            ElevatedButton(
              onPressed: () {
                // Handle action based on QR validity
                if (isValid) {
                  // For example, mark the parking as verified
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Parking verified successfully'),
                    ),
                  );
                }
                context.go('/scanner');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF013220),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(isValid ? 'Confirm Verification' : 'Scan Again'),
            ),
          ],
        ),
      ),
    );
  }

  // Building the billing receipt view
  Widget _buildBillingReceipt(BuildContext context) {
    // Extract billing data from response
    final billingData = widget.qrData['data']?['billing'] ?? {};
    final double calculatedFee =
        (widget.qrData['data']?['calculatedFee'] ?? 0).toDouble();
    final int duration = widget.qrData['data']?['duration'] ?? 0;

    // Parse dates from string to DateTime objects
    final entryTime =
        billingData['entryTime'] != null
            ? DateTime.parse(billingData['entryTime'])
            : DateTime.now();
    final exitTime =
        widget.qrData['data']?['exitTime'] != null
            ? DateTime.parse(widget.qrData['data']?['exitTime'])
            : DateTime.now();

    // Format dates for display
    final dateFormat = DateFormat('MMM dd, yyyy');
    final timeFormat = DateFormat('hh:mm a');

    // Format duration for display
    String formattedDuration = '';
    if (duration < 60) {
      formattedDuration = '$duration minutes';
    } else {
      final hours = duration ~/ 60;
      final minutes = duration % 60;
      formattedDuration = '$hours hour${hours > 1 ? 's' : ''}';
      if (minutes > 0) {
        formattedDuration += ' $minutes minute${minutes > 1 ? 's' : ''}';
      }
    }

    // Get vehicle type from billing data
    final String vehicleType =
        (billingData['vehicleType'] ?? 'Car').toUpperCase();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('Parking Receipt'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Receipt Card with fee
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.green.shade300, width: 2),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    const Icon(
                      Icons.receipt_long,
                      color: Color(0xFF013220),
                      size: 64,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Parking Fee',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF013220),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Rs. ${calculatedFee.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF013220),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      billingData['paymentStatus'] ?? 'pending',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Parking Details Section
            const Text(
              'Parking Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF013220),
              ),
            ),
            const SizedBox(height: 12),

            _buildDetailCard(
              icon: Icons.directions_car,
              title: 'Vehicle Type',
              value: vehicleType,
            ),

            const SizedBox(height: 12),
            _buildDetailCard(
              icon: Icons.timer,
              title: 'Duration',
              value: formattedDuration,
            ),

            const SizedBox(height: 12),
            _buildDetailCard(
              icon: Icons.login,
              title: 'Entry Time',
              value:
                  '${dateFormat.format(entryTime)} at ${timeFormat.format(entryTime)}',
            ),

            const SizedBox(height: 12),
            _buildDetailCard(
              icon: Icons.logout,
              title: 'Exit Time',
              value:
                  '${dateFormat.format(exitTime)} at ${timeFormat.format(exitTime)}',
            ),

            const Spacer(),

            // Action Buttons - Row with cancel and confirm
            Row(
              children: [
                // Cancel button
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => context.go('/scanner'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade200,
                      foregroundColor: Colors.black87,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 16),
                // Confirm button
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Show confirmation message
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Payment confirmed!'),
                          backgroundColor: Color(0xFF013220),
                        ),
                      );
                      // Navigate back to scanner
                      context.go('/scanner');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF013220),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Confirm'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Building the already paid notification view
  Widget _buildAlreadyPaidView(BuildContext context) {
    // Get the message from the backend, or use a default message if not available
    final String message =
        widget.qrData['message'] ??
        'This QR code has already been used for payment';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('QR Already Used'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Already Paid Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.red.shade300, width: 2),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Icon(Icons.cancel, color: Colors.red.shade700, size: 64),
                    const SizedBox(height: 16),
                    const Text(
                      'Invalid QR Code',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      message,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),

            const Spacer(),

            // Back to scanner button
            ElevatedButton(
              onPressed: () => context.go('/scanner'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF013220),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Back to Scanner'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailCard({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF013220), size: 28),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
