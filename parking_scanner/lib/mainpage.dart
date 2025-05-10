import 'package:flutter/material.dart';

class Mainpage extends StatelessWidget {
  const Mainpage({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: AppBar.new(
        title: Text('Parking Scanner'),
      ),
      body: Center(
        child: Text('Welcome to Parking Scanner!'),
      ),
    );
  }
}