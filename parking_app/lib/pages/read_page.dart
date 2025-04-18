import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../services/api_service.dart';
import 'qr_preview_page.dart';

class ReadPage extends StatefulWidget {
  const ReadPage({super.key});

  @override
  State<ReadPage> createState() => _ReadPageState();
}

class _ReadPageState extends State<ReadPage> {
  final MobileScannerController controller = MobileScannerController();
  bool scanned = false;
  String? scannedData;

  void handleDetection(BarcodeCapture capture) async {
    if (scanned) return;
    if (kDebugMode) print("##=====Scanning started...");

    final barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final String? code = barcodes.first.rawValue;
    if (code == null) return;

    try {
      final data = jsonDecode(code);
      if (data is! Map<String, dynamic>) {
        throw FormatException('Scanned data is not a valid JSON');
      }

      setState(() {
        scanned = true;
        scannedData = code;
      });

      controller.stop();

      final response = await ApiService.sendScannedData(data);

      if (!mounted) return;

      if (response != null) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => QRPreviewPage(qrData: response)),
        );
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid QR")));
      }
    } catch (e) {
      if (!mounted) return;

      if (e is FormatException) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid QR format")));
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("An error occurred")));
      }
    }
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

          // Optional scan label
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                "Align QR within the box",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
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
