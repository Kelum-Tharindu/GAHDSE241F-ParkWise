import 'package:flutter/material.dart';

class QRPreviewPage extends StatelessWidget {
  final Map<String, dynamic> qrData;

  const QRPreviewPage({super.key, required this.qrData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Generated QR")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Text("QR Created with Hash", style: TextStyle(fontSize: 18)),
            const SizedBox(height: 20),
            if (qrData['qrImage'] != null) Image.network(qrData['qrImage']),
            const SizedBox(height: 20),
            Text("Hash: ${qrData['billingHash']}"),
          ],
        ),
      ),
    );
  }
}
