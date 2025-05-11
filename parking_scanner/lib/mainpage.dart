
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:parking_scanner/qr_createpage.dart';
import 'package:parking_scanner/qr_utils.dart';



class Mainpage extends StatelessWidget {
  const Mainpage({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: AppBar(
        title: Text('Parking Scanner'),
      )
      
     bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(
              icon: Icon(Icons.qr_code),
              text: 'Generate',
            ),
            Tab(
              icon: Icon(Icons.qr_code_scanner),
              text: 'Scan',
            ),
          ],
        ),
      
      body: TabBarView(
        controller: _tabController,
        children: [
          // Generate Tab
          const GeneratorTab(),
          
          // Scan Tab
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
                ScanResultScreen(
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


