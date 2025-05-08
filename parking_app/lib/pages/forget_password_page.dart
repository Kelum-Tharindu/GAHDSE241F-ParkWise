import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Import the same widgets used in other authentication pages
import 'package:parking_app/widgets/glassmorphic_app_bar.dart';
import 'package:parking_app/widgets/glassmorphic_container.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  bool isLoading = false;
  bool emailSent = false;

  // Theme colors - matching the other screens
  final Color backgroundColor = Colors.black;
  final Color primaryColor = const Color(0xFF013220);
  final Color accentColor = const Color(0xFF025939);
  final Color highlightColor = const Color(0xFF15A66E);
  final Color textColor = Colors.white;

  // Form validation
  final _formKey = GlobalKey<FormState>();

  Future<void> requestPasswordReset() async {
    // First validate the form
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/auth/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': emailController.text.trim(),
          'platform': 'mobile', // Add platform identifier
        }),
      );

      if (response.statusCode == 200) {
        if (!mounted) return;
        setState(() {
          emailSent = true;
          isLoading = false;
        });
      } else {
        if (!mounted) return;
        _showErrorSnackBar('Error processing request. Please try again later.');
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      if (!mounted) return;
      _showErrorSnackBar('Connection error. Please try again later.');
      setState(() {
        isLoading = false;
      });
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Forgot Password',
        primaryColor: primaryColor,
        textColor: textColor,
      ),
      body: Container(
        decoration: BoxDecoration(
          // Add subtle pattern background
          image: const DecorationImage(
            image: NetworkImage(
              'https://www.transparenttextures.com/patterns/carbon-fibre.png',
            ),
            repeat: ImageRepeat.repeat,
          ),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              backgroundColor,
              const Color(0xFF121212),
              const Color(0xFF0A0A0A),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Icon
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withAlpha(30),
                        border: Border.all(
                          color: Colors.white.withAlpha(70),
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: highlightColor.withAlpha(77),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Icon(
                        emailSent
                            ? Icons.check_circle_outline
                            : Icons.lock_reset,
                        color: highlightColor,
                        size: 60,
                      ),
                    ),

                    const SizedBox(height: 30),

                    // Title
                    Text(
                      emailSent ? 'Check Your Email' : 'Reset Password',
                      style: TextStyle(
                        color: textColor,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Description
                    Text(
                      emailSent
                          ? 'If the email exists in our system, you\'ll receive a password reset link shortly. Please check your inbox and spam folder.'
                          : 'Enter your email address and we\'ll send you a link to reset your password.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: textColor.withAlpha(179),
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Form or Success Message
                    emailSent ? _buildSuccessContent() : _buildResetForm(),

                    const SizedBox(height: 30),

                    // Back to Login
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Remember your password? ",
                          style: TextStyle(
                            color: textColor.withAlpha(204),
                            fontSize: 16,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushReplacementNamed(context, '/login');
                          },
                          child: Text(
                            'Log In',
                            style: TextStyle(
                              color: highlightColor,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResetForm() {
    return Form(
      key: _formKey,
      child: GlassmorphicContainer(
        height: 200,
        gradientColors: [
          primaryColor.withAlpha(100),
          accentColor.withAlpha(70),
        ],
        borderRadius: BorderRadius.circular(20),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Email Field
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(25),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withAlpha(51), width: 1),
              ),
              child: TextFormField(
                controller: emailController,
                style: TextStyle(color: textColor),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email address';
                  }
                  if (!RegExp(
                    r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                  ).hasMatch(value)) {
                    return 'Please enter a valid email address';
                  }
                  return null;
                },
                decoration: InputDecoration(
                  labelText: 'Email Address',
                  labelStyle: TextStyle(color: textColor.withAlpha(179)),
                  prefixIcon: Icon(Icons.email_outlined, color: highlightColor),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 20,
                  ),
                  errorStyle: const TextStyle(
                    color: Colors.redAccent,
                    fontSize: 12,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Send Reset Link Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: isLoading ? null : requestPasswordReset,
                style: ElevatedButton.styleFrom(
                  backgroundColor: highlightColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 5,
                  shadowColor: highlightColor.withAlpha(128),
                ),
                child:
                    isLoading
                        ? SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                        : const Text(
                          'SEND RESET LINK',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessContent() {
    return GlassmorphicContainer(
      height: 130,
      gradientColors: [Colors.green.withAlpha(100), Colors.green.withAlpha(70)],
      borderRadius: BorderRadius.circular(20),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.email_outlined, color: Colors.white, size: 36),
          const SizedBox(height: 16),
          Text(
            'Email sent successfully!',
            style: TextStyle(
              color: textColor,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            'Please check your inbox',
            style: TextStyle(color: textColor.withAlpha(204), fontSize: 14),
          ),
        ],
      ),
    );
  }
}
