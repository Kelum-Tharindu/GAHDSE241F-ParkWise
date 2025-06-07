// ignore_for_file: use_build_context_synchronously

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:parking_app/widgets/booking_details_form.dart';
import '../widgets/glassmorphic_app_bar.dart';
import '../widgets/section_header.dart';
import '../widgets/gradient_button.dart';
import '../widgets/fee_row.dart';
import 'booking_preview.dart';
import '../services/booking_service.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';

class BookingPage extends StatefulWidget {
  const BookingPage({super.key});

  @override
  State<BookingPage> createState() => _BookingPageState();
}

class _BookingPageState extends State<BookingPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController parkingNameController = TextEditingController();
  final TextEditingController entryTimeController = TextEditingController();
  final TextEditingController exitTimeController = TextEditingController();

  String vehicleType = 'car';
  double usageFee = 0.0;
  double bookingFee = 0.0;
  double totalFee = 0.0;
  String durationText = '0h 0m';
  bool isLoading = false;
  bool showFeeSection = false;
  String apiResponseDetails = '';

  DateTime? entryTime;
  DateTime? exitTime;
  //print entry and exit time to console
  void printEntryExitTime() {
    debugPrint('==============###Entry Time: $entryTime');
    debugPrint('==============### Exit Time: $exitTime');
  }

  final List<String> vehicleTypes = ['car', 'bicycle', 'truck'];
  List<String> parkingNames = [];

  @override
  void initState() {
    super.initState();
    _fetchParkingNames();
    _initializeFromArguments();

    // Adding listeners to log updates to input fields
    parkingNameController.addListener(() {
      debugPrint('===Parking Name updated: ${parkingNameController.text}');
    });

    entryTimeController.addListener(() {
      entryTime = DateFormat(
        'yyyy-MM-dd HH:mm',
      ).parse(entryTimeController.text);
      debugPrint('====Entry Time updated: $entryTime');
    });

    exitTimeController.addListener(() {
      exitTime = DateFormat('yyyy-MM-dd HH:mm').parse(exitTimeController.text);
      debugPrint('======Exit Time updated: $exitTime');
    });
  }

  void _initializeFromArguments() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final args =
          ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
      if (args != null) {
        setState(() {
          if (args['parkingName'] != null) {
            parkingNameController.text = args['parkingName'];
          }
          if (args['vehicleType'] != null) {
            vehicleType = args['vehicleType'];
          }
        });
      }
    });
  }

  Future<void> _fetchParkingNames() async {
    try {
      final names = await BookingService.fetchParkingNames();
      if (!mounted) return;

      // Log the received parking names to the console
      debugPrint('=====================! Received parking names: $names');

      setState(() {
        parkingNames = names;
      });
    } catch (e) {
      debugPrint('Error fetching parking names: $e');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error loading parking names: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  void dispose() {
    parkingNameController.dispose();
    entryTimeController.dispose();
    exitTimeController.dispose();
    super.dispose();
  }

  Future<void> _fetchFeeDetails() async {
    if (mounted) {
      setState(() {
        isLoading = true;
        apiResponseDetails = 'Sending request to backend...';
      });
    }

    try {
      final feeDetails = await BookingService.calculateFees(
        parkingName: parkingNameController.text,
        vehicleType: vehicleType,
        entryTime: entryTime,
        exitTime: exitTime,
      );

      if (!mounted) return;
      setState(() {
        usageFee = (feeDetails['usageFee'] as num).toDouble();
        bookingFee = (feeDetails['bookingFee'] as num).toDouble();
        totalFee = (feeDetails['totalFee'] as num).toDouble();
        durationText = feeDetails['totalDuration'] as String;
        isLoading = false;
        showFeeSection = true;
        apiResponseDetails = 'API Response Success: Received fee details';
      });
    } catch (e) {
      debugPrint('Error fetching fee details: $e');
      if (!mounted) return;
      setState(() {
        usageFee = 0.0;
        bookingFee = 0.0;
        totalFee = 0.0;
        durationText = '0h 0m';
        isLoading = false;
        showFeeSection = true;
        apiResponseDetails = 'API Error: $e';

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error calculating fees: $e'),
            backgroundColor: Colors.red,
          ),
        );
      });
    }
  }

  void _resetValues() {
    setState(() {
      final now = DateTime.now();
      entryTime = now;
      entryTimeController.text = DateFormat('yyyy-MM-dd HH:mm').format(now);

      final later = now.add(const Duration(hours: 1));
      exitTime = later;
      exitTimeController.text = DateFormat('yyyy-MM-dd HH:mm').format(later);

      parkingNameController.clear();
      vehicleType = 'car';
      usageFee = 0.0;
      bookingFee = 0.0;
      totalFee = 0.0;
      durationText = '0h 0m';
      showFeeSection = false;
      apiResponseDetails = '';
    });
  }

  Future<void> _selectDateTime(
    BuildContext context,
    TextEditingController controller,
  ) async {
    DateTime initialDate =
        controller == entryTimeController
            ? (entryTime ?? DateTime.now())
            : (exitTime ?? DateTime.now().add(const Duration(hours: 1)));

    final pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime.now().subtract(const Duration(days: 1)),
      lastDate: DateTime.now().add(const Duration(days: 30)),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF15A66E),
              onPrimary: Colors.white,
              surface: Color(0xFF121212),
              onSurface: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );

    if (!mounted) return;

    if (pickedDate != null) {
      final initialTime =
          controller == entryTimeController
              ? TimeOfDay.fromDateTime(entryTime ?? DateTime.now())
              : TimeOfDay.fromDateTime(
                exitTime ?? DateTime.now().add(const Duration(hours: 1)),
              );

      final pickedTime = await showTimePicker(
        context: context,
        initialTime: initialTime,
        builder: (context, child) {
          return Theme(
            data: ThemeData.dark().copyWith(
              colorScheme: const ColorScheme.dark(
                primary: Color(0xFF15A66E),
                onPrimary: Colors.white,
                surface: Color(0xFF121212),
                onSurface: Colors.white,
              ),
            ),
            child: child!,
          );
        },
      );

      if (!mounted) return;

      if (pickedTime != null) {
        final combinedDateTime = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          pickedTime.hour,
          pickedTime.minute,
        );

        controller.text = DateFormat(
          'yyyy-MM-dd HH:mm',
        ).format(combinedDateTime);

        if (controller == exitTimeController) {
          if (entryTime != null && combinedDateTime.isBefore(entryTime!)) {
            if (kDebugMode) {
              print(
                '=======enrtryTime: $entryTime, exitTime: $combinedDateTime',
              );
            }
            if (kDebugMode) {
              if (!mounted) return;
            }
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Exit time cannot be before entry time'),
                backgroundColor: Colors.red,
              ),
            );

            final validExitTime = entryTime!.add(const Duration(hours: 1));
            controller.text = DateFormat(
              'yyyy-MM-dd HH:mm',
            ).format(validExitTime);
          }
        }
      }
    }
  }

  String? validateParkingName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter parking name';
    }
    if (value.length < 3) {
      return 'Parking name must be at least 3 characters';
    }
    return null;
  }

  String? validateVehicleType(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please select vehicle type';
    }
    if (!vehicleTypes.contains(value)) {
      return 'Please select a valid vehicle type';
    }
    return null;
  }

  String? validateEntryTime(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please select entry time';
    }
    try {
      DateFormat('yyyy-MM-dd HH:mm').parse(value);
    } catch (e) {
      return 'Invalid time format';
    }
    return null;
  }

  String? validateExitTime(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please select exit time';
    }
    try {
      final exit = DateFormat('yyyy-MM-dd HH:mm').parse(value);
      if (entryTimeController.text.isEmpty) {
        return 'Please select entry time first';
      }
      final entry = DateFormat(
        'yyyy-MM-dd HH:mm',
      ).parse(entryTimeController.text);
      if (exit.isBefore(entry) || exit.isAtSameMomentAs(entry)) {
        return 'Exit time must be after entry time';
      }
      final duration = exit.difference(entry);
      if (duration.inDays > 7) {
        return 'Maximum booking duration is 7 days';
      }
    } catch (e) {
      return 'Invalid time format';
    }
    return null;
  }

  Future<void> _processBooking(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        isLoading = true;
        apiResponseDetails = 'Sending booking confirmation request...';
      });

      try {
        final responseData = await BookingService.confirmBooking(
          parkingName: parkingNameController.text,
          // userId: "662b3c9c12c85f01e8d5d679", // Hardcoded user ID
          bookingDate: DateTime.now(), // Current date as booking date
          entryTime: entryTime!,
          exitTime: exitTime!,
          usageFee: usageFee,
          bookingFee: bookingFee,
          totalFee: totalFee,
          vehicleType: vehicleType,
        );

        debugPrint(
          '====Request Body: {\n'
          '  "parkingName": "${parkingNameController.text}",\n'
          '  "userId": "662b3c9c12c85f01e8d5d679",\n'
          '  "bookingDate": "${DateTime.now()}",\n'
          '  "entryTime": "$entryTime",\n'
          '  "exitTime": "$exitTime",\n'
          '  "usageFee": "$usageFee",\n'
          '  "bookingFee": "$bookingFee",\n'
          '  "totalFee": "$totalFee",\n'
          '  "vehicleType": "$vehicleType"\n'
          '}',
        );

        if (!mounted) return;
        setState(() {
          isLoading = false;
          apiResponseDetails = 'Booking confirmed successfully!';
        });

        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => BookingPreviewScreen(
                  parkingName: responseData['parkingName'],
                  vehicleType: responseData['vehicleType'],
                  entryTime: DateTime.parse(responseData['entryTime']),
                  exitTime: DateTime.parse(responseData['exitTime']),
                  usageFee: responseData['fee']['usageFee'].toDouble(),
                  bookingFee: responseData['fee']['bookingFee'].toDouble(),
                  totalFee: responseData['fee']['totalFee'].toDouble(),
                  duration: responseData['totalDuration'],
                  qrImage: responseData['qrImage'],
                  paymentStatus: responseData['paymentStatus'],
                  bookingState: responseData['bookingState'],
                ),
          ),
        );
      } catch (e) {
        if (!mounted) return;
        setState(() {
          isLoading = false;
          apiResponseDetails = 'Error: $e';
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to process booking: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _calculateFee() {
    if (_formKey.currentState!.validate()) {
      // Print input values to console
      debugPrint('===== CALCULATE FEE INPUTS =====');
      debugPrint('=====Parking Name: ${parkingNameController.text}');
      debugPrint('======Vehicle Type: $vehicleType');
      debugPrint('=====Entry Time: $entryTime');
      debugPrint('========Exit Time: $exitTime');
      debugPrint('===============================');

      _fetchFeeDetails();
    }
  }

  @override
  Widget build(BuildContext context) {
    final Color backgroundColor = Colors.black;
    final Color primaryColor = const Color(0xFF013220);
    final Color accentColor = const Color(0xFF025939);
    final Color highlightColor = const Color(0xFF15A66E);
    final Color textColor = Colors.white;

    return Scaffold(
      backgroundColor: backgroundColor,
      extendBodyBehindAppBar: true,
      appBar: GlassmorphicAppBar(
        title: 'Book Parking',
        primaryColor: primaryColor,
        textColor: textColor,
        actions: [],
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SectionHeader(title: 'Booking Details'),
                  const SizedBox(height: 20),
                  BookingDetailsForm(
                    parkingNameController: parkingNameController,
                    entryTimeController: entryTimeController,
                    exitTimeController: exitTimeController,
                    vehicleType: vehicleType,
                    vehicleTypes: vehicleTypes,
                    parkingNames: parkingNames, // Pass parking names here
                    onVehicleTypeChanged: (newValue) {
                      if (newValue != null && vehicleTypes.contains(newValue)) {
                        setState(() {
                          vehicleType = newValue;
                        });
                      }
                    },
                    selectDateTime: _selectDateTime,
                    validateParkingName: validateParkingName,
                    validateVehicleType: validateVehicleType,
                    validateEntryTime: validateEntryTime,
                    validateExitTime: validateExitTime,
                  ),
                  const SizedBox(height: 24),

                  // Calculate Fee Button
                  GradientButton(
                    text: isLoading ? 'Calculating...' : 'Calculate Fee',
                    onPressed: isLoading ? () {} : _calculateFee,
                    gradientColors: [accentColor, highlightColor],
                  ),

                  // API Response Indicator
                  if (apiResponseDetails.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: const Color(0xFF15A66E),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.info_outline,
                            color: Color(0xFF15A66E),
                            size: 16,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              apiResponseDetails,
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 24),

                  // Fee Calculation Section - Only show if showFeeSection is true
                  if (showFeeSection) ...[
                    const SectionHeader(title: 'Fee Calculation'),
                    const SizedBox(height: 20),
                    isLoading
                        ? const Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Color(0xFF15A66E),
                            ),
                          ),
                        )
                        : FeeCalculationContainer(
                          durationText: durationText,
                          usageFee: usageFee,
                          bookingFee: bookingFee,
                          totalFee: totalFee,
                          totalFeeStyle: const TextStyle(
                            color: Colors.white, // Change color to white
                            fontWeight: FontWeight.bold, // Make it bold
                          ),
                        ),
                    const SizedBox(height: 30),

                    // Buttons Row
                    Row(
                      children: [
                        // Cancel Button
                        Expanded(
                          child: GradientButton(
                            text: 'Cancel',
                            onPressed: _resetValues,
                            gradientColors: [
                              Colors.grey.shade800,
                              Colors.grey.shade700,
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        // Confirm Button
                        Expanded(
                          child: GradientButton(
                            text:
                                isLoading ? 'Processing...' : 'Confirm Booking',
                            onPressed:
                                isLoading
                                    ? () {}
                                    : () => _processBooking(context),
                            gradientColors: [accentColor, highlightColor],
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 0, // Set appropriate index based on navigation
        onTap: (index) {
          // Handle navigation based on index
          switch (index) {
            case 0:
              Navigator.pushReplacementNamed(context, '/dashboard');
              break;
            case 1:
              // Search functionality
              break;
            case 2:
              Navigator.pushReplacementNamed(context, '/enter-parking');
              break;
            case 3:
              // Saved functionality
              break;
            case 4:
              Navigator.pushReplacementNamed(context, '/profile');
              break;
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
