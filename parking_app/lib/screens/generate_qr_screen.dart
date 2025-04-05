import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import '../services/api_service.dart';

class GenerateQRScreen extends StatefulWidget {
  @override
  _GenerateQRScreenState createState() => _GenerateQRScreenState();
}

class _GenerateQRScreenState extends State<GenerateQRScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  String? parkingID;
  String userID = "user123"; // Replace with actual user logic

  void _onQRViewCreated(QRViewController qrController) {
    this.controller = qrController;
    qrController.scannedDataStream.listen((scanData) async {
      qrController.pauseCamera();
      setState(() {
        parkingID = scanData.code; // Read scanned Parking ID
      });
      qrController.dispose();
    });
  }

  Future<void> generateQR() async {
    if (parkingID == null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text("Scan the Parking QR first"),
        backgroundColor: Colors.red,
      ));
      return;
    }

    final result = await ApiService.scanEntry(userID, parkingID!);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text("QR Generated!"),
    ));
    print("Generated QR: ${result['qrCode']}");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Parking Entry QR")),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (parkingID == null)
            Column(
              children: [
                Text("Scan Parking QR", style: TextStyle(fontSize: 18)),
                Container(
                  height: 300,
                  width: 300,
                  child: QRView(
                    key: qrKey,
                    onQRViewCreated: _onQRViewCreated,
                  ),
                ),
              ],
            )
          else
            Column(
              children: [
                Text("Scanned Parking ID: $parkingID"),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: generateQR,
                  child: Text("Generate Entry QR"),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
