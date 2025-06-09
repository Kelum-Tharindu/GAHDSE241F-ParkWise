# Frontend Parking API Documentation

This document outlines the new frontend-focused parking API endpoint that provides parking location data without sensitive information like QR codes and owner IDs.

## Endpoint

```
GET /parking/frontend
```

This endpoint returns a list of all parking locations with only the information needed for the frontend applications, improving security and performance.

## Response Format

The API returns a JSON array of parking location objects with the following structure:

```json
[
  {
    "id": "654321abcdef",
    "name": "Central Parking",
    "slotDetails": {
      "car": {
        "totalSlot": 100,
        "bookingSlot": 80,
        "bookingAvailableSlot": 45,
        "withoutBookingSlot": 20,
        "withoutBookingAvailableSlot": 10,
        "perPrice30Min": 50,
        "perDayPrice": 500
      },
      "bicycle": {
        "totalSlot": 50,
        "bookingSlot": 40,
        "bookingAvailableSlot": 30,
        "withoutBookingSlot": 10,
        "withoutBookingAvailableSlot": 5,
        "perPrice30Min": 20,
        "perDayPrice": 200
      },
      "truck": {
        "totalSlot": 30,
        "bookingSlot": 25,
        "bookingAvailableSlot": 15,
        "withoutBookingSlot": 5,
        "withoutBookingAvailableSlot": 2,
        "perPrice30Min": 100,
        "perDayPrice": 1000
      }
    },
    "location": {
      "latitude": 6.9271,
      "longitude": 79.8612,
      "address": {
        "street": "Main Street",
        "city": "Colombo",
        "province": "Western",
        "country": "Sri Lanka"
      }
    }
  }
]
```

## Usage in React (TypeScript)

To use this API in a React application:

1. Add the `parkingService.ts` file to your services folder
2. Import and use the service in your components:

```typescript
import React, { useEffect, useState } from 'react';
import { parkingService, ParkingData } from '../services/parkingService';

const ParkingDisplay: React.FC = () => {
  const [parkingData, setParkingData] = useState<ParkingData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await parkingService.getAllParkingForFrontend();
        setParkingData(data);
      } catch (error) {
        console.error('Failed to fetch parking data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Parking Locations</h1>
      {parkingData.map(parking => (
        <div key={parking.id}>
          <h2>{parking.name}</h2>
          <p>Available Car Slots: {parking.slotDetails.car.bookingAvailableSlot}</p>
          <p>Location: {parking.location.address.city}</p>
        </div>
      ))}
    </div>
  );
};
```

## Usage in Flutter

To use this API in a Flutter application:

1. Add the `enhanced_parking_service.dart` file to your services folder
2. Use the service in your widgets:

```dart
import 'package:flutter/material.dart';
import 'package:your_app/services/enhanced_parking_service.dart';

class ParkingLocationsPage extends StatefulWidget {
  const ParkingLocationsPage({Key? key}) : super(key: key);

  @override
  _ParkingLocationsPageState createState() => _ParkingLocationsPageState();
}

class _ParkingLocationsPageState extends State<ParkingLocationsPage> {
  final ParkingService _parkingService = ParkingService();
  List<Map<String, dynamic>> _parkingLocations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadParkingLocations();
  }

  Future<void> _loadParkingLocations() async {
    try {
      final locations = await _parkingService.getAllParkingLocations();
      setState(() {
        _parkingLocations = locations;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading parking locations: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Parking Locations'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _parkingLocations.length,
              itemBuilder: (context, index) {
                final parking = _parkingLocations[index];
                return ListTile(
                  title: Text(parking['name']),
                  subtitle: Text('${parking['address']['street']}, ${parking['address']['city']}'),
                  trailing: Text('Available: ${parking['slotDetails']['car']['availableSlot']}'),
                );
              },
            ),
    );
  }
}
```

## Benefits

1. **Security**: Removes sensitive information like QR codes and owner IDs
2. **Performance**: Reduces payload size by only sending necessary data
3. **Consistency**: Provides a standardized format for all frontend applications
4. **Logging**: Includes console logs for request and response tracking
