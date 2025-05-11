import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

class QRUtils {
  static Future<void> saveQrCode(BuildContext context, GlobalKey qrKey, String text) async {
    try {
      // Get the QR code widget
      final qrImageWidget = qrKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      
      // Convert it to an image
      final qrImageObject = await qrImageWidget.toImage(pixelRatio: 3.0);
      final ByteData? byteData = await qrImageObject.toByteData(format: ui.ImageByteFormat.png);
      
      if (byteData != null) {
        final pngBytes = byteData.buffer.asUint8List();
        
        // Get temporary directory
        final tempDir = await getTemporaryDirectory();
        final file = File('${tempDir.path}/qr_code.png');
        
        // Write bytes to file
        await file.writeAsBytes(pngBytes);
        
        // Share the file
        await Share.shareXFiles([XFile(file.path)], text: 'QR Code for: $text');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error saving QR code: $e')),
      );
    }
  }
}