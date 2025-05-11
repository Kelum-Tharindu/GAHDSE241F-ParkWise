import 'package:flutter/material.dart';

class UrlUtils {
  static bool isUrl(String text) {
    return text.startsWith('http://') || 
           text.startsWith('https://') ||
           text.startsWith('www.');
  }
   static void launchUrl(BuildContext context, String url) {
     ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Opening URL: $url')),
    );
  }
}