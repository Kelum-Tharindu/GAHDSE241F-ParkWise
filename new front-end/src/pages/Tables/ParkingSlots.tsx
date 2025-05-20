import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/uiMy/table";
import axios from "axios";

// Interface matching what the backend returns
interface ParkingResponse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: {
    street: string;
    city: string;
  };
  slotDetails: {
    car: {
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    bicycle: {
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    truck: {
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
  };
}

// Interface for our component's internal use - for selected parking details
interface ParkingDetails {
  id: string;
  name: string;
  ownerId: string;
  slotDetails: {
    car: {
      totalSlot: number;
      bookingSlot: number;
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    bicycle: {
      totalSlot: number;
      bookingSlot: number;
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    truck: {
      totalSlot: number;
      bookingSlot: number;
      availableSlot: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    address: {
      No: string;
      street: string;
      city: string;
      province: string;
      country: string;
      postalCode: string;
    };
  };
  qrCode: string;
}

export default function ParkingTable() {
  const [parkingData, setParkingData] = useState<ParkingResponse[]>([]);
  const [selectedParking, setSelectedParking] = useState<ParkingDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/parking/all');
      setParkingData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching parking data:', error);
      setError('Failed to load parking data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (parking: ParkingResponse) => {
    try {
      // Fetch full details using the parking id 
      const response = await axios.get(`http://localhost:5000/parking/${parking.id}`);
      
      // Transform the detailed data to match our format if needed
      const detailedParking = response.data;
      
      setSelectedParking({
        id: detailedParking._id || detailedParking.id,
        name: detailedParking.name,
        ownerId: detailedParking.ownerId || "N/A",
        slotDetails: detailedParking.slotDetails,
        location: detailedParking.location,
        qrCode: detailedParking.qrCode || ""
      });
      
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching parking details:', error);
      alert('Failed to load detailed parking information. Please try again.');
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedParking(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Parking Slots Details | ParkWise"
        description="View and manage parking slots details"
      />
      <PageBreadcrumb pageTitle="Parkings and Parkings' slots details" />
      <div className="space-y-6">
        <ComponentCard title="Parkings">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Parking Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Location
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Available Car Slots
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Available Bicycle Slots
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Available Truck Slots
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parkingData.map((parking) => (
                  <TableRow key={parking.id}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                      {parking.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.address?.street}, {parking.address?.city}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails?.car?.availableSlot || 0}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails?.bicycle?.availableSlot || 0}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails?.truck?.availableSlot || 0}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleViewDetails(parking)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ComponentCard>
      </div>

      {/* Details Modal */}
      {showDetails && selectedParking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {selectedParking.name} - Detailed Information
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Parking Name</p>
                    <p className="text-gray-800 dark:text-white">{selectedParking.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner ID</p>
                    <p className="text-gray-800 dark:text-white">{selectedParking.ownerId}</p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Location Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coordinates</p>
                    <p className="text-gray-800 dark:text-white">
                      {selectedParking.location?.latitude}, {selectedParking.location?.longitude}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Address</p>
                    <p className="text-gray-800 dark:text-white">
                      {selectedParking.location?.address?.No}, {selectedParking.location?.address?.street}<br />
                      {selectedParking.location?.address?.city}, {selectedParking.location?.address?.province}<br />
                      {selectedParking.location?.address?.country} - {selectedParking.location?.address?.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Slot Details */}
              <div className="space-y-4">
                {/* Car Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Car Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.totalSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booked Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.bookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.availableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                      <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails?.car?.perPrice30Min || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                      <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails?.car?.perDayPrice || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Bicycle Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Bicycle Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.totalSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booked Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.bookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.availableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                      <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails?.bicycle?.perPrice30Min || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                      <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails?.bicycle?.perDayPrice || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Truck Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Truck Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.totalSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booked Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.bookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.availableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                      <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails?.truck?.perPrice30Min || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                      <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails?.truck?.perDayPrice || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              {selectedParking.qrCode && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">QR Code</h3>
                  <div className="flex flex-col items-center space-y-4">
                    <img 
                      src={selectedParking.qrCode} 
                      alt="Parking QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                    <a
                      href={selectedParking.qrCode}
                      download={`${selectedParking.name}-qr.png`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download QR Code
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
