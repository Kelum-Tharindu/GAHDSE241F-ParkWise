import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:parking_scanner/mainpage.dart';
import 'package:parking_scanner/qr_createpage.dart';
import 'package:parking_scanner/qr_utils.dart';
import 'package:parking_scanner/url_utils.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Scanner Pro',
      theme: ThemeData(
       
       primarySwatch: Colors.green,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
          systemOverlayStyle: SystemUiOverlayStyle.dark,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
        scaffoldBackgroundColor: Colors.white,
      ),
      home: const Mainpage(),
      debugShowCheckedModeBanner: false,
    );
  }
}