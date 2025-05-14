
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:parking_scanner/qr_createpage.dart';
import 'package:parking_scanner/qr_utils.dart';
import 'package:parking_scanner/result_screen.dart';



class Mainpage extends StatefulWidget {
  const Mainpage({super.key});

  @override
  State<Mainpage> createState() => _MainpageState();
}

class _MainpageState extends State<Mainpage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late MobileScannerController _scannerController;
  bool _hasScanned = false;
  String _scannedCode = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this); // See next fix
    _scannerController = MobileScannerController();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Parking Scanner'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.qr_code), text: 'Generate'),
            Tab(icon: Icon(Icons.qr_code_scanner), text: 'Scan'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          const QrCreatePage(),
          Stack(
            children: [
              if (!_hasScanned)
                MobileScanner(
                  controller: _scannerController,
                  onDetect: (capture) {
                    final List<Barcode> barcodes = capture.barcodes;
                    if (barcodes.isNotEmpty && barcodes[0].rawValue != null) {
                      setState(() {
                        _scannedCode = barcodes[0].rawValue!;
                        _hasScanned = true;
                      });
                    }
                  },
                ),
              if (_hasScanned)
                ResultScreen(
                  scannedCode: _scannedCode,
                  onCopy: () => ClipboardUtils.copyToClipboard(context, _scannedCode),
                  onScanAgain: () {
                    setState(() {
                      _hasScanned = false;
                      _scannedCode = '';
                    });
                  },
                ),
            ],
          ),
        ],
      ),
    );
  }
}

  



