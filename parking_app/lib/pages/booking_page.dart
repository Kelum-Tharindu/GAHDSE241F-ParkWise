import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:parking_app/widgets/booking_details_form.dart';
import '../widgets/glassmorphic_app_bar.dart';
import '../widgets/section_header.dart';
import '../widgets/gradient_button.dart';
import '../widgets/fee_row.dart';
import 'booking_preview.dart';

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
  double bookingFee = 5.0;
  double totalFee = 0.0;
  String durationText = '0h 0m';

  DateTime? entryTime;
  DateTime? exitTime;

  final List<String> vehicleTypes = ['car', 'bicycle', 'truck'];
  final Map<String, double> ratesPerHalfHour = {
    'car': 2.0,
    'bicycle': 1.0,
    'truck': 3.5,
  };

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    entryTime = now;
    entryTimeController.text = DateFormat('yyyy-MM-dd HH:mm').format(now);

    final later = now.add(const Duration(hours: 1));
    exitTime = later;
    exitTimeController.text = DateFormat('yyyy-MM-dd HH:mm').format(later);

    _updateCalculations();

    entryTimeController.addListener(_updateCalculations);
    exitTimeController.addListener(_updateCalculations);
  }

  @override
  void dispose() {
    parkingNameController.dispose();
    entryTimeController.dispose();
    exitTimeController.dispose();
    super.dispose();
  }

  void _updateCalculations() {
    if (entryTimeController.text.isNotEmpty &&
        exitTimeController.text.isNotEmpty) {
      try {
        entryTime = DateFormat(
          'yyyy-MM-dd HH:mm',
        ).parse(entryTimeController.text);
        exitTime = DateFormat(
          'yyyy-MM-dd HH:mm',
        ).parse(exitTimeController.text);

        if (exitTime!.isAfter(entryTime!)) {
          final duration = exitTime!.difference(entryTime!);
          final hours = duration.inHours;
          final minutes = duration.inMinutes % 60;
          durationText = '${hours}h ${minutes}m';

          final halfHours = (duration.inMinutes / 30).ceil();
          usageFee = halfHours * ratesPerHalfHour[vehicleType]!;
          totalFee = usageFee + bookingFee;

          if (mounted) {
            setState(() {});
          }
        }
      } catch (e) {
        debugPrint('Error parsing dates: $e');
      }
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
          if (combinedDateTime.isBefore(entryTime!)) {
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
      showDialog(
        context: context,
        barrierDismissible: false,
        builder:
            (_) => const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF15A66E)),
              ),
            ),
      );

      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      Navigator.of(context).pop(); // close loading

      if (!mounted) return;

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
                      if (newValue != null) {
                        setState(() {
                          vehicleType = newValue;
                          _updateCalculations();
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
                  const SectionHeader(title: 'Fee Calculation'),
                  const SizedBox(height: 20),
                  FeeCalculationContainer(
                    durationText: durationText,
                    usageFee: usageFee,
                    bookingFee: bookingFee,
                    totalFee: totalFee,
                  ),
                  const SizedBox(height: 30),
                  GradientButton(
                    text: 'Confirm Booking',
                    onPressed: () => _processBooking(context),
                    gradientColors: [accentColor, highlightColor],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
