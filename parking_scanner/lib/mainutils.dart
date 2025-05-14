
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

/// These packages only work on mobile and desktop
import 'dart:io' show File;
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

class QRUtils {
  static Future<void> saveQrCode(BuildContext context, GlobalKey qrKey, String text) async {
    // Show error on unsupported platforms (e.g., Web)
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('QR code sharing is not supported on Web')),
      );
      return;
    }

    try {
      // Get the QR code widget's render object
      final boundary = qrKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;

      if (boundary == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('QR Code not available to save.')),
        );
        return;
      }

      // Convert it to an image
      final ui.Image qrImage = await boundary.toImage(pixelRatio: 3.0);
      final ByteData? byteData = await qrImage.toByteData(format: ui.ImageByteFormat.png);

      if (byteData == null) throw Exception("Could not convert QR to image.");

      final Uint8List pngBytes = byteData.buffer.asUint8List();

      // Save to temporary file
      final tempDir = await getTemporaryDirectory();
      final file = File('${tempDir.path}/qr_code.png');
      await file.writeAsBytes(pngBytes);

      // Share the image file
      // ignore: deprecated_member_use
      await Share.shareXFiles([XFile(file.path)], text: 'QR Code for: $text');
    } catch (e) {
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error saving QR code: $e')),
      );
    }
  }
}
