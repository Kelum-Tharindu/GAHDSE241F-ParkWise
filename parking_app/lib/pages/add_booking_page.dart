import 'package:flutter/material.dart';

class AddBookingPage extends StatelessWidget {
  const AddBookingPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Add Booking")),
      body: const Center(child: Text("Add Booking Page")),
    );
  }
}
