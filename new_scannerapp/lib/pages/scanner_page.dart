import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../pages/api_response_page.dart';
import '../services/api_service.dart';
import '../widgets/scanner_overlay.dart';

class ScannerPage extends StatefulWidget {
  const ScannerPage({super.key});

  @override
  State<ScannerPage> createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  final MobileScannerController controller = MobileScannerController();
  bool scanned = false;
  String? scannedData;
  String scanStatus = '';
  Color statusColor = Colors.white;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  void handleDetection(BarcodeCapture capture) async {
    if (scanned) return;

    if (kDebugMode) {
      print("=== Scanning started...");
    }

    final barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final String? code = barcodes.first.rawValue;
    if (code == null) return;

    try {
      if (kDebugMode) {
        print('=== Raw QR scanned: $code');
      }

      // Mark as scanned to prevent multiple scans
      if (!mounted) return;
      setState(() {
        scanned = true;
        scannedData = code;
        scanStatus = 'Processing QR code...';
        statusColor = Colors.amber;
      });

      // Temporarily stop the scanner
      controller.stop();

      // Validate QR format
      final Map<String, dynamic>? validData = validateQrData(code);

      if (validData == null) {
        if (kDebugMode) {
          print('=== Invalid QR format');
        }
        if (!mounted) return;
        setState(() {
          scanStatus = 'Invalid QR format';
          statusColor = Colors.red;
        });
        
        // Navigate to response page for invalid QR
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ApiResponsePage(
              response: {
                'success': false,
                'RESPONSE_CODE': 'err',
                'message': 'The scanned QR code is not in a valid ParkWise format.',
              },
            ),
          ),
        );
        return;
      }

      // Log the data type and hash
      if (kDebugMode) {
        print('=== QR Type: ${validData['type']}');
        print('=== QR Hash: ${validData['billingHash']}');
        print('=== Full QR Data: $validData');
      }

      // Categorize by type
      String qrType = validData['type'] as String;

      // Validate type is one of the expected types
      if (![
        'billing',
        'booking',
        'subbulkbooking',
      ].contains(qrType.toLowerCase())) {
        if (kDebugMode) {
          print('=== Unknown QR type: $qrType');
        }
        if (!mounted) return;
        setState(() {
          scanStatus = 'Unknown QR type: $qrType';
          statusColor = Colors.red;
        });
        
        // Navigate to response page for unknown QR type
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ApiResponsePage(
              response: {
                'success': false,
                'RESPONSE_CODE': 'err',
                'message': 'The QR code type "$qrType" is not recognized.',
              },
            ),
          ),
        );
        return;
      }

      String message = 'Processing $qrType...';
      if (!mounted) return;
      setState(() {
        scanStatus = message;
      });

      // Send to API using ApiService
      final response = await ApiService.sendScannedData(validData);

      // Check if widget is still mounted before updating UI
      if (!mounted) return;

      // Always navigate to ApiResponsePage with the response
      if (response != null) {
        if (kDebugMode) {
          print('=== Full API Response: $response');
        }
        
        // Navigate to response page to display all data
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ApiResponsePage(response: response),
          ),
        );
      } else {
        if (kDebugMode) {
          print('=== API error or no response');
        }
        
        // Even for errors, navigate to response page
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ApiResponsePage(
              response: {
                'success': false,
                'RESPONSE_CODE': 'err',
                'message': 'Unable to verify the QR code with the server.',
              },
            ),
          ),
        );
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during scan: $e');
      }
      if (!mounted) return;
      setState(() {
        scanned = true;
        scanStatus = 'Error: ${e.toString()}';
        statusColor = Colors.red;
      });
      
      // Navigate to response page even for exceptions
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => ApiResponsePage(
            response: {
              'success': false,
              'RESPONSE_CODE': 'err',
              'message': 'An unexpected error occurred: ${e.toString()}',
            },
          ),
        ),
      );
    }
  }

  // Method to validate QR code data format
  Map<String, dynamic>? validateQrData(String rawData) {
    return ApiService.validateQrData(rawData);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF013220), // Dark green background
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: ValueListenableBuilder(
              valueListenable: controller.torchState,
              builder: (context, state, child) {
                switch (state) {
                  case TorchState.off:
                    return const Icon(Icons.flash_off, color: Colors.white);
                  case TorchState.on:
                    return const Icon(Icons.flash_on, color: Colors.yellow);
                }
              },
            ),
            onPressed: () => controller.toggleTorch(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // QR Scanner
          MobileScanner(controller: controller, onDetect: handleDetection),

          // Overlay with scanner hole
          const ScannerOverlay(),

          // Scan status
          if (scanStatus.isNotEmpty)
            Positioned(
              bottom: 180,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Text(
                    scanStatus,
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),

          // Scan instructions
          const Positioned(
            bottom: 120,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                "Align QR code within the box",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),

          // Logout button
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Center(
              child: ElevatedButton.icon(
                onPressed: () => context.go('/'),
                icon: const Icon(Icons.logout),
                label: const Text("Back to Welcome"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF013220),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
