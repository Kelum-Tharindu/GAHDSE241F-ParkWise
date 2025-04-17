import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:convert';

class GeneratePage extends StatefulWidget {
  const GeneratePage({super.key});

  @override
  State<GeneratePage> createState() => _GeneratePageState();
}

class _GeneratePageState extends State<GeneratePage> {
  final TextEditingController parkingIdController = TextEditingController();
  final TextEditingController userIdController = TextEditingController();
  String? qrData;

  void generateQR() {
    final parkingId = parkingIdController.text.trim();
    final userId = userIdController.text.trim();

    if (parkingId.isEmpty || userId.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please fill both fields')));
      return;
    }

    final data = {'parkingId': parkingId, 'userId': userId};

    setState(() {
      qrData = jsonEncode(data);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Generate Parking QR'),
        backgroundColor: const Color(0xFF00C566), // bright green
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                controller: parkingIdController,
                decoration: const InputDecoration(
                  labelText: 'Parking ID',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: userIdController,
                decoration: const InputDecoration(
                  labelText: 'User ID',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: generateQR,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00C566),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Generate QR'),
              ),
              const SizedBox(height: 20),
              if (qrData != null)
                Column(
                  children: [
                    const Text(
                      'Generated QR Code:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 10),
                    QrImageView(
                      data: qrData!,
                      version: QrVersions.auto,
                      size: 200.0,
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
