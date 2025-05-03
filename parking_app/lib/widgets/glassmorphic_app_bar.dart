import 'package:flutter/material.dart';
import 'dart:ui';

class GlassmorphicAppBar extends StatelessWidget
    implements PreferredSizeWidget {
  final String title;
  final List<Widget> actions;
  final Color primaryColor;
  final Color textColor;

  const GlassmorphicAppBar({
    super.key,
    required this.title,
    this.actions = const [],
    required this.primaryColor,
    this.textColor = Colors.white,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        title,
        style: TextStyle(
          color: textColor,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
        ),
      ),
      backgroundColor: Colors.transparent,
      elevation: 0,
      actions: actions,
      flexibleSpace: ClipRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            decoration: BoxDecoration(
              color: primaryColor.withAlpha(100),
              border: Border(
                bottom: BorderSide(color: Colors.white.withAlpha(30), width: 1),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
