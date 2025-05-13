import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:parking_app/models/parking_location.dart';
import 'package:parking_app/services/parking_service.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';
import 'package:parking_app/widgets/parking_info_card.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  GoogleMapController? _mapController;
  final Location _location = Location();
  final Set<Marker> _markers = {};
  final List<ParkingLocation> _parkingLocations = [];
  final ParkingService _parkingService = ParkingService();
  ParkingLocation? _selectedParking;
  LatLng _currentLocation = const LatLng(0, 0);
  CameraPosition _initialCameraPosition = const CameraPosition(
    target: LatLng(0, 0),
    zoom: 15,
  );
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeMap();
  }

  Future<void> _initializeMap() async {
    await Future.wait([_getCurrentLocation(), _loadParkingLocations()]);
  }

  Future<void> _loadParkingLocations() async {
    try {
      final locations = await _parkingService.getAllParkingLocations();
      if (!mounted) return;

      setState(() {
        _parkingLocations.clear();
        _parkingLocations.addAll(
          locations.map((data) => ParkingLocation.fromJson(data)).toList(),
        );
        _updateMarkers();
      });
    } catch (e) {
      if (kDebugMode) {
        print('Error loading parking locations: $e');
      }
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      final location = await _location.getLocation();
      if (!mounted) return;

      setState(() {
        _currentLocation = LatLng(location.latitude!, location.longitude!);
        _initialCameraPosition = CameraPosition(
          target: _currentLocation,
          zoom: 15,
        );
        _isLoading = false;
      });
      _updateMarkers();
    } catch (e) {
      if (kDebugMode) {
        print('Error getting location: $e');
      }
      if (!mounted) return;
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _updateMarkers() {
    if (!mounted) return;

    final Set<Marker> newMarkers = {};

    // Add current location marker
    newMarkers.add(
      Marker(
        markerId: const MarkerId('current_location'),
        position: _currentLocation,
        infoWindow: const InfoWindow(title: 'Your Location'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
      ),
    );

    // Add parking location markers
    for (var parking in _parkingLocations) {
      newMarkers.add(
        Marker(
          markerId: MarkerId(parking.id),
          position: LatLng(parking.latitude, parking.longitude),
          infoWindow: InfoWindow(
            title: parking.name,
            snippet: '''
${parking.address.street}, ${parking.address.city}
Available Car Slots: ${parking.slotDetails.car.availableSlot}
Price: Rs.${parking.slotDetails.car.perPrice30Min}/30min
            ''',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueGreen,
          ),
          onTap: () {
            if (mounted) {
              setState(() {
                _selectedParking = parking;
              });
            }
          },
        ),
      );
    }

    if (mounted) {
      setState(() {
        _markers.clear();
        _markers.addAll(newMarkers);
      });
    }

    // Update camera bounds to show all markers
    if (_mapController != null && _markers.isNotEmpty) {
      _updateCameraBounds();
    }
  }

  void _updateCameraBounds() {
    if (_markers.isEmpty) return;

    double minLat = _markers.first.position.latitude;
    double maxLat = _markers.first.position.latitude;
    double minLng = _markers.first.position.longitude;
    double maxLng = _markers.first.position.longitude;

    for (var marker in _markers) {
      if (marker.position.latitude < minLat) minLat = marker.position.latitude;
      if (marker.position.latitude > maxLat) maxLat = marker.position.latitude;
      if (marker.position.longitude < minLng) {
        minLng = marker.position.longitude;
      }
      if (marker.position.longitude > maxLng) {
        maxLng = marker.position.longitude;
      }
    }

    _mapController?.animateCamera(
      CameraUpdate.newLatLngBounds(
        LatLngBounds(
          southwest: LatLng(minLat, minLng),
          northeast: LatLng(maxLat, maxLng),
        ),
        50,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).colorScheme.primary;

    return Scaffold(
      body: Stack(
        children: [
          if (_isLoading)
            const Center(child: CircularProgressIndicator())
          else
            GoogleMap(
              initialCameraPosition: _initialCameraPosition,
              onMapCreated: (controller) {
                _mapController = controller;
                _updateCameraBounds();
              },
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
              zoomControlsEnabled: false,
              mapType: MapType.normal,
              mapToolbarEnabled: false,
              markers: _markers,
              onTap: (_) {
                if (_selectedParking != null) {
                  setState(() => _selectedParking = null);
                }
              },
            ),

          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 10,
                left: 16,
                right: 16,
                bottom: 16,
              ),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    const Color(0xFF013220).withAlpha(200),
                    const Color(0xFF013220).withAlpha(160),
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(50),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed:
                          () => Navigator.pushReplacementNamed(
                            context,
                            '/dashboard',
                          ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Parking Map',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          Positioned(
            right: 16,
            bottom: 100,
            child: Column(
              children: [
                _buildMapControlButton(
                  icon: Icons.my_location,
                  onPressed: _getCurrentLocation,
                ),
                const SizedBox(height: 12),
                _buildMapControlButton(
                  icon: Icons.add,
                  onPressed: () {
                    _mapController?.animateCamera(CameraUpdate.zoomIn());
                  },
                ),
                const SizedBox(height: 12),
                _buildMapControlButton(
                  icon: Icons.remove,
                  onPressed: () {
                    _mapController?.animateCamera(CameraUpdate.zoomOut());
                  },
                ),
              ],
            ),
          ),

          if (_selectedParking != null)
            Positioned(
              left: 16,
              right: 16,
              bottom: 16,
              child: ParkingInfoCard(
                selectedParking: _selectedParking,
                onClose: () => setState(() => _selectedParking = null),
                onBookNow: (parking) {
                  Navigator.pushNamed(context, '/bookingPage');
                },
                currentLocation: _currentLocation,
              ),
            ),
        ],
      ),
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 1,
        onTap: (index) {
          if (index != 1) {
            switch (index) {
              case 0:
                Navigator.pushReplacementNamed(context, '/dashboard');
                break;
              case 2:
                Navigator.pushReplacementNamed(context, '/enter-parking');
                break;
              case 3:
                // Saved
                break;
              case 4:
                Navigator.pushReplacementNamed(context, '/profile');
                break;
            }
          }
        },
        primaryColor: primaryColor,
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

  Widget _buildMapControlButton({
    required IconData icon,
    required VoidCallback onPressed,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF013220).withAlpha(200),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(50), width: 1),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onPressed,
          child: Container(
            padding: const EdgeInsets.all(12),
            child: Icon(icon, color: Colors.white),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }
}
