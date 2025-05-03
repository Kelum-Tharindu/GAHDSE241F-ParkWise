import 'package:flutter/material.dart';
import 'package:parking_app/widgets/glassmorphic_container.dart';

class FeeRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isTotal;

  const FeeRow({
    super.key,
    required this.label,
    required this.value,
    this.isTotal = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 18 : 16,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: Colors.white,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: isTotal ? 18 : 16,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

class FeeCalculationContainer extends StatelessWidget {
  final String durationText;
  final double usageFee;
  final double bookingFee;
  final double totalFee;

  const FeeCalculationContainer({
    super.key,
    required this.durationText,
    required this.usageFee,
    required this.bookingFee,
    required this.totalFee,
    required TextStyle totalFeeStyle,
  });

  @override
  Widget build(BuildContext context) {
    return GlassmorphicContainer(
      height: 200, // Explicit height
      gradientColors: const [Color(0xFF025939), Color(0xFF15A66E)],
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            FeeRow(label: 'Duration', value: durationText),
            FeeRow(
              label: 'Usage Fee',
              value: '\$${usageFee.toStringAsFixed(2)}',
            ),
            FeeRow(
              label: 'Booking Fee',
              value: '\$${bookingFee.toStringAsFixed(2)}',
            ),
            const Divider(color: Colors.white30),
            FeeRow(
              label: 'Total Fee',
              value: '\$${totalFee.toStringAsFixed(2)}',
              isTotal: true,
            ),
          ],
        ),
      ),
    );
  }
}
