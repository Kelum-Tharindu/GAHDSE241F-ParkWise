import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart'; // For date formatting
import 'package:scanner_app/services/api_service.dart'; // Import ApiService

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
    } else if (responseCode == 'Error') {
      return _buildAlreadyPaidView(context);
    } else if (responseCode == 'EXTRA_FEE') {
      return _buildExtraFeeView(context);
    } else if (responseCode == 'NO_EXTRA_FEE') {
      return _buildNoExtraFeeView(context);
    } else if (responseCode == 'BOOKING_ONGOING') {
      return _buildBookingOngoingView(context);
    } else if (responseCode == 'BOOKING_ACTIVATED') {
      return _buildBookingActivatedView(context);
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Scrollable content area
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Status Card
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color:
                                isValid
                                    ? Colors.green.shade300
                                    : Colors.red.shade300,
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
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey,
                                ),
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
                      const SizedBox(height: 24),

                      // Payment Method Selection
                      const Text(
                        'Payment Method',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Payment method selection card
                      Card(
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            children: [
                              // Cash option
                              RadioListTile<String>(
                                title: const Row(
                                  children: [
                                    Icon(Icons.money, color: Color(0xFF013220)),
                                    SizedBox(width: 8),
                                    Text('Cash Payment'),
                                  ],
                                ),
                                value: 'cash',
                                groupValue: selectedPaymentMethod,
                                activeColor: const Color(0xFF013220),
                                onChanged: (value) {
                                  setState(() {
                                    selectedPaymentMethod = value!;
                                  });
                                },
                              ),
                              // Card option
                              RadioListTile<String>(
                                title: const Row(
                                  children: [
                                    Icon(
                                      Icons.credit_card,
                                      color: Color(0xFF013220),
                                    ),
                                    SizedBox(width: 8),
                                    Text('Card Payment'),
                                  ],
                                ),
                                value: 'card',
                                groupValue: selectedPaymentMethod,
                                activeColor: const Color(0xFF013220),
                                onChanged: (value) {
                                  setState(() {
                                    selectedPaymentMethod = value!;
                                  });
                                },
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Add bottom padding for scrolling comfort
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Use Expanded with SingleChildScrollView to make content scrollable
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Receipt Card with fee
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: Colors.green.shade300,
                            width: 2,
                          ),
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

                      const SizedBox(height: 24),

                      // Payment Method Selection
                      const Text(
                        'Payment Method',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Payment method selection card
                      Card(
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            children: [
                              // Cash option
                              RadioListTile<String>(
                                title: const Row(
                                  children: [
                                    Icon(Icons.money, color: Color(0xFF013220)),
                                    SizedBox(width: 8),
                                    Text('Cash Payment'),
                                  ],
                                ),
                                value: 'cash',
                                groupValue: selectedPaymentMethod,
                                activeColor: const Color(0xFF013220),
                                onChanged: (value) {
                                  setState(() {
                                    selectedPaymentMethod = value!;
                                  });
                                },
                              ),
                              // Card option
                              RadioListTile<String>(
                                title: const Row(
                                  children: [
                                    Icon(
                                      Icons.credit_card,
                                      color: Color(0xFF013220),
                                    ),
                                    SizedBox(width: 8),
                                    Text('Card Payment'),
                                  ],
                                ),
                                value: 'card',
                                groupValue: selectedPaymentMethod,
                                activeColor: const Color(0xFF013220),
                                onChanged: (value) {
                                  setState(() {
                                    selectedPaymentMethod = value!;
                                  });
                                },
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Add some bottom padding to ensure the content doesn't end right at the buttons
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

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
                      onPressed:
                          isProcessing
                              ? null
                              : () async {
                                setState(() {
                                  isProcessing = true;
                                });

                                // Show loading indicator
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Processing payment...'),
                                    duration: Duration(seconds: 1),
                                  ),
                                );

                                try {
                                  // Get all the required data from the QR response
                                  final billingData =
                                      widget.qrData['data']?['billing'] ?? {};
                                  final String billingId =
                                      billingData['_id'] ?? '';
                                  final double calculatedFee =
                                      (widget.qrData['data']?['calculatedFee'] ??
                                              0)
                                          .toDouble();
                                  final int duration =
                                      widget.qrData['data']?['duration'] ?? 0;

                                  String exitTimeStr;
                                  if (widget.qrData['data']?['exitTime'] !=
                                      null) {
                                    exitTimeStr =
                                        widget.qrData['data']!['exitTime']
                                            .toString();
                                  } else {
                                    exitTimeStr =
                                        DateTime.now().toIso8601String();
                                  }

                                  // Store context mounted state before async gap
                                  final bool wasContextMounted = mounted;

                                  // Send confirmation to the backend
                                  final result =
                                      await ApiService.confirmPayment(
                                        billingId: billingId,
                                        exitTime: exitTimeStr,
                                        fee: calculatedFee,
                                        duration: duration,
                                        paymentMethod: selectedPaymentMethod,
                                      );

                                  // Check if context is still mounted after async operation
                                  if (!wasContextMounted || !mounted) return;

                                  setState(() {
                                    isProcessing = false;
                                  });

                                  if (result != null &&
                                      result['success'] == true) {
                                    // Show success message
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          'Payment confirmed successfully!',
                                        ),
                                        backgroundColor: Color(0xFF013220),
                                      ),
                                    );
                                    // Navigate back to scanner
                                    context.go('/scanner');
                                  } else {
                                    // Show error message
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          result?['message'] ??
                                              'Failed to confirm payment',
                                        ),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }
                                } catch (e) {
                                  // Check if context is still mounted before using it
                                  if (!mounted) return;

                                  setState(() {
                                    isProcessing = false;
                                  });

                                  // Show error message
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Error: ${e.toString()}'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF013220),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        disabledBackgroundColor: Colors.grey,
                      ),
                      child:
                          isProcessing
                              ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                              : const Text('Confirm'),
                    ),
                  ),
                ],
              ),
            ],
          ),
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Main content area that can scroll if needed
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Already Paid Card
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: Colors.red.shade300,
                            width: 2,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.cancel,
                                color: Colors.red.shade700,
                                size: 64,
                              ),
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
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

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
      ),
    );
  }

  // Building the extra fee view when booking has exceeded scheduled exit time
  Widget _buildExtraFeeView(BuildContext context) {
    final data = widget.qrData['data'] ?? {};
    final fee = data['fee'] ?? {};
    final time = data['time'] ?? {};

    final double originalFee = (fee['originalFee'] ?? 0).toDouble();
    final double extraTimeFee = (fee['extraTimeFee'] ?? 0).toDouble();
    final double totalPayable = (fee['totalPayable'] ?? 0).toDouble();
    final String extraTime = time['extraTime'] ?? '00:00:00';
    final String totalDuration = time['totalDuration'] ?? '0h 0m';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('Extra Time Detected'),
        backgroundColor: Colors.orange.shade700,
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Warning Card
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: Colors.orange.shade300,
                            width: 2,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.warning_amber,
                                color: Colors.orange.shade700,
                                size: 64,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '⚠️ Extra Time Detected!',
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange.shade700,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Your booking has exceeded the scheduled exit time',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Fee Breakdown
                      const Text(
                        'Fee Breakdown',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Card(
                        elevation: 2,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              _buildFeeRow(
                                'Original Fee',
                                'Rs. ${originalFee.toStringAsFixed(2)}',
                                false,
                              ),
                              const Divider(),
                              _buildFeeRow(
                                'Extra Time Fee',
                                'Rs. ${extraTimeFee.toStringAsFixed(2)}',
                                true,
                              ),
                              const Divider(thickness: 2),
                              _buildFeeRow(
                                'Total Payable',
                                'Rs. ${totalPayable.toStringAsFixed(2)}',
                                false,
                                isTotal: true,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Time Details
                      const Text(
                        'Time Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      _buildDetailCard(
                        icon: Icons.login,
                        title: 'Entry Time',
                        value: time['entryTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.schedule,
                        title: 'Scheduled Exit',
                        value: time['scheduledExitTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.logout,
                        title: 'Actual Exit',
                        value: time['realExitTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.timer,
                        title: 'Extra Time',
                        value: extraTime,
                        isHighlight: true,
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.access_time,
                        title: 'Total Duration',
                        value: totalDuration,
                      ),

                      const SizedBox(height: 24),

                      // Payment Method Selection
                      const Text(
                        'Payment Method',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildPaymentMethodCard(),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Action Buttons
              Row(
                children: [
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
                  Expanded(
                    child: ElevatedButton(
                      onPressed:
                          isProcessing
                              ? null
                              : () => _processPayment(totalPayable),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange.shade700,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        disabledBackgroundColor: Colors.grey,
                      ),
                      child:
                          isProcessing
                              ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                              : Text(
                                'Pay Rs. ${totalPayable.toStringAsFixed(2)}',
                              ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Building the no extra fee view when booking is within allowed period
  Widget _buildNoExtraFeeView(BuildContext context) {
    final data = widget.qrData['data'] ?? {};
    final fee = data['fee'] ?? {};
    final time = data['time'] ?? {};

    final double totalPayable = (fee['totalPayable'] ?? 0).toDouble();
    final String totalDuration = time['totalDuration'] ?? '0h 0m';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('Ready for Checkout'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Success Card
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: Colors.green.shade300,
                            width: 2,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.check_circle,
                                color: Colors.green.shade700,
                                size: 64,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '✅ On Time - No Extra Charges',
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green.shade700,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Your booking is within the allowed period',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Fee Display
                      const Text(
                        'Parking Fee',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Card(
                        elevation: 2,
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              const Icon(
                                Icons.receipt_long,
                                color: Color(0xFF013220),
                                size: 48,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Rs. ${totalPayable.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF013220),
                                ),
                              ),
                              Text(
                                'Standard parking fee',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Time Details
                      const Text(
                        'Time Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      _buildDetailCard(
                        icon: Icons.login,
                        title: 'Entry Time',
                        value: time['entryTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.logout,
                        title: 'Exit Time',
                        value: time['realExitTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.access_time,
                        title: 'Total Duration',
                        value: totalDuration,
                      ),

                      const SizedBox(height: 24),

                      // Payment Method Selection
                      const Text(
                        'Payment Method',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildPaymentMethodCard(),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Action Buttons
              Row(
                children: [
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
                  Expanded(
                    child: ElevatedButton(
                      onPressed:
                          isProcessing
                              ? null
                              : () => _processPayment(totalPayable),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF013220),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        disabledBackgroundColor: Colors.grey,
                      ),
                      child:
                          isProcessing
                              ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                              : Text(
                                'Pay Rs. ${totalPayable.toStringAsFixed(2)}',
                              ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Building the booking ongoing view
  Widget _buildBookingOngoingView(BuildContext context) {
    final data = widget.qrData['data'] ?? {};
    final fee = data['fee'] ?? {};
    final time = data['time'] ?? {};
    final bool hasExtraTime = data['extraTime'] ?? false;

    final double calculatedFee = (fee['calculatedFee'] ?? 0).toDouble();
    final String duration = time['duration'] ?? '0h 0m';
    final String remainingTime = time['remainingTime'] ?? '0h 0m';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('Booking Status'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Status Card
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color:
                                hasExtraTime
                                    ? Colors.orange.shade300
                                    : Colors.blue.shade300,
                            width: 2,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              Icon(
                                hasExtraTime
                                    ? Icons.warning_amber
                                    : Icons.local_parking,
                                color:
                                    hasExtraTime
                                        ? Colors.orange.shade700
                                        : Colors.blue.shade700,
                                size: 64,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                hasExtraTime
                                    ? '🅿️ Booking Active (Overtime)'
                                    : '🅿️ Booking Currently Active',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color:
                                      hasExtraTime
                                          ? Colors.orange.shade700
                                          : Colors.blue.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                hasExtraTime
                                    ? 'Your booking has exceeded the scheduled time'
                                    : 'Your parking session is currently active',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Current Usage
                      const Text(
                        'Current Usage',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Card(
                        elevation: 2,
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              const Icon(
                                Icons.receipt_long,
                                color: Color(0xFF013220),
                                size: 48,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Rs. ${calculatedFee.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF013220),
                                ),
                              ),
                              Text(
                                'Current fee',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Time Details
                      const Text(
                        'Time Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      _buildDetailCard(
                        icon: Icons.login,
                        title: 'Entry Time',
                        value: time['entryTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.access_time,
                        title: 'Current Duration',
                        value: duration,
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.schedule,
                        title: 'Scheduled Exit',
                        value: time['scheduledExitTime'] ?? 'Unknown',
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.timer,
                        title: hasExtraTime ? 'Time Remaining' : 'Time Left',
                        value: remainingTime,
                        isHighlight: hasExtraTime,
                      ),

                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Action Buttons
              Column(
                children: [
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
                    child: const Text('Continue Scanning'),
                  ),
                  if (hasExtraTime) ...[
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () {
                        // TODO: Implement extend booking functionality
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Extend booking feature coming soon'),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange.shade700,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Extend Booking'),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Building the booking activated view
  Widget _buildBookingActivatedView(BuildContext context) {
    final data = widget.qrData['data'] ?? {};
    final booking = data['booking'] ?? {};
    final String parkingName = booking['parkingName'] ?? 'Parking Area';
    final String entryTime = booking['entryTime'] ?? 'Unknown';
    final String exitTime = booking['exitTime'] ?? 'Unknown';
    final String vehicleType = booking['vehicleType'] ?? 'Car';

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('Welcome!'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/scanner'),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Welcome Card
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: Colors.green.shade300,
                            width: 2,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.celebration,
                                color: Colors.green.shade700,
                                size: 64,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '🎉 Welcome to $parkingName!',
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Your booking is now active and you can park your vehicle',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Booking Details
                      const Text(
                        'Booking Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF013220),
                        ),
                      ),
                      const SizedBox(height: 12),

                      _buildDetailCard(
                        icon: Icons.local_parking,
                        title: 'Parking Area',
                        value: parkingName,
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.directions_car,
                        title: 'Vehicle Type',
                        value: vehicleType.toUpperCase(),
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.login,
                        title: 'Entry Time',
                        value: entryTime,
                      ),
                      const SizedBox(height: 12),
                      _buildDetailCard(
                        icon: Icons.schedule,
                        title: 'Scheduled Exit',
                        value: exitTime,
                      ),

                      const SizedBox(height: 24),

                      // QR Code Info
                      Card(
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.qr_code,
                                color: Colors.blue.shade700,
                                size: 48,
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Keep your QR code ready for exit',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'You will need to scan the same QR code when exiting the parking area',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey.shade700,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Action Button
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
                child: const Text('Continue Scanning'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper method to build fee row
  Widget _buildFeeRow(
    String label,
    String amount,
    bool isExtra, {
    bool isTotal = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 18 : 16,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: isExtra ? Colors.orange.shade700 : Colors.black87,
            ),
          ),
          Text(
            amount,
            style: TextStyle(
              fontSize: isTotal ? 18 : 16,
              fontWeight: FontWeight.bold,
              color:
                  isExtra
                      ? Colors.orange.shade700
                      : (isTotal ? const Color(0xFF013220) : Colors.black87),
            ),
          ),
        ],
      ),
    );
  }

  // Helper method to build payment method card
  Widget _buildPaymentMethodCard() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            RadioListTile<String>(
              title: const Row(
                children: [
                  Icon(Icons.money, color: Color(0xFF013220)),
                  SizedBox(width: 8),
                  Text('Cash Payment'),
                ],
              ),
              value: 'cash',
              groupValue: selectedPaymentMethod,
              activeColor: const Color(0xFF013220),
              onChanged: (value) {
                setState(() {
                  selectedPaymentMethod = value!;
                });
              },
            ),
            RadioListTile<String>(
              title: const Row(
                children: [
                  Icon(Icons.credit_card, color: Color(0xFF013220)),
                  SizedBox(width: 8),
                  Text('Card Payment'),
                ],
              ),
              value: 'card',
              groupValue: selectedPaymentMethod,
              activeColor: const Color(0xFF013220),
              onChanged: (value) {
                setState(() {
                  selectedPaymentMethod = value!;
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  // Helper method to process payment
  Future<void> _processPayment(double amount) async {
    setState(() {
      isProcessing = true;
    });

    try {
      // TODO: Implement payment processing logic here
      // This could involve calling your payment API

      await Future.delayed(const Duration(seconds: 2)); // Simulate processing

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Payment of Rs. ${amount.toStringAsFixed(2)} processed successfully',
            ),
          ),
        );
        context.go('/scanner');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Payment failed: $e')));
      }
    } finally {
      if (mounted) {
        setState(() {
          isProcessing = false;
        });
      }
    }
  }

  Widget _buildDetailCard({
    required IconData icon,
    required String title,
    required String value,
    bool isHighlight = false,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side:
            isHighlight
                ? BorderSide(color: Colors.orange.shade300, width: 2)
                : BorderSide.none,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(
              icon,
              color:
                  isHighlight
                      ? Colors.orange.shade700
                      : const Color(0xFF013220),
              size: 28,
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    color: isHighlight ? Colors.orange.shade700 : Colors.grey,
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color:
                        isHighlight ? Colors.orange.shade700 : Colors.black87,
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
