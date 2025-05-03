import 'package:flutter/material.dart';

class ProfileAvatar extends StatelessWidget {
  final Color primaryColor;
  final Color highlightColor;
  final double size;
  final IconData icon;

  const ProfileAvatar({
    super.key,
    required this.primaryColor,
    required this.highlightColor,
    this.size = 60.0,
    this.icon = Icons.account_circle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: size,
      width: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(colors: [primaryColor, highlightColor]),
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.white.withAlpha(60),
            blurRadius: 15,
            spreadRadius: -5,
          ),
        ],
      ),
      child: Icon(
        icon,
        color: Colors.white,
        size: size * 0.53, // Proportional to container size
      ),
    );
  }
}
