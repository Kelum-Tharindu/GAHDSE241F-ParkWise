import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

// Import the same widgets used in booking history
import 'package:parking_app/widgets/glassmorphic_app_bar.dart';
import 'package:parking_app/widgets/glassmorphic_container.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool isLoading = false;
  bool rememberMe = false;

  // Theme colors - matching the booking history screen
  final Color backgroundColor = Colors.black;
  final Color primaryColor = const Color(0xFF013220);
  final Color accentColor = const Color(0xFF025939);
  final Color highlightColor = const Color(0xFF15A66E);
  final Color textColor = Colors.white;

  Future<void> login() async {
    setState(() {
      isLoading = true;
    });

    try {
      debugPrint(
        '=====Attempting to login with username: ${usernameController.text}',
      );
      final response = await http.post(
        // Uri.parse('http://localhost:5000/api/auth/login'),
        Uri.parse('http://192.168.8.145:5000/api/auth/login'),

        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': usernameController.text,
          'password': passwordController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (kDebugMode) {
          print('=====Login Response: $data');
        }
        final prefs = await SharedPreferences.getInstance();

        // Save user details if present
        if (data['token'] != null) {
          await prefs.setString('token', data['token']);
        }
        if (data['role'] != null) {
          await prefs.setString('role', data['role']);
        }
        if (data['username'] != null) {
          await prefs.setString('userName', data['username']);
        }
        if (data['id'] != null) {
          await prefs.setString('userId', data['id'].toString());
        }

        if (kDebugMode) {
          print('=====Stored User Data:');
          print('=====Token: [32m${prefs.getString('token')}[0m');
          print('=====Role: ${prefs.getString('role')}');
          print('=====User ID: ${prefs.getString('userId')}');
          print('=====Username: ${prefs.getString('userName')}');
        }

        // Save username if remember me is checked
        if (rememberMe) {
          await prefs.setString('savedUsername', usernameController.text);
        } else {
          await prefs.remove('savedUsername');
        }

        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/dashboard');
      } else {
        if (!mounted) return;
        _showErrorSnackBar('Login failed. Please check your credentials.');
      }
    } catch (e) {
      if (!mounted) return;
      _showErrorSnackBar('Connection error. Please try again later.');
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
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
  void initState() {
    super.initState();
    _loadSavedUsername();
  }

  Future<void> _loadSavedUsername() async {
    final prefs = await SharedPreferences.getInstance();
    final savedUsername = prefs.getString('savedUsername');
    if (savedUsername != null && savedUsername.isNotEmpty) {
      setState(() {
        usernameController.text = savedUsername;
        rememberMe = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Login',
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
                    // Logo/Icon
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withAlpha(25),
                        border: Border.all(
                          color: Colors.white.withAlpha(51),
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
                        Icons.local_parking,
                        color: highlightColor.withAlpha(255),
                        size: 60,
                      ),
                    ),

                    const SizedBox(height: 30),

                    // Welcome Text
                    Text(
                      'Welcome Back',
                      style: TextStyle(
                        color: textColor,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Login to continue to ParkEase',
                      style: TextStyle(
                        color: textColor.withAlpha(179),
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Login Form
                    GlassmorphicContainer(
                      height: 280,
                      gradientColors: [
                        primaryColor.withAlpha(100),
                        accentColor.withAlpha(70),
                      ],
                      borderRadius: BorderRadius.circular(20),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          // Username Field
                          _buildTextField(
                            controller: usernameController,
                            label: 'Username',
                            icon: Icons.person_outline,
                          ),

                          const SizedBox(height: 20),

                          // Password Field
                          _buildTextField(
                            controller: passwordController,
                            label: 'Password',
                            icon: Icons.lock_outline,
                            isPassword: true,
                          ),

                          const SizedBox(height: 16),

                          // Remember Me and Forgot Password
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  SizedBox(
                                    height: 24,
                                    width: 24,
                                    child: Checkbox(
                                      value: rememberMe,
                                      onChanged: (value) {
                                        setState(() {
                                          rememberMe = value ?? false;
                                        });
                                      },
                                      fillColor:
                                          WidgetStateProperty.resolveWith(
                                            (states) => highlightColor,
                                          ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Remember me',
                                    style: TextStyle(
                                      color: textColor.withAlpha(230),
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                              TextButton(
                                onPressed: () {
                                  // Navigate to forgot password page
                                  Navigator.pushNamed(
                                    context,
                                    '/forgot_password',
                                  );
                                },
                                child: Text(
                                  'Forgot Password?',
                                  style: TextStyle(
                                    color: highlightColor,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // Login Button
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: isLoading ? null : login,
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
                                        'LOG IN',
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

                    const SizedBox(height: 30),

                    // Sign Up Option
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account? ",
                          style: TextStyle(
                            color: textColor.withAlpha(204),
                            fontSize: 16,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // Navigate to sign up page
                            Navigator.pushNamed(context, '/register');
                          },
                          child: Text(
                            'Sign Up',
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

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool isPassword = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(25),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withAlpha(51), width: 1),
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword,
        style: TextStyle(color: textColor),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: TextStyle(color: textColor.withAlpha(179)),
          prefixIcon: Icon(icon, color: highlightColor),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            vertical: 16,
            horizontal: 20,
          ),
        ),
      ),
    );
  }
}
