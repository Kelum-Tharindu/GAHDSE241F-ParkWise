import 'package:flutter/material.dart';
import 'glassmorphic_container.dart';

class FeatureCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String route;
  final List<Color> gradientColors;
  final Color textColor;

  const FeatureCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.route,
    required this.gradientColors,
    this.textColor = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, route);
      },
      child: GlassmorphicContainer(
        height: 180, // Added the required height parameter
        gradientColors: gradientColors,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.white.withAlpha(60),
                    blurRadius: 8,
                    spreadRadius: -2,
                  ),
                ],
              ),
              child: Icon(icon, size: 36, color: gradientColors[0]),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white.withAlpha(180),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
