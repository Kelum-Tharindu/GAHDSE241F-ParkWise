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

interface ParkingDetails {
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

export default function ParkingTable() {
  const [parkingData, setParkingData] = useState<ParkingDetails[]>([]);
  const [selectedParking, setSelectedParking] = useState<ParkingDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/parking/all');
      setParkingData(response.data);
    } catch (error) {
      console.error('Error fetching parking data:', error);
    }
  };

  const handleViewDetails = (parking: ParkingDetails) => {
    setSelectedParking(parking);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedParking(null);
  };

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
                      {parking.address.street}, {parking.address.city}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails.car.availableSlot}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails.bicycle.availableSlot}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails.truck.availableSlot}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
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
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedParking.address.street}, {selectedParking.address.city}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Coordinates: {selectedParking.latitude}, {selectedParking.longitude}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Car Slots</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
                    <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails.car.availableSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                    <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails.car.perPrice30Min}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                    <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails.car.perDayPrice}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Bicycle Slots</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
                    <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails.bicycle.availableSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                    <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails.bicycle.perPrice30Min}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                    <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails.bicycle.perDayPrice}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Truck Slots</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
                    <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails.truck.availableSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                    <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails.truck.perPrice30Min}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                    <p className="text-gray-800 dark:text-white">Rs. {selectedParking.slotDetails.truck.perDayPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
