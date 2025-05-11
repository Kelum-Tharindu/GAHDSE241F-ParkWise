import 'package:flutter/material.dart';
import 'package:parking_scanner/url_utils.dart';

class ResultScreen extends StatelessWidget {
  final String scannedCode;
  final VoidCallback onCopy;
  final VoidCallback onScanAgain;

  const ResultScreen({super.key, required this.scannedCode, required this.onCopy, required this.onScanAgain});

  @override
  Widget build(BuildContext context) {
    bool isUrl = UrlUtils.isUrl(scannedCode);
    return  Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.check_circle,
            color: Colors.green,
            size: 80,
          ),
          const SizedBox(height: 20),
          const Text(
            'Scan Successful!',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 30),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Scanned Result:',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  scannedCode,
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: onCopy,
                icon: const Icon(Icons.copy),
                label: const Text('Copy'),
              ),
              const SizedBox(width: 16),
              if (isUrl)
                ElevatedButton.icon(
                  onPressed: () => UrlUtils.launchUrl(context, scannedCode),
                  icon: const Icon(Icons.open_in_browser),
                  label: const Text('Open'),
                ),
            ],
          ),
          const SizedBox(height: 16),
          TextButton.icon(
            onPressed: onScanAgain,
            icon: const Icon(Icons.qr_code_scanner),
            label: const Text('Scan Another Code'),
          ),
        ],
      ),
    );
  }
}
  