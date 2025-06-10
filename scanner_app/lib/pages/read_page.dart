import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';

class ReadPage extends StatefulWidget {
  const ReadPage({super.key});

  @override
  State<ReadPage> createState() => _ReadPageState();
}

class _ReadPageState extends State<ReadPage> {
  final MobileScannerController controller = MobileScannerController();
  bool scanned = false;
  String? scannedData;
  bool isProcessing = false;

  void handleDetection(BarcodeCapture capture) async {
    if (scanned || isProcessing) return;

    setState(() {
      isProcessing = true;
    });

    if (kDebugMode) {
      print("=== Scanning started...");
    }

    final barcodes = capture.barcodes;
    if (barcodes.isEmpty) {
      setState(() {
        isProcessing = false;
      });
      return;
    }

    final String? code = barcodes.first.rawValue;
    if (code == null) {
      setState(() {
        isProcessing = false;
      });
      return;
    }
    try {
      final data = jsonDecode(code);
      if (data is! Map<String, dynamic>) {
        if (kDebugMode) {
          print('=== Scanned data is not a valid JSON');
        }
        setState(() {
          scanned = true;
          scannedData = code;
          isProcessing = false;
        });
        controller.stop();
        if (!mounted) return;
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid QR format")));
        return;
      }

      setState(() {
        scanned = true;
        scannedData = code;
      });
      if (kDebugMode) {
        print('=== QR scanned: $code');
      }
      controller.stop();

      // Prepare data for API - format depends on QR type
      Map<String, dynamic> apiData = {};
      
      // First check if hash is available
      if (data['billingHash'] != null) {
        // Then check and categorize by type
        if (data['type'] != null) {
          // Valid types: 'billing', 'booking', 'subbulkbooking'
          if (data['type'] == 'billing') {
            apiData = {'type': 'billing', 'hash': data['billingHash']};
            if (kDebugMode) {
              print('=== Billing QR Code Detected');
              print('=== Hash: ${data['billingHash']}');
              print('=== Type: ${data['type']}');
            }
          } else if (data['type'] == 'booking') {
            apiData = {'type': 'booking', 'hash': data['billingHash']};
            if (kDebugMode) {
              print('=== Booking QR Code Detected');
              print('=== Hash: ${data['billingHash']}');
              print('=== Type: ${data['type']}');
            }
          } else if (data['type'] == 'subbulkbooking') {
            apiData = {'type': 'subbulkbooking', 'hash': data['billingHash']};
            if (kDebugMode) {
              print('=== Sub Bulk Booking QR Code Detected');
              print('=== Hash: ${data['billingHash']}');
              print('=== Type: ${data['type']}');
            }
          } else {
            if (kDebugMode) {
              print('=== Unknown QR Type: ${data['type']}');
              print('=== Hash: ${data['billingHash']}');
            }
            // Show error for unknown type
            showQRErrorDialog(context, 'Invalid QR Type', 
              'The QR code type "${data['type']}" is not recognized.');
            return;
          }
        } else {
          // Missing type
          if (kDebugMode) {
            print('=== Error: QR type not found');
            print('=== Hash is available: ${data['billingHash']}');
          }
          showQRErrorDialog(context, 'Invalid QR Code', 
            'The QR code is missing a type identifier.');
          return;
        }
      } else {
        // Missing hash
        if (kDebugMode) {
          print('=== Error: QR hash not found');
          if (data['type'] != null) {
            print('=== Type is available: ${data['type']}');
          } else {
            print('=== Type is also missing');
          }
        }
        showQRErrorDialog(context, 'Invalid QR Code', 
          'The QR code is missing a valid hash.');
        return;
      }

      if (kDebugMode) {
        print('=== About to send API request with data: $apiData');
        print('=== API URL will be: ${ApiService.baseUrl}/scanner/scan');
      }

      final response = await ApiService.sendScannedData(apiData);
      setState(() {
        isProcessing = false;
      });

      if (kDebugMode) {
        print('=== API response: $response');
      }      if (!mounted) return;

      if (response != null) {
        if (kDebugMode) {
          print('=== Navigating to QRPreviewPage');
        }
        context.go('/qr-preview', extra: response);
      } else {
        if (kDebugMode) {
          print('=== Invalid QR, showing error');
        }

        // Show error dialog with options
        showQRErrorDialog(context, 'Connection Error', 
          'Could not connect to the server. Please check your internet connection.');
      }    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during scan: $e');
      }
      setState(() {
        scanned = true;
        isProcessing = false;
      });
      controller.stop();
      if (!mounted) return;

      String errorTitle = "Error";
      String errorMessage = "An error occurred while processing the QR code.";

      if (e is FormatException) {
        errorTitle = "Invalid QR Format";
        errorMessage = "The scanned code is not in a valid format.";
      } else if (e.toString().contains('connect')) {
        errorTitle = "Connection Error";
        errorMessage =
            "Failed to connect to the server. Please check your internet connection.";
      }

      // Show error dialog using helper method
      showQRErrorDialog(context, errorTitle, errorMessage);
    }
  }

  // Helper method to show QR error dialog
  void showQRErrorDialog(BuildContext context, String title, String message) {
    setState(() {
      isProcessing = false;
    });
    
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  scanned = false;
                });
                controller.start(); // Start scanning again
              },
              child: const Text('Try Again'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.go('/'); // Go back to home/main page
              },
              child: const Text('Back'),
            ),
          ],
        ),
      );
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF013220), // Dark green background
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        backgroundColor: const Color(0xFF013220),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            context.go('/'); // Navigate back to home or main page
          },
        ),
      ),
      body: Stack(
        children: [
          // QR Scanner
          MobileScanner(controller: controller, onDetect: handleDetection),

          // Overlay with transparent scanner hole
          Positioned.fill(
            child: ClipPath(
              clipper: _ScannerHoleClipper(),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.black.withAlpha((0.9 * 255).toInt()),
                      Colors.black.withAlpha((0.6 * 255).toInt()),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ),
          ),

          // Stylish scan box
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white, width: 4),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),

          // Scan guide and indicators
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Column(
              children: [
                // Processing indicator
                if (isProcessing)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.0,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Color(0xFF013220),
                            ),
                          ),
                        ),
                        SizedBox(width: 10),
                        Text(
                          "Processing...",
                          style: TextStyle(
                            color: Color(0xFF013220),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),

                const SizedBox(height: 16),

                // Scan instruction
                const Text(
                  "Align QR within the box",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),

          // Scan line animation
          if (!scanned && !isProcessing)
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.0, end: 1.0),
              duration: const Duration(seconds: 2),
              builder: (context, value, child) {
                return Positioned(
                  top:
                      MediaQuery.of(context).size.height / 2 -
                      125 +
                      value * 250,
                  left: MediaQuery.of(context).size.width / 2 - 125,
                  child: Container(
                    width: 250,
                    height: 2,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          Colors.green.withOpacity(0.8),
                          Colors.green.withOpacity(0.8),
                          Colors.transparent,
                        ],
                        stops: const [0.0, 0.3, 0.7, 1.0],
                      ),
                    ),
                  ),
                );
              },
              onEnd: () {
                if (mounted && !scanned && !isProcessing) {
                  setState(() {}); // Rebuild to restart the animation
                }
              },
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (scanned) {
            setState(() {
              scanned = false;
            });
            controller.start();
          } else {
            controller.toggleTorch();
          }
        },
        backgroundColor: Colors.white,
        child: Icon(
          scanned ? Icons.refresh : Icons.flashlight_on,
          color: const Color(0xFF013220),
        ),
      ),
    );
  }
}

// Custom clipper for transparent hole
class _ScannerHoleClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    const boxSize = 250.0;
    final center = Offset(size.width / 2, size.height / 2);
    final hole = Rect.fromCenter(
      center: center,
      width: boxSize,
      height: boxSize,
    );

    return Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRRect(RRect.fromRectAndRadius(hole, const Radius.circular(16)))
      ..fillType = PathFillType.evenOdd;
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}
