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
import 'dart:io';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';

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

  final List<String> vehicleTypes = ['car', 'bicycle', 'truck'];

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    entryTime = now;
    entryTimeController.text = DateFormat('yyyy-MM-dd HH:mm').format(now);

    final later = now.add(const Duration(hours: 1));
    exitTime = later;
    exitTimeController.text = DateFormat('yyyy-MM-dd HH:mm').format(later);
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
      if (entryTimeController.text.isNotEmpty) {
        entryTime = DateFormat(
          'yyyy-MM-dd HH:mm',
        ).parse(entryTimeController.text);
      }

      if (exitTimeController.text.isNotEmpty) {
        exitTime = DateFormat(
          'yyyy-MM-dd HH:mm',
        ).parse(exitTimeController.text);
      }

      if (kDebugMode) {
        print('Sending to backend:');
        print('Parking Name: ${parkingNameController.text}');
        print('Vehicle Type: $vehicleType');
        print('Entry Time: $entryTime');
        print('Exit Time: $exitTime');
      }

      final feeDetails = await BookingService.calculateFees(
        parkingName: parkingNameController.text,
        vehicleType: vehicleType,
        entryTime: entryTime,
        exitTime: exitTime,
      );

      if (kDebugMode) {
        print('Received from backend: $feeDetails');
      }

      if (mounted) {
        setState(() {
          usageFee = (feeDetails['usageFee'] as num).toDouble();
          bookingFee = (feeDetails['bookingFee'] as num).toDouble();
          totalFee = (feeDetails['totalFee'] as num).toDouble();
          durationText = feeDetails['totalDuration'] as String;
          isLoading = false;
          showFeeSection = true;
          apiResponseDetails = 'API Response Success: Received fee details';
        });
      }
    } catch (e) {
      debugPrint('Error fetching fee details: $e');
      if (mounted) {
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

  Future<void> _viewApiLogs() async {
    try {
      final logs = await BookingService.getApiLogs();

      if (!mounted) return;

      showDialog(
        context: context,
        builder:
            (context) => AlertDialog(
              title: const Text('API Logs'),
              content: SingleChildScrollView(child: Text(logs)),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Close'),
                ),
                TextButton(
                  onPressed: () async {
                    final tempDir = await getTemporaryDirectory();
                    final file = File('${tempDir.path}/api_logs.txt');
                    await file.writeAsString(logs);

                    await Share.shareXFiles([
                      XFile(file.path),
                    ], text: 'Parking App API Logs');
                  },
                  child: const Text('Share'),
                ),
                TextButton(
                  onPressed: () async {
                    await BookingService.clearApiLogs();
                    if (!mounted) return;
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('API logs cleared')),
                    );
                  },
                  child: const Text('Clear Logs'),
                ),
              ],
            ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error viewing logs: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
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

  void _processBooking(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      setState(() {
        isLoading = true;
        apiResponseDetails = 'Sending booking confirmation request...';
      });

      Future.delayed(Duration.zero, () async {
        try {
          if (!mounted) return;

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
                    parkingName: parkingNameController.text,
                    vehicleType: vehicleType,
                    entryTime: entryTime!,
                    exitTime: exitTime!,
                    usageFee: usageFee,
                    bookingFee: bookingFee,
                    totalFee: totalFee,
                    duration: durationText,
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
      });
    }
  }

  void _calculateFee() {
    if (_formKey.currentState!.validate()) {
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
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: _viewApiLogs,
            tooltip: 'View API Logs',
          ),
        ],
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
    );
  }
}
