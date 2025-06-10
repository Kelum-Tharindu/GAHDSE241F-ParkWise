import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../services/api_service.dart';
import '../models/qr_result.dart';
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
      setState(() {
        scanned = true;
        scannedData = code;
        scanStatus = 'Processing QR code...';
        statusColor = Colors.amber;
      });

      // Temporarily stop the scanner
      controller.stop();

      // Validate QR format
      final Map<String, dynamic>? validData = ApiService.validateQrData(code);

      if (validData == null) {
        if (kDebugMode) {
          print('=== Invalid QR format');
        }
        setState(() {
          scanStatus = 'Invalid QR format';
          statusColor = Colors.red;
        });
        _showErrorDialog(
          'Invalid QR Code',
          'The scanned QR code is not in a valid ParkWise format.',
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
        setState(() {
          scanStatus = 'Unknown QR type: $qrType';
          statusColor = Colors.red;
        });
        _showErrorDialog(
          'Unknown QR Type',
          'The QR code type "$qrType" is not recognized.',
        );
        return;
      }

      String message = 'Processing $qrType...';
      setState(() {
        scanStatus = message;
      });

      // Send to API
      final response = await ApiService.sendScannedData(validData);

      if (response != null) {
        if (kDebugMode) {
          print('=== Success! API response: $response');
        }

        // Create QR result object
        final QrResult result = QrResult.fromJson({...validData, ...response});

        if (kDebugMode) {
          print('=== QR Result: ${result.type}, Valid: ${result.isValid}');
        }

        // Check validation result
        if (result.isValid) {
          setState(() {
            scanStatus = 'Valid ${result.type} QR code';
            statusColor = Colors.green;
          });
          _showSuccessDialog(result);
        } else {
          setState(() {
            scanStatus = 'Invalid ${result.type} QR code';
            statusColor = Colors.red;
          });
          _showErrorDialog(
            'Invalid ${result.displayTitle}',
            'This QR code has been marked as invalid or expired.',
          );
        }
      } else {
        if (kDebugMode) {
          print('=== API error or no response');
        }
        setState(() {
          scanStatus = 'Error verifying QR code';
          statusColor = Colors.red;
        });
        _showErrorDialog(
          'Server Error',
          'Unable to verify the QR code with the server.',
        );
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during scan: $e');
      }
      setState(() {
        scanned = true;
        scanStatus = 'Error: ${e.toString()}';
        statusColor = Colors.red;
      });
      _showErrorDialog(
        'Error',
        'An unexpected error occurred: ${e.toString()}',
      );
    }
  }

  void _showSuccessDialog(QrResult result) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(result.displayTitle),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.green, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    'QR code successfully verified',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text('Type: ${result.type}'),
              Text('Hash: ${result.hash}'),
              const SizedBox(height: 8),
              const Divider(),
              const Text(
                'Details:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              ...result.details.entries.map((entry) {
                // Skip showing internal fields
                if (['type', 'hash', 'valid'].contains(entry.key)) {
                  return const SizedBox.shrink();
                }
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Text('${entry.key}: ${entry.value}'),
                );
              }),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _resetScanner();
            },
            child: const Text('Scan Another'),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _resetScanner();
            },
            child: const Text('Try Again'),
          ),
        ],
      ),
    );
  }

  void _resetScanner() {
    setState(() {
      scanned = false;
      scannedData = null;
      scanStatus = '';
    });
    controller.start();
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
