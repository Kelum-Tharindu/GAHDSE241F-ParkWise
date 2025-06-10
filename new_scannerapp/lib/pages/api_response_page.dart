import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../services/confirm_service.dart';

class ApiResponsePage extends StatefulWidget {
  final Map<String, dynamic> response;
  const ApiResponsePage({super.key, required this.response});

  @override
  State<ApiResponsePage> createState() => _ApiResponsePageState();
}

class _ApiResponsePageState extends State<ApiResponsePage> {
  bool _isConfirming = false;
  bool _isConfirmed = false;

  bool get _isErrorResponse {
    // Check if response code indicates an error
    final code = widget.response['RESPONSE_CODE'];
    return code != null && code.toString().toLowerCase() == 'err';
  }

  bool get _isBillingResponse {
    // Check if response code indicates billing calculation
    final code = widget.response['RESPONSE_CODE'];
    return code != null && code.toString() == 'BILLING_CALCULATED';
  }

  bool get _isCheckoutCalculated {
    // Check if response code indicates checkout calculation
    final code = widget.response['RESPONSE_CODE'];
    return code != null && code.toString() == 'CHECKOUT_CALCULATED';
  }

  bool get _isBookingEntryRecorded {
    // Check if response code indicates booking entry recorded
    final code = widget.response['RESPONSE_CODE'];
    return code != null && code.toString() == 'BOOKING_ENTRY_RECORDED';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF013220),
      appBar: AppBar(
        title: Text(
          _isErrorResponse
              ? 'Invalid Scan'
              : _isBillingResponse
              ? 'Parking Bill'
              : _isCheckoutCalculated
              ? 'Checkout Details'
              : _isBookingEntryRecorded
              ? 'Entry Recorded'
              : 'Scan Result',
        ),
        backgroundColor: _isErrorResponse
            ? const Color(0xFF8B0000)
            : const Color(0xFF025940),
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    _isErrorResponse
                        ? _buildErrorView()
                        : _isBillingResponse
                        ? _buildBillingView()
                        : _isCheckoutCalculated
                        ? _buildCheckoutView()
                        : _isBookingEntryRecorded
                        ? _buildEntryRecordedView()
                        : _buildSuccessView(),
                    const SizedBox(height: 24),
                    _buildActionButtons(context),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorView() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF8B0000).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.error_outline_rounded,
              color: Color(0xFF8B0000),
              size: 40,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Scan Failed',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'The QR code could not be processed',
            style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF8B0000).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF8B0000).withOpacity(0.3),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(
                      Icons.info_outline,
                      color: Color(0xFF8B0000),
                      size: 20,
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Error Details',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF8B0000),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  widget.response['message']?.toString() ??
                      'Unknown error occurred. Please try scanning again.',
                  style: const TextStyle(
                    fontSize: 15,
                    color: Colors.black87,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessView() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF025940).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_outline_rounded,
              color: Color(0xFF025940),
              size: 40,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Scan Successful',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'QR code processed successfully',
            style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          _buildResponseDetails(),
        ],
      ),
    );
  }

  Widget _buildResponseDetails() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF025940).withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: const Row(
              children: [
                Icon(
                  Icons.data_object_rounded,
                  color: Color(0xFF025940),
                  size: 20,
                ),
                SizedBox(width: 8),
                Text(
                  'Response Details',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF025940),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: widget.response.entries
                  .where(
                    (entry) =>
                        !(_isErrorResponse &&
                            entry.key.toLowerCase() == 'code'),
                  )
                  .map((entry) => _buildResponseItem(entry.key, entry.value))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResponseItem(String key, dynamic value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            key.toUpperCase(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 6),
          if (value is Map)
            ...(value.entries.map(
              (e) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    Icon(Icons.circle, size: 6, color: Colors.grey.shade400),
                    const SizedBox(width: 8),
                    Text(
                      '${e.key}: ',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        '${e.value}',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ))
          else
            Text(
              value.toString(),
              style: const TextStyle(
                fontSize: 16,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBillingView() {
    final data = widget.response['data'] as Map<String, dynamic>? ?? {};
    final parkingName = data['parkingName']?.toString() ?? 'Unknown Parking';
    final entryTime = data['entryTime']?.toString() ?? '';
    final exitTime = data['exitTime']?.toString() ?? '';
    final duration = data['duration'] as int? ?? 0;
    final priceFor30Min = data['priceFor30Min'] as num? ?? 0;
    final totalFee = data['totalFee'] as num? ?? 0;
    final paymentStatus = data['paymentStatus']?.toString() ?? 'pending';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header with icon
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF025940).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.receipt_long_rounded,
              color: Color(0xFF025940),
              size: 40,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            parkingName,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: paymentStatus == 'completed'
                  ? Colors.green.shade50
                  : Colors.orange.shade50,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: paymentStatus == 'completed'
                    ? Colors.green.shade200
                    : Colors.orange.shade200,
              ),
            ),
            child: Text(
              paymentStatus.toUpperCase(),
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: paymentStatus == 'completed'
                    ? Colors.green.shade700
                    : Colors.orange.shade700,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Parking Duration Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF025940).withOpacity(0.1),
                  const Color(0xFF013220).withOpacity(0.05),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFF025940).withOpacity(0.2),
              ),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.schedule_rounded,
                      color: Color(0xFF025940),
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Parking Duration',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey.shade700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  _formatDuration(duration),
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF025940),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Time Details
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              children: [
                _buildTimeRow('Entry Time', entryTime, Icons.login_rounded),
                const SizedBox(height: 12),
                Divider(color: Colors.grey.shade300, height: 1),
                const SizedBox(height: 12),
                _buildTimeRow('Exit Time', exitTime, Icons.logout_rounded),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Billing Details
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.green.shade50, Colors.green.shade100],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.green.shade200),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Rate (30 min)',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    Text(
                      '\$${priceFor30Min.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Divider(color: Colors.green.shade200, thickness: 1),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total Amount',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    Text(
                      '\$${totalFee.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF025940),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeRow(String label, String time, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF025940), size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                _formatDateTime(time),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 54,
          child: ElevatedButton.icon(
            onPressed: () =>
                Navigator.of(context).popUntil((route) => route.isFirst),
            icon: const Icon(Icons.qr_code_scanner_rounded),
            label: Text(
              _isBillingResponse || _isCheckoutCalculated
                  ? 'Scan Another Code'
                  : 'Scan Again',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: _isErrorResponse
                  ? const Color(0xFF8B0000)
                  : const Color(0xFF025940),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 2,
            ),
          ),
        ),
        const SizedBox(height: 12),
        if (_isBillingResponse && !_isConfirmed) ...[
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              onPressed: _confirmPayment,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4CAF50),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
              child: _isConfirming
                  ? const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      strokeWidth: 2.5,
                    )
                  : const Text(
                      'Confirm Payment',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 12),
        ],
        if (_isCheckoutCalculated && !_isConfirmed) ...[
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              onPressed: _confirmCheckout,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4CAF50),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
              child: _isConfirming
                  ? const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      strokeWidth: 2.5,
                    )
                  : const Text(
                      'Confirm Checkout',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  String _formatDuration(int durationInMinutes) {
    final hours = durationInMinutes ~/ 60;
    final minutes = durationInMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return '${hours}h ${minutes}min';
    } else if (hours > 0) {
      return '${hours}h';
    } else {
      return '${minutes}min';
    }
  }

  String _formatDateTime(String dateTimeStr) {
    try {
      final dateTime = DateTime.parse(dateTimeStr);
      return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return dateTimeStr;
    }
  }

  Future<void> _confirmPayment() async {
    if (_isConfirming || _isConfirmed) return;

    setState(() {
      _isConfirming = true;
    });

    try {
      print("======response: ${widget.response}");
      final result = await ConfirmService.confirmPayment(widget.response);

      if (result['success']) {
        setState(() {
          _isConfirmed = true;
          _isConfirming = false;
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Payment confirmed successfully!'),
              backgroundColor: Color(0xFF025940),
            ),
          );
        }
      } else {
        throw Exception(result['message']);
      }
    } catch (e) {
      setState(() {
        _isConfirming = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error confirming payment: ${e.toString()}'),
            backgroundColor: const Color(0xFF8B0000),
          ),
        );
      }
    }
  }

  Future<void> _confirmCheckout() async {
    if (_isConfirming || _isConfirmed) return;

    setState(() {
      _isConfirming = true;
    });

    try {
      if (kDebugMode) {
        print("======Confirming checkout: ${widget.response}");
      }

      // Use the specific booking checkout confirmation service
      final result = await ConfirmService.confirmBookingCheckout(
        widget.response,
      );

      if (result['success']) {
        setState(() {
          _isConfirmed = true;
          _isConfirming = false;
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Checkout confirmed successfully!'),
              backgroundColor: Color(0xFF025940),
            ),
          );
        }
      } else {
        throw Exception(result['message']);
      }
    } catch (e) {
      setState(() {
        _isConfirming = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error confirming checkout: ${e.toString()}'),
            backgroundColor: const Color(0xFF8B0000),
          ),
        );
      }
    }
  }

  Widget _buildCheckoutView() {
    final data = widget.response['data'] as Map<String, dynamic>? ?? {};
    final parkingName = data['parkingName']?.toString() ?? 'Unknown Parking';
    final entryTime = data['entryTime']?.toString() ?? '';
    final scheduledExitTime = data['scheduledExitTime']?.toString() ?? '';
    final actualExitTime = data['actualExitTime']?.toString() ?? '';
    final hasExceededTime = data['hasExceededTime'] as bool? ?? false;
    final extraTimeDuration = data['extraTimeDuration'] as int? ?? 0;
    final priceFor30Min = data['priceFor30Min'] as num? ?? 0;
    final extraTimeFee = data['extraTimeFee'] as num? ?? 0;
    final originalUsageFee = data['originalUsageFee'] as num? ?? 0;
    final bookingFee = data['bookingFee'] as num? ?? 0;
    final totalFee = data['totalFee'] as num? ?? 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header with icon
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: hasExceededTime
                  ? Colors.orange.shade100
                  : const Color(0xFF025940).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              hasExceededTime
                  ? Icons.timer_outlined
                  : Icons.check_circle_outline_rounded,
              color: hasExceededTime
                  ? Colors.orange.shade800
                  : const Color(0xFF025940),
              size: 40,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            parkingName,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: hasExceededTime
                  ? Colors.orange.shade50
                  : Colors.green.shade50,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: hasExceededTime
                    ? Colors.orange.shade200
                    : Colors.green.shade200,
              ),
            ),
            child: Text(
              hasExceededTime ? 'OVERTIME' : 'ON TIME',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: hasExceededTime
                    ? Colors.orange.shade700
                    : Colors.green.shade700,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Time Details
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              children: [
                _buildTimeRow('Entry Time', entryTime, Icons.login_rounded),
                const SizedBox(height: 12),
                Divider(color: Colors.grey.shade300, height: 1),
                const SizedBox(height: 12),
                _buildTimeRow(
                  'Scheduled Exit',
                  scheduledExitTime,
                  Icons.event_available,
                ),
                if (hasExceededTime) ...[
                  const SizedBox(height: 12),
                  Divider(color: Colors.grey.shade300, height: 1),
                  const SizedBox(height: 12),
                  _buildTimeRow(
                    'Actual Exit',
                    actualExitTime,
                    Icons.logout_rounded,
                  ),
                ],
              ],
            ),
          ),

          if (hasExceededTime) ...[
            const SizedBox(height: 20),

            // Extra Time Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.orange.shade100, Colors.orange.shade50],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.orange.shade200),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.timer_outlined,
                        color: Colors.orange.shade800,
                        size: 24,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Extra Time',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _formatDuration(extraTimeDuration),
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange.shade800,
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 20),

          // Billing Details
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.green.shade50, Colors.green.shade100],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.green.shade200),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Rate (30 min)',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    Text(
                      '\$${priceFor30Min.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Booking Fee',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    Text(
                      '\$${bookingFee.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Usage Fee',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    Text(
                      '\$${originalUsageFee.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),

                if (hasExceededTime) ...[
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Extra Time Fee',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.orange.shade800,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '\$${extraTimeFee.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.orange.shade800,
                        ),
                      ),
                    ],
                  ),
                ],

                const SizedBox(height: 16),
                Divider(color: Colors.green.shade200, thickness: 1),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total Amount',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    Text(
                      '\$${totalFee.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF025940),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEntryRecordedView() {
    final data = widget.response['data'] as Map<String, dynamic>? ?? {};
    final parkingName = data['parkingName']?.toString() ?? 'Unknown Parking';
    final bookingDate = data['bookingDate']?.toString() ?? '';
    final entryTime = data['entryTime']?.toString() ?? '';
    final scheduledExitTime = data['scheduledExitTime']?.toString() ?? '';
    final vehicleType = data['vehicleType']?.toString().toUpperCase() ?? '';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header with icon
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.blue.shade100,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.directions_car_filled_outlined,
              color: Colors.blue.shade800,
              size: 40,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            parkingName,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.blue.shade200),
            ),
            child: Text(
              'ENTRY RECORDED',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.blue.shade700,
                letterSpacing: 0.5,
              ),
            ),
          ),

          const SizedBox(height: 8),
          if (vehicleType.isNotEmpty)
            Container(
              margin: const EdgeInsets.only(top: 8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Text(
                vehicleType,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey.shade700,
                  letterSpacing: 0.5,
                ),
              ),
            ),

          const SizedBox(height: 24),

          // Time Details
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              children: [
                _buildTimeRow(
                  'Booking Date',
                  bookingDate,
                  Icons.calendar_today,
                ),
                const SizedBox(height: 12),
                Divider(color: Colors.grey.shade300, height: 1),
                const SizedBox(height: 12),
                _buildTimeRow('Entry Time', entryTime, Icons.login_rounded),
                const SizedBox(height: 12),
                Divider(color: Colors.grey.shade300, height: 1),
                const SizedBox(height: 12),
                _buildTimeRow(
                  'Scheduled Exit',
                  scheduledExitTime,
                  Icons.event_available,
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Success Message Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blue.shade50, Colors.blue.shade100],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.blue.shade200),
            ),
            child: Column(
              children: [
                Icon(
                  Icons.check_circle_outline,
                  color: Colors.blue.shade700,
                  size: 40,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Your parking session has started!',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Scan the QR code again when you are ready to leave the parking space.',
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
