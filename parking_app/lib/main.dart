import 'package:flutter/material.dart';
import 'pages/home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ParkEase',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF013220),
          brightness: Brightness.dark,
        ),
      ),
      home: const DashboardScreen(),
      routes: {
        '/profile': (context) => const Placeholder(),
        '/add-booking': (context) => const Placeholder(),
        '/booking-history': (context) => const Placeholder(),
        '/ongoing': (context) => const Placeholder(),
        '/nearest-parking': (context) => const Placeholder(),
      },
    );
  }
}
