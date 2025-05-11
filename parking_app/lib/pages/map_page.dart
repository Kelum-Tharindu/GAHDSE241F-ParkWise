import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:parking_app/widgets/glassmorphic_bottom_nav_bar.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  GoogleMapController? _mapController;
  final Location _location = Location();
  LatLng _currentPosition = const LatLng(0, 0);
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    try {
      LocationData locationData = await _location.getLocation();
      if (locationData.latitude != null && locationData.longitude != null) {
        setState(() {
          _currentPosition = LatLng(
            locationData.latitude!,
            locationData.longitude!,
          );
          _isLoading = false;
        });

        _mapController?.animateCamera(
          CameraUpdate.newCameraPosition(
            CameraPosition(target: _currentPosition, zoom: 15),
          ),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).colorScheme.primary;
    final backgroundColor = Theme.of(context).colorScheme.surface;

    return Scaffold(
      body: Stack(
        children: [
          // Map
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: _currentPosition,
                  zoom: 15,
                ),
                onMapCreated: (controller) => _mapController = controller,
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
                mapType: MapType.normal,
                mapToolbarEnabled: false,
              ),

          // Custom App Bar
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
                    primaryColor.withAlpha(230),
                    primaryColor.withAlpha(0),
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: backgroundColor.withAlpha(100),
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
                  Text(
                    'Parking Map',
                    style: TextStyle(
                      color: backgroundColor,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Map Controls
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

          // Bottom Info Card
          Positioned(
            left: 16,
            right: 16,
            bottom: 16,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: backgroundColor,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(26),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: primaryColor.withAlpha(26),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.local_parking,
                      color: primaryColor,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Nearest Parking',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tap to view parking details',
                          style: TextStyle(
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurface.withAlpha(179),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.arrow_forward_ios, color: primaryColor),
                    onPressed: () {
                      Navigator.pushReplacementNamed(
                        context,
                        '/nearest-parking',
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: GlassmorphicBottomNavBar(
        currentIndex: 1, // Search tab
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
                // Saved functionality
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
    final primaryColor = Theme.of(context).colorScheme.primary;
    final backgroundColor = Theme.of(context).colorScheme.surface;

    return Container(
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(26),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onPressed,
          child: Container(
            padding: const EdgeInsets.all(12),
            child: Icon(icon, color: primaryColor),
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
