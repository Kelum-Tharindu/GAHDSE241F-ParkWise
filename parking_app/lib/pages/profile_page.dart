import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';
import 'package:parking_app/config/api_config.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  // Controllers for all user fields
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController countryController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController postalCodeController = TextEditingController();

  // Social media link controllers
  final TextEditingController facebookController = TextEditingController();
  final TextEditingController twitterController = TextEditingController();
  final TextEditingController instagramController = TextEditingController();

  // Demo profile image
  String profileImageUrl = 'https://via.placeholder.com/150';
  bool isLoading = false;

  Future<void> fetchProfile() async {
    setState(() {
      isLoading = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final userId = prefs.getString('userId');

      if (token == null || userId == null) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('You are not logged in')));
        // Navigate to login page
        Navigator.pushReplacementNamed(context, '/login');
        return;
      }
      print('=== Fetching profile for user ID: $userId');
      final response = await http.get(
        Uri.parse(ApiConfig.userProfile(userId)),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        print('=== Response body: ${response.body}');
        // The backend returns the user data directly, not wrapped in a 'data' property
        final data = jsonDecode(response.body);
        print('=== Decoded response: $data');

        if (!mounted) return;

        setState(() {
          // Populate all text controllers with user data
          try {
            usernameController.text = data['username']?.toString() ?? '';
            firstNameController.text = data['firstName']?.toString() ?? '';
            lastNameController.text = data['lastName']?.toString() ?? '';
            emailController.text = data['email']?.toString() ?? '';
            phoneController.text = data['phone']?.toString() ?? '';
            countryController.text = data['country']?.toString() ?? '';
            cityController.text = data['city']?.toString() ?? '';
            postalCodeController.text = data['postalCode']?.toString() ?? '';

            // Populate social media links if available
            if (data['socialLinks'] != null && data['socialLinks'] is Map) {
              final socialLinks = data['socialLinks'] as Map;
              facebookController.text =
                  socialLinks['facebook']?.toString() ?? '';
              twitterController.text = socialLinks['twitter']?.toString() ?? '';
              instagramController.text =
                  socialLinks['instagram']?.toString() ?? '';
            } else {
              // Reset social media fields if no data
              facebookController.text = '';
              twitterController.text = '';
              instagramController.text = '';
            }

            // If the user has a profile image URL in the backend response, use it
            if (data['profileImage'] != null &&
                data['profileImage'].toString().isNotEmpty) {
              profileImageUrl = data['profileImage'].toString();
            }
          } catch (e) {
            print('=== Error parsing profile data: $e');
            // Continue execution, we already have default empty values
          }
        });
        print('=== Profile data loaded successfully');
      } else {
        if (!mounted) return;
        print('=== Failed to fetch profile: ${response.body}');
        try {
          final errorJson = jsonDecode(response.body);
          final errorMessage = errorJson['message'] ?? 'Unknown error occurred';
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Error: $errorMessage')));
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to fetch profile: ${response.statusCode}'),
            ),
          );
        }
      }
    } catch (e) {
      if (!mounted) return;
      print('=== Error fetching profile: $e');
      print('=== Error details: ${e.toString()}');

      // Show a more specific error message
      String errorMessage = 'An error occurred while fetching your profile';
      if (e.toString().contains('NoSuchMethodError')) {
        errorMessage =
            'Server returned unexpected data format. Please try again later.';
      }

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(errorMessage)));
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Future<void> updateProfile() async {
    setState(() {
      isLoading = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final userId = prefs.getString('userId');

      if (token == null || userId == null) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('You are not logged in')));
        return;
      }
      print('=== Updating profile for user ID: $userId');
      final response = await http.put(
        Uri.parse(ApiConfig.userProfile(userId)),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'username': usernameController.text,
          'firstName': firstNameController.text,
          'lastName': lastNameController.text,
          'email': emailController.text,
          'phone': phoneController.text,
          'country': countryController.text,
          'city': cityController.text, 'postalCode': postalCodeController.text,
          'profileImage': profileImageUrl,
          // Social media links properly formatted according to backend controller
          'socialLinks': {
            'facebook': facebookController.text,
            'twitter': twitterController.text,
            'instagram': instagramController.text,
          },
        }),
      );
      if (response.statusCode == 200) {
        if (!mounted) return;
        print('=== Profile updated successfully');
        print('=== Updated profile data: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully')),
        );

        // Refresh the profile data after update
        fetchProfile();
      } else {
        if (!mounted) return;
        print('=== Failed to update profile: ${response.body}');
        try {
          final errorJson = jsonDecode(response.body);
          final errorMessage = errorJson['message'] ?? 'Unknown error occurred';
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Error: $errorMessage')));
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to update profile: ${response.statusCode}'),
            ),
          );
        }
      }
    } catch (e) {
      if (!mounted) return;
      print('=== Error updating profile: $e');
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Profile picture
                    Center(
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 60,
                            backgroundImage: NetworkImage(profileImageUrl),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              height: 40,
                              width: 40,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  width: 4,
                                  color:
                                      Theme.of(context).scaffoldBackgroundColor,
                                ),
                                color: Theme.of(context).colorScheme.primary,
                              ),
                              child: IconButton(
                                icon: const Icon(
                                  Icons.edit,
                                  color: Colors.white,
                                  size: 20,
                                ),
                                onPressed: () {
                                  // For demo, we'll just rotate through 3 demo images
                                  setState(() {
                                    final demoImages = [
                                      'https://via.placeholder.com/150',
                                      'https://via.placeholder.com/150/0000FF/FFFFFF',
                                      'https://via.placeholder.com/150/FF0000/FFFFFF',
                                    ];
                                    final currentIndex = demoImages.indexOf(
                                      profileImageUrl,
                                    );
                                    final nextIndex =
                                        (currentIndex + 1) % demoImages.length;
                                    profileImageUrl = demoImages[nextIndex];
                                  });
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),

                    // User info fields
                    TextField(
                      controller: usernameController,
                      decoration: const InputDecoration(
                        labelText: 'Username',
                        prefixIcon: Icon(Icons.person),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: firstNameController,
                            decoration: const InputDecoration(
                              labelText: 'First Name',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextField(
                            controller: lastNameController,
                            decoration: const InputDecoration(
                              labelText: 'Last Name',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: phoneController,
                      decoration: const InputDecoration(
                        labelText: 'Phone',
                        prefixIcon: Icon(Icons.phone),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: countryController,
                      decoration: const InputDecoration(
                        labelText: 'Country',
                        prefixIcon: Icon(Icons.public),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: cityController,
                            decoration: const InputDecoration(
                              labelText: 'City',
                              prefixIcon: Icon(Icons.location_city),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextField(
                            controller: postalCodeController,
                            decoration: const InputDecoration(
                              labelText: 'Postal Code',
                              prefixIcon: Icon(Icons.local_post_office),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 30),

                    // Social Media Links Section
                    const Padding(
                      padding: EdgeInsets.only(bottom: 16.0),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Social Media Links',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),

                    TextField(
                      controller: facebookController,
                      decoration: const InputDecoration(
                        labelText: 'Facebook',
                        prefixIcon: Icon(Icons.facebook, color: Colors.blue),
                        border: OutlineInputBorder(),
                        hintText: 'Enter your Facebook profile URL',
                      ),
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: twitterController,
                      decoration: const InputDecoration(
                        labelText: 'Twitter',
                        prefixIcon: Icon(
                          Icons.flutter_dash,
                          color: Colors.lightBlue,
                        ),
                        border: OutlineInputBorder(),
                        hintText: 'Enter your Twitter profile URL',
                      ),
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: instagramController,
                      decoration: const InputDecoration(
                        labelText: 'Instagram',
                        prefixIcon: Icon(Icons.camera_alt, color: Colors.pink),
                        border: OutlineInputBorder(),
                        hintText: 'Enter your Instagram profile URL',
                      ),
                    ),
                    const SizedBox(height: 30),

                    ElevatedButton(
                      onPressed: updateProfile,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(50),
                      ),
                      child: const Text('Update Profile'),
                    ),
                  ],
                ),
              ),
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 4, // Profile tab is index 4 according to main.dart
        onTap: (index) {
          if (index != 4) {
            // Handle navigation based on index
            switch (index) {
              case 0:
                if (!mounted) return;
                Navigator.pushReplacementNamed(context, '/dashboard');
                break;
              case 1:
                // Search functionality
                break;
              case 2:
                if (!mounted) return;
                Navigator.pushReplacementNamed(context, '/enter-parking');
                break;
              case 3:
                // Saved functionality
                break;
            }
          }
        },
        primaryColor: Theme.of(context).colorScheme.primary,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search_outlined),
            activeIcon: Icon(Icons.search),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.qr_code_scanner_outlined),
            activeIcon: Icon(Icons.qr_code_scanner),
            label: 'Scan',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bookmark_outline),
            activeIcon: Icon(Icons.bookmark),
            label: 'Saved',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
