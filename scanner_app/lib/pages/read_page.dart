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

      final response = await ApiService.sendScannedData(data);
      setState(() {
        isProcessing = false;
      });

      if (kDebugMode) {
        print('=== API response: $response');
      }

      if (!mounted) return;

      if (response != null) {
        if (kDebugMode) {
          print('=== Navigating to QRPreviewPage');
        }
        context.go('/qr-preview', extra: response);
      } else {
        if (kDebugMode) {
          print('=== Invalid QR, showing error');
        }
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid QR")));

        // Reset scan state after error
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() {
              scanned = false;
            });
            controller.start();
          }
        });
      }
    } catch (e) {
      if (kDebugMode) {
        print('=== Exception during scan: $e');
      }
      setState(() {
        scanned = true;
        isProcessing = false;
      });
      controller.stop();
      if (!mounted) return;

      String errorMessage = "An error occurred";
      if (e is FormatException) {
        errorMessage = "Invalid QR format";
      }

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(errorMessage)));

      // Reset scan state after error
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            scanned = false;
          });
          controller.start();
        }
      });
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
