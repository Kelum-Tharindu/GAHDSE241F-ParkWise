import 'package:flutter/material.dart';
import 'glassmorphic_container.dart';

class BookingDetailsForm extends StatelessWidget {
  final TextEditingController parkingNameController;
  final TextEditingController entryTimeController;
  final TextEditingController exitTimeController;
  final String vehicleType;
  final List<String> vehicleTypes;
  final Function(String?) onVehicleTypeChanged;
  final Future<void> Function(BuildContext, TextEditingController)
  selectDateTime;
  final String? Function(String?) validateParkingName;
  final String? Function(String?) validateVehicleType;
  final String? Function(String?) validateEntryTime;
  final String? Function(String?) validateExitTime;

  const BookingDetailsForm({
    super.key,
    required this.parkingNameController,
    required this.entryTimeController,
    required this.exitTimeController,
    required this.vehicleType,
    required this.vehicleTypes,
    required this.onVehicleTypeChanged,
    required this.selectDateTime,
    required this.validateParkingName,
    required this.validateVehicleType,
    required this.validateEntryTime,
    required this.validateExitTime,
  });

  @override
  Widget build(BuildContext context) {
    return GlassmorphicContainer(
      height: 320, // Explicit height
      gradientColors: const [Color(0xFF013220), Color(0xFF025939)],
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextFormField(
              controller: parkingNameController,
              decoration: const InputDecoration(
                labelText: 'Parking Name',
                prefixIcon: Icon(Icons.local_parking),
                border: OutlineInputBorder(),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.white24),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Color(0xFF15A66E)),
                ),
                errorBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.red),
                ),
              ),
              validator: validateParkingName,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: vehicleType,
              decoration: const InputDecoration(
                labelText: 'Vehicle Type',
                prefixIcon: Icon(Icons.directions_car),
                border: OutlineInputBorder(),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.white24),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Color(0xFF15A66E)),
                ),
                errorBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.red),
                ),
              ),
              items:
                  vehicleTypes.map((String type) {
                    return DropdownMenuItem<String>(
                      value: type,
                      child: Text(type.toUpperCase()),
                    );
                  }).toList(),
              onChanged: onVehicleTypeChanged,
              validator: validateVehicleType,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: entryTimeController,
              decoration: InputDecoration(
                labelText: 'Entry Time',
                prefixIcon: const Icon(Icons.access_time),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () => selectDateTime(context, entryTimeController),
                ),
                border: const OutlineInputBorder(),
                enabledBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.white24),
                ),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: Color(0xFF15A66E)),
                ),
                errorBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.red),
                ),
              ),
              readOnly: true,
              validator: validateEntryTime,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: exitTimeController,
              decoration: InputDecoration(
                labelText: 'Exit Time',
                prefixIcon: const Icon(Icons.access_time),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () => selectDateTime(context, exitTimeController),
                ),
                border: const OutlineInputBorder(),
                enabledBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.white24),
                ),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: Color(0xFF15A66E)),
                ),
                errorBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.red),
                ),
              ),
              readOnly: true,
              validator: validateExitTime,
            ),
          ],
        ),
      ),
    );
  }
}
