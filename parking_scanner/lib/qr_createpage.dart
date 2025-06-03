import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:parking_scanner/mainutils.dart'; // If needed
import 'package:parking_scanner/qr_utils.dart';


class QrCreatePage extends StatefulWidget {
  const QrCreatePage({super.key});

  @override
  State<QrCreatePage> createState() => _QrCreatePageState();
}

class _QrCreatePageState extends State<QrCreatePage> {
  final TextEditingController _textController = TextEditingController();
  final GlobalKey qrKey = GlobalKey();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Generate QR Code'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _textController,
              decoration: InputDecoration(
                labelText: 'Text or URL for QR Code',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _textController.clear();
                    setState(() {});
                  },
                ),
              ),
              onChanged: (value) {
                setState(() {});
              },
            ),
            const SizedBox(height: 30),
            Expanded(
              child: Center(
                child: RepaintBoundary(
                  key: qrKey,
                  child: QrImageView(
                    data: _textController.text.isEmpty ? ' ' : _textController.text,
                    version: QrVersions.auto,
                    size: 250.0,
                    backgroundColor: const Color.fromARGB(255, 255, 255, 255),
                    padding: const EdgeInsets.all(10),
                    errorStateBuilder: (context, error) {
                      return const Center(
                        child: Text(
                          "Error generating QR code",
                          style: TextStyle(color: Colors.red),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton.icon(
                  onPressed: () =>
                      ClipboardUtils.copyToClipboard(context, _textController.text),
                  icon: const Icon(Icons.copy),
                  label: const Text('Copy Text'),
                ),
                const SizedBox(width: 16),
                ElevatedButton.icon(
                  onPressed: () =>
                      QRUtils.saveQrCode(context, qrKey, _textController.text),
                  icon: const Icon(Icons.share),
                  label: const Text('Share QR'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
