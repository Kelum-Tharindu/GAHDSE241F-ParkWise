import 'package:flutter/material.dart';
import 'generate_page.dart';
import 'read_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('QR App')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const GeneratePage()),
                );
              },
              child: const Text("Generate QR"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ReadPage()),
                );
              },
              child: const Text("Scan QR"),
            ),
          ],
        ),
      ),
    );
  }
}
