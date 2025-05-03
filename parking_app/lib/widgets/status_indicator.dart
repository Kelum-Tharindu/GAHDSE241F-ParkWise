import 'package:flutter/material.dart';

class StatusIndicator extends StatelessWidget {
  final Color color;
  final double size;

  const StatusIndicator({super.key, required this.color, this.size = 10.0});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
    );
  }
}
