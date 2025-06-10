import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import '../models/qr_result.dart';
import '../widgets/scanner_overlay.dart';

class ScannerPage extends StatefulWidget {
  const ScannerPage({super.key});

  @override
  State<ScannerPage> createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  static const String baseUrl = 'http://192.168.8.145:5000/api';
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
        if (!mounted) return;
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
      if (!mounted) return;
      setState(() {
        scanStatus = message;
      });

      // Send to API
      final response = await sendScannedData(validData);

      // Check if widget is still mounted before updating UI
      if (!mounted) return;

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
          if (!mounted) return;
          setState(() {
            scanStatus = 'Valid ${result.type} QR code';
            statusColor = Colors.green;
          });
          _showSuccessDialog(result);
        } else {
          if (!mounted) return;
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
        if (!mounted) return;
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
      if (!mounted) return;
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

  // Method to validate QR code data format
  Map<String, dynamic>? validateQrData(String rawData) {
    try {
      // Try to parse as JSON first
      final data = jsonDecode(rawData);

      if (data is! Map<String, dynamic>) {
        if (kDebugMode) {
          print('=== QR data is not a valid JSON object');
        }
        return null;
      }

      // Check for required fields based on the type
      if (!data.containsKey('type')) {
        if (kDebugMode) {
          print('=== QR data missing type field');
        }
        return null;
      }

      if (!data.containsKey('billingHash')) {
        if (kDebugMode) {
          print('=== QR data missing hash field');
        }
        return null;
      }

      // Categorize based on type
      final String type = data['type'] as String;
      if (kDebugMode) {
        print('=== QR data type: $type');
      }

      return data;
    } catch (e) {
      if (kDebugMode) {
        print('=== Error parsing QR data: $e');
      }
      return null;
    }
  }

  // Send scanned data to the server
  Future<Map<String, dynamic>?> sendScannedData(
    Map<String, dynamic> qrData,
  ) async {
    try {
      if (kDebugMode) {
        print('=== Sending QR data to server: $qrData');
      }

      // Check QR data type to determine which endpoint to use
      final String endpoint = _getEndpointForQrType(qrData);

      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(qrData),
      );

      if (kDebugMode) {
        print('=== API response status: ${response.statusCode}');
      }
      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        if (kDebugMode) {
          print('=== API response body: $result');
        }

        // Transform the response to match our QrResult model
        final Map<String, dynamic> transformedResponse = {
          'hash': qrData['billingHash'],
          'valid': result['success'] ?? false,
        };

        // If there's data in the response, add it to the transformed response
        if (result.containsKey('data')) {
          transformedResponse.addAll(result['data'] as Map<String, dynamic>);
        } else {
          // If no data, add the entire result
          transformedResponse.addAll(result);
        }

        return transformedResponse;
      } else {
        if (kDebugMode) {
          print('=== API error: ${response.body}');
        }
        return null;
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during API call: $e');
      }
      return null;
    }
  }

  // Helper method to determine the endpoint based on QR type
  String _getEndpointForQrType(Map<String, dynamic> qrData) {
    final String type = qrData['type'] as String;

    switch (type.toLowerCase()) {
      case 'billing':
        return '/scanner/scan-billing';
      case 'booking':
        return '/booking/verify';
      case 'subbulkbooking':
        return '/subbulkbooking/verify';
      default:
        return '/api/verify';
    }
  }

  void _showSuccessDialog(QrResult result) {
    if (!mounted) return;
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
    if (!mounted) return;
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
    if (!mounted) return;
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
