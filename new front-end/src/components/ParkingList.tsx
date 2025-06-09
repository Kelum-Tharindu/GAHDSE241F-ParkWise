import React, { useEffect, useState } from 'react';
import { parkingService, ParkingData } from '../services/parkingService';

const ParkingList: React.FC = () => {
  const [parkingLocations, setParkingLocations] = useState<ParkingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkingLocations = async () => {
      try {
        setLoading(true);
        console.log('Fetching parking locations...');
        const data = await parkingService.getAllParkingForFrontend();
        setParkingLocations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching parking locations:', err);
        setError('Failed to load parking locations. Please try again later.');
        setParkingLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLocations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parking locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (parkingLocations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-5xl mb-4">🅿️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Parking Locations</h2>
          <p className="text-gray-600">There are no parking locations available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Parking Locations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingLocations.map((parking) => (
          <div key={parking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <h2 className="text-xl font-semibold">{parking.name}</h2>
              <p className="text-sm opacity-90">
                {parking.location.address.street}, {parking.location.address.city}
              </p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-700 mb-2">Available Slots</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cars:</span>
                  <span className="font-medium">{parking.slotDetails.car.bookingAvailableSlot} / {parking.slotDetails.car.bookingSlot}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bicycles:</span>
                  <span className="font-medium">{parking.slotDetails.bicycle.bookingAvailableSlot} / {parking.slotDetails.bicycle.bookingSlot}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trucks:</span>
                  <span className="font-medium">{parking.slotDetails.truck.bookingAvailableSlot} / {parking.slotDetails.truck.bookingSlot}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-gray-700 mb-2">Pricing (Car)</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">30 Minutes:</span>
                  <span className="font-medium">Rs. {parking.slotDetails.car.perPrice30Min}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Per Day:</span>
                  <span className="font-medium">Rs. {parking.slotDetails.car.perDayPrice}</span>
                </div>
              </div>
              
              <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList;
