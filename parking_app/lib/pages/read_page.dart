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
    if (scanned) return; // Prevent scanning again if already done
    if (kDebugMode) {
      print("##=====Scanning started...");
    }

    final barcodes = capture.barcodes; // Get all detected barcodes
    if (barcodes.isEmpty) {
      if (kDebugMode) {
        print("##=====No barcodes detected.");
      }
      return; // Exit if no barcodes detected
    }

    final String? code =
        barcodes.first.rawValue; // Extract the raw value from the first barcode
    if (code == null) {
      if (kDebugMode) {
        print("##=====Scanned QR code is null.");
      }
      return; // If no code is detected, exit
    }

    if (kDebugMode) {
      print("##=====QR code detected: $code");
    }

    try {
      // Validate if the QR code contains valid JSON
      final data = jsonDecode(code); // Try decoding the code into a JSON object
      if (kDebugMode) {
        print("##=====Decoded QR data: $data");
      }

      // Ensure the data is in the expected format (i.e., Map<String, dynamic>)
      if (data is! Map<String, dynamic>) {
        throw FormatException('Scanned data is not in a valid JSON format');
      }
      if (kDebugMode) {
        print("##=====Data is in a valid JSON format");
      }

      // Mark the scan as successful and store the data
      setState(() {
        scanned = true;
        scannedData = code; // Store the scanned QR data
      });

      controller.stop(); // Stop the scanner once the QR is detected
      if (kDebugMode) {
        print("##=====Scanner stopped.");
      }

      // Log the scanned QR data for debugging
      if (kDebugMode) {
        print("##=====Scanned QR Data: $data");
      }

      // Send the scanned data to the backend (in JSON format)
      final response = await ApiService.sendScannedData(data);
      if (kDebugMode) {
        print("##=====Response from backend: $response");
      }

      if (!mounted) return; // Ensure the widget is still mounted

      // Log the backend response for debugging
      if (kDebugMode) {
        print("##=====Backend Response: $response");
      }

      // Navigate to the preview page with the backend response
      if (response != null) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => QRPreviewPage(qrData: response)),
        );
        if (kDebugMode) {
          print("##=====Navigation to QR Preview page.");
        }
      } else {
        // If the response is null, show an error message
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid QR")));
        if (kDebugMode) {
          print("##=====Invalid QR response received.");
        }
      }
    } catch (e) {
      // Log the error for debugging
      if (kDebugMode) {
        print("##=====Error during QR code processing: $e");
      }

      if (!mounted) return;

      // Show user-friendly error messages based on the exception type
      if (e is FormatException) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid QR format")));
        if (kDebugMode) {
          print("##=====Invalid QR format detected.");
        }
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("An error occurred")));
        if (kDebugMode) {
          print("##=====An error occurred during QR code processing.");
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Scan QR')),
      body: Stack(
        children: [
          MobileScanner(controller: controller, onDetect: handleDetection),
          if (scannedData != null)
            Center(
              child: Container(
                padding: const EdgeInsets.all(16),
                color: Color.fromRGBO(
                  0,
                  0,
                  0,
                  0.5,
                ), // Use Color.fromRGBO instead of withOpacity
                child: Text(
                  'Scanned Data: $scannedData',
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                  textAlign: TextAlign.center,
                ),
              ),
            ),

          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.green, width: 4),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
