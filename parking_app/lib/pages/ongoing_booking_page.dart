import 'package:flutter/material.dart';

class OngoingBookingPage extends StatelessWidget {
  const OngoingBookingPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("ongoing booking")),
      body: const Center(child: Text("Ongoing Booking Page")),
    );
  }
}
