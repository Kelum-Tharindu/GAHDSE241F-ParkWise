import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

class QRPreviewPage extends StatelessWidget {
  final Map<String, dynamic> qrData;
  final GlobalKey _globalKey = GlobalKey();

  QRPreviewPage({super.key, required this.qrData});

  String formatDateTime(String? rawDate) {
    if (rawDate == null) return "N/A";
    try {
      final date = DateTime.parse(rawDate);
      return DateFormat('yyyy-MM-dd – HH:mm:ss').format(date);
    } catch (e) {
      if (kDebugMode) print("❌ Error parsing date: $e");
      return "Invalid date format";
    }
  }

  Future<void> _shareQRImage(BuildContext context) async {
    try {
      RenderRepaintBoundary boundary =
          _globalKey.currentContext!.findRenderObject()
              as RenderRepaintBoundary;
      ui.Image image = await boundary.toImage(pixelRatio: 3.0);
      ByteData? byteData = await image.toByteData(
        format: ui.ImageByteFormat.png,
      );
      Uint8List pngBytes = byteData!.buffer.asUint8List();

      final tempDir = await getTemporaryDirectory();
      final file = await File('${tempDir.path}/qr_image.png').create();
      await file.writeAsBytes(pngBytes);

      await Share.shareXFiles([XFile(file.path)], text: 'Here is your QR Code');
    } catch (e) {
      if (kDebugMode) print('❌ Error sharing image: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Failed to share QR')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final String? qrImage = qrData['qrImage'];
    final String entryTime = formatDateTime(qrData['entryTime']);
    final String exitTime = formatDateTime(qrData['exitTime']);
    final int? duration = qrData['duration'];
    final num? fee = qrData['fee'];
    final String? paymentStatus = qrData['paymentStatus'];

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text(
          "Billing QR Preview",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF013220),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text(
              "Parking Billing Details",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const Divider(thickness: 2, color: Colors.white),
            const SizedBox(height: 20),

            if (qrImage != null)
              RepaintBoundary(
                key: _globalKey,
                child: _buildBase64QRImage(qrImage),
              )
            else
              const Text(
                "QR image not available",
                style: TextStyle(color: Colors.white),
              ),

            const SizedBox(height: 20),
            buildInfoRow("Entry Time", entryTime),
            buildInfoRow("Exit Time", exitTime),
            if (duration != null) buildInfoRow("Duration", "$duration minutes"),
            if (fee != null)
              buildInfoRow("Fee", "Rs. ${fee.toStringAsFixed(2)}"),
            if (paymentStatus != null)
              buildInfoRow("Payment Status", paymentStatus),

            const Spacer(),
            Center(
              child: ElevatedButton.icon(
                onPressed: () => _shareQRImage(context),
                icon: const Icon(Icons.share),
                label: const Text("Share"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF013220),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildBase64QRImage(String base64Str) {
    try {
      final String cleanedBase64 = base64Str.split(',').last;
      Uint8List imageBytes = base64Decode(cleanedBase64);

      return Image.memory(
        imageBytes,
        width: 200,
        height: 200,
        fit: BoxFit.cover,
      );
    } catch (e) {
      if (kDebugMode) print("❌ Error decoding base64 image: $e");
      return const Text("Failed to load QR image");
    }
  }

  Widget buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Text(
            "$label: ",
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Expanded(
            child: Text(value, style: const TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
