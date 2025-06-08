import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'pages/welcome_page.dart';
import 'pages/login_page.dart';
import 'pages/read_page.dart';
import 'pages/qr_preview_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'ParkWise Scanner',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF013220),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Inter',
      ),
      routerConfig: _router,
    );
  }
}

final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const WelcomePage()),
    GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
    GoRoute(path: '/scanner', builder: (context, state) => const ReadPage()),
    GoRoute(
      path: '/qr-preview',
      builder: (context, state) {
        final Map<String, dynamic> qrData = state.extra as Map<String, dynamic>;
        return QRPreviewPage(qrData: qrData);
      },
    ),
  ],
);
