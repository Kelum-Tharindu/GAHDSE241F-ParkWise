import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class QRPreviewPage extends StatelessWidget {
  final Map<String, dynamic> qrData;

  const QRPreviewPage({super.key, required this.qrData});

  @override
  Widget build(BuildContext context) {
    // Extract key data from the QR response
    final String vehicleNumber = qrData['vehicleNumber'] ?? 'Unknown';
    final String parkingSlot = qrData['parkingSlot'] ?? 'Unknown';
    final String status = qrData['status'] ?? 'Unknown';
    final bool isValid = qrData['isValid'] ?? false;

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
