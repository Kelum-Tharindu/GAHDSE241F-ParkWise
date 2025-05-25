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

// Interface for backend response
interface BackendParkingResponse {
  _id: string;
  id?: string;
  name: string;
  ownerId: string;
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
  slotDetails: {
    car: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    bicycle: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    truck: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
  };
  qrCode?: string;
}

// Interface for frontend use
interface ParkingResponse {
  id: string;
  name: string;
  ownerId: string;
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
  slotDetails: {
    car: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    bicycle: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    truck: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
  };
  qrCode?: string;
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
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    bicycle: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
      perPrice30Min: number;
      perDayPrice: number;
    };
    truck: {
      totalSlot: number;
      bookingSlot: number;
      bookingAvailableSlot?: number;
      withoutBookingSlot: number;
      withoutBookingAvailableSlot?: number;
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
  qrCode?: string;
}

interface Landowner {
  _id: string;
  username: string;
  email: string;
}

export default function ParkingTable() {
  const [parkingData, setParkingData] = useState<ParkingResponse[]>([]);
  const [selectedParking, setSelectedParking] = useState<ParkingDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landowners, setLandowners] = useState<Landowner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [updateForm, setUpdateForm] = useState({
    name: '',
    slotDetails: {
      car: {
        totalSlot: 0,
        bookingSlot: 0,
        bookingAvailableSlot: 0,
        withoutBookingSlot: 0,
        withoutBookingAvailableSlot: 0,
        perPrice30Min: 0,
        perDayPrice: 0
      },
      bicycle: {
        totalSlot: 0,
        bookingSlot: 0,
        bookingAvailableSlot: 0,
        withoutBookingSlot: 0,
        withoutBookingAvailableSlot: 0,
        perPrice30Min: 0,
        perDayPrice: 0
      },
      truck: {
        totalSlot: 0,
        bookingSlot: 0,
        bookingAvailableSlot: 0,
        withoutBookingSlot: 0,
        withoutBookingAvailableSlot: 0,
        perPrice30Min: 0,
        perDayPrice: 0
      }
    },
    location: {
      latitude: 0,
      longitude: 0,
      address: {
        No: '',
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: ''
      }
    }
  });
  const [addForm, setAddForm] = useState({
    name: '',
    ownerId: '',
    slotDetails: {
      car: {
        totalSlot: 0,
        bookingSlot: 0,
        bookingAvailableSlot: 0,
        withoutBookingSlot: 0,
        withoutBookingAvailableSlot: 0,
        perPrice30Min: 0,
        perDayPrice: 0
      },
      bicycle: {
        totalSlot: 0,
        bookingSlot: 0,
        bookingAvailableSlot: 0,
        withoutBookingSlot: 0,
        withoutBookingAvailableSlot: 0,
        perPrice30Min: 0,
        perDayPrice: 0
      },
      truck: {
        totalSlot: 0,
        bookingSlot: 0,
        bookingAvailableSlot: 0,
        withoutBookingSlot: 0,
        withoutBookingAvailableSlot: 0,
        perPrice30Min: 0,
        perDayPrice: 0
      }
    },
    location: {
      latitude: 0,
      longitude: 0,
      address: {
        No: '',
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: ''
      }
    }
  });

  // Add validation function for slots

  // Add handler for slot updates
  // Only allow updating totalSlot, bookingSlot, withoutBookingSlot, perPrice30Min, perDayPrice
  const handleSlotUpdate = (
    vehicleType: 'car' | 'bicycle' | 'truck',
    field: 'totalSlot' | 'bookingSlot' | 'withoutBookingSlot' | 'perPrice30Min' | 'perDayPrice',
    value: number
  ) => {
    const newValue = Math.max(0, value); // Ensure non-negative values
    setUpdateForm(prev => {
      const newForm = { ...prev };
      const vehicleSlots = newForm.slotDetails[vehicleType];
      vehicleSlots[field] = newValue;
      // If updating total slots, ensure booking and withoutSlots For booking don't exceed total
      if (field === 'totalSlot') {
        vehicleSlots.bookingSlot = Math.min(vehicleSlots.bookingSlot, newValue);
        vehicleSlots.withoutBookingSlot = Math.min(vehicleSlots.withoutBookingSlot, newValue);
      }
      // If updating Slots For booking, adjust withoutBookingSlot
      if (field === 'bookingSlot') {
        vehicleSlots.withoutBookingSlot = Math.min(vehicleSlots.totalSlot - newValue, vehicleSlots.withoutBookingSlot);
      }
      // If updating withoutBookingSlot, adjust bookingSlot
      if (field === 'withoutBookingSlot') {
        vehicleSlots.bookingSlot = Math.min(vehicleSlots.totalSlot - newValue, vehicleSlots.bookingSlot);
      }
      return newForm;
    });
  };

  useEffect(() => {
    fetchParkingData();
    fetchLandowners();
  }, []);

  const fetchParkingData = async () => {
    try {
      setLoading(true);
      console.log('Fetching parking data...');
      
      const response = await axios.get<BackendParkingResponse[]>('http://localhost:5000/parking/all');
      console.log('Raw API response:', response.data);
      
      // Transform the data to match our interface
      const transformedData: ParkingResponse[] = response.data.map((parking: BackendParkingResponse) => {
        const location = parking.location || {};
        const address = location.address || {};
        const slotDetails = parking.slotDetails || {};
        const carSlots = slotDetails.car || {};
        const bicycleSlots = slotDetails.bicycle || {};
        const truckSlots = slotDetails.truck || {};

        return {
          id: parking._id || parking.id || '',
          name: parking.name || '',
          ownerId: parking.ownerId || '',
          location: {
            latitude: location.latitude || 0,
            longitude: location.longitude || 0,
            address: {
              No: address.No || '',
              street: address.street || '',
              city: address.city || '',
              province: address.province || '',
              country: address.country || '',
              postalCode: address.postalCode || ''
            }
          },
          slotDetails: {
            car: {
              totalSlot: carSlots.totalSlot || 0,
              bookingSlot: carSlots.bookingSlot || 0,
              bookingAvailableSlot: carSlots.bookingAvailableSlot || 0,
              withoutBookingSlot: carSlots.withoutBookingSlot || 0,
              withoutBookingAvailableSlot: carSlots.withoutBookingAvailableSlot || 0,
              perPrice30Min: carSlots.perPrice30Min || 0,
              perDayPrice: carSlots.perDayPrice || 0
            },
            bicycle: {
              totalSlot: bicycleSlots.totalSlot || 0,
              bookingSlot: bicycleSlots.bookingSlot || 0,
              bookingAvailableSlot: bicycleSlots.bookingAvailableSlot || 0,
              withoutBookingSlot: bicycleSlots.withoutBookingSlot || 0,
              withoutBookingAvailableSlot: bicycleSlots.withoutBookingAvailableSlot || 0,
              perPrice30Min: bicycleSlots.perPrice30Min || 0,
              perDayPrice: bicycleSlots.perDayPrice || 0
            },
            truck: {
              totalSlot: truckSlots.totalSlot || 0,
              bookingSlot: truckSlots.bookingSlot || 0,
              bookingAvailableSlot: truckSlots.bookingAvailableSlot || 0,
              withoutBookingSlot: truckSlots.withoutBookingSlot || 0,
              withoutBookingAvailableSlot: truckSlots.withoutBookingAvailableSlot || 0,
              perPrice30Min: truckSlots.perPrice30Min || 0,
              perDayPrice: truckSlots.perDayPrice || 0
            }
          },
          qrCode: parking.qrCode || ''
        };
      });

      console.log('Final transformed data:', transformedData);
      setParkingData(transformedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching parking data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      setError('Failed to load parking data. Please try again later.');
      setParkingData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchLandowners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/landowners/all');
      setLandowners(response.data);
    } catch (error) {
      console.error('Error fetching landowners:', error);
      alert('Failed to load landowners. Please try again.');
    }
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedOwner(selectedId);
    setAddForm(prev => ({
      ...prev,
      ownerId: selectedId
    }));
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

  const handleUpdateClick = async (parking: ParkingResponse) => {
    try {
      // Fetch full details using the parking id 
      const response = await axios.get(`http://localhost:5000/parking/${parking.id}`);
      const detailedParking = response.data;
      
      // Set the selected parking for reference
      setSelectedParking({
        id: detailedParking._id || detailedParking.id,
        name: detailedParking.name,
        ownerId: detailedParking.ownerId || "N/A",
        slotDetails: detailedParking.slotDetails,
        location: detailedParking.location,
        qrCode: detailedParking.qrCode || ""
      });

      // Populate the update form with existing data
      setUpdateForm({
        name: detailedParking.name,
        slotDetails: {
          car: {
            totalSlot: detailedParking.slotDetails.car.totalSlot,
            bookingSlot: detailedParking.slotDetails.car.bookingSlot,
            bookingAvailableSlot: detailedParking.slotDetails.car.bookingAvailableSlot,
            withoutBookingSlot: detailedParking.slotDetails.car.withoutBookingSlot,
            withoutBookingAvailableSlot: detailedParking.slotDetails.car.withoutBookingAvailableSlot,
            perPrice30Min: detailedParking.slotDetails.car.perPrice30Min,
            perDayPrice: detailedParking.slotDetails.car.perDayPrice
          },
          bicycle: {
            totalSlot: detailedParking.slotDetails.bicycle.totalSlot,
            bookingSlot: detailedParking.slotDetails.bicycle.bookingSlot,
            bookingAvailableSlot: detailedParking.slotDetails.bicycle.bookingAvailableSlot,
            withoutBookingSlot: detailedParking.slotDetails.bicycle.withoutBookingSlot,
            withoutBookingAvailableSlot: detailedParking.slotDetails.bicycle.withoutBookingAvailableSlot,
            perPrice30Min: detailedParking.slotDetails.bicycle.perPrice30Min,
            perDayPrice: detailedParking.slotDetails.bicycle.perDayPrice
          },
          truck: {
            totalSlot: detailedParking.slotDetails.truck.totalSlot,
            bookingSlot: detailedParking.slotDetails.truck.bookingSlot,
            bookingAvailableSlot: detailedParking.slotDetails.truck.bookingAvailableSlot,
            withoutBookingSlot: detailedParking.slotDetails.truck.withoutBookingSlot,
            withoutBookingAvailableSlot: detailedParking.slotDetails.truck.withoutBookingAvailableSlot,
            perPrice30Min: detailedParking.slotDetails.truck.perPrice30Min,
            perDayPrice: detailedParking.slotDetails.truck.perDayPrice
          }
        },
        location: {
          latitude: detailedParking.location.latitude,
          longitude: detailedParking.location.longitude,
          address: {
            No: detailedParking.location.address.No,
            street: detailedParking.location.address.street,
            city: detailedParking.location.address.city,
            province: detailedParking.location.address.province,
            country: detailedParking.location.address.country,
            postalCode: detailedParking.location.address.postalCode
          }
        }
      });
      
      setShowUpdate(true);
    } catch (error) {
      console.error('Error fetching parking details:', error);
      alert('Failed to load parking details. Please try again.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParking) return;

    // Add confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to update the parking details for "${selectedParking.name}"?\n\n` +
      `This will update:\n` +
      `- Parking Name: ${updateForm.name}\n` +
      `- Location: ${updateForm.location.address.street}, ${updateForm.location.address.city}\n` +
      `- Car Slots: ${updateForm.slotDetails.car.totalSlot} (Price: $${updateForm.slotDetails.car.perPrice30Min}/30min, $${updateForm.slotDetails.car.perDayPrice}/day)\n` +
      `- Bicycle Slots: ${updateForm.slotDetails.bicycle.totalSlot} (Price: $${updateForm.slotDetails.bicycle.perPrice30Min}/30min, $${updateForm.slotDetails.bicycle.perDayPrice}/day)\n` +
      `- Truck Slots: ${updateForm.slotDetails.truck.totalSlot} (Price: $${updateForm.slotDetails.truck.perPrice30Min}/30min, $${updateForm.slotDetails.truck.perDayPrice}/day)\n\n` +
      `Click OK to confirm or Cancel to go back.`
    );

    if (!confirmed) {
      return;
    }

    // Log update form data before sending request
    console.log('[Update Parking] Form data:', JSON.stringify(updateForm, null, 2));

    try {
      const response = await axios.put(
        `http://localhost:5000/parking/update/${selectedParking.id}`,
        updateForm
      );

      if (response.status === 200) {
        alert('Parking details have been successfully updated!');
        setShowUpdate(false);
        fetchParkingData(); // Refresh the parking list
      }
    } catch (error) {
      console.error('Error updating parking:', error);
      alert('Failed to update parking. Please try again.');
    }
  };

  const handleUpdateClose = () => {
    setShowUpdate(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate numeric inputs
      if (addForm.slotDetails.car.totalSlot < 0 || 
          addForm.slotDetails.bicycle.totalSlot < 0 || 
          addForm.slotDetails.truck.totalSlot < 0 ||
          addForm.slotDetails.car.perPrice30Min < 0 ||
          addForm.slotDetails.car.perDayPrice < 0 ||
          addForm.slotDetails.bicycle.perPrice30Min < 0 ||
          addForm.slotDetails.bicycle.perDayPrice < 0 ||
          addForm.slotDetails.truck.perPrice30Min < 0 ||
          addForm.slotDetails.truck.perDayPrice < 0) {
        alert('All numeric values must be greater than or equal to 0');
        return;
      }

      // Log add form data before sending request
      console.log('[Add Parking] Form data:', JSON.stringify(addForm, null, 2));

      const response = await axios.post('http://localhost:5000/parking/add', addForm);
      if (response.status === 201) {
        alert('Parking added successfully!');
        setShowAdd(false);
        fetchParkingData(); // Refresh the list
        // Reset form
        setAddForm({
          name: '',
          ownerId: '',
          slotDetails: {
            car: {
              totalSlot: 0,
              bookingSlot: 0,
              bookingAvailableSlot: 0,
              withoutBookingSlot: 0,
              withoutBookingAvailableSlot: 0,
              perPrice30Min: 0,
              perDayPrice: 0
            },
            bicycle: {
              totalSlot: 0,
              bookingSlot: 0,
              bookingAvailableSlot: 0,
              withoutBookingSlot: 0,
              withoutBookingAvailableSlot: 0,
              perPrice30Min: 0,
              perDayPrice: 0
            },
            truck: {
              totalSlot: 0,
              bookingSlot: 0,
              bookingAvailableSlot: 0,
              withoutBookingSlot: 0,
              withoutBookingAvailableSlot: 0,
              perPrice30Min: 0,
              perDayPrice: 0
            }
          },
          location: {
            latitude: 0,
            longitude: 0,
            address: {
              No: '',
              street: '',
              city: '',
              province: '',
              country: '',
              postalCode: ''
            }
          }
        });
      }
    } catch (error) {
      console.error('Error adding parking:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Failed to add parking. Please try again.');
      } else {
        alert('Failed to add parking. Please try again.');
      }
    }
  };

  const handleDeleteClick = async (parking: ParkingResponse) => {
    // Add confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the parking "${parking.name}"?\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/parking/delete/${parking.id}`);
      if (response.status === 200) {
        alert('Parking deleted successfully!');
        fetchParkingData(); // Refresh the parking list
      }
    } catch (error) {
      console.error('Error deleting parking:', error);
      alert('Failed to delete parking. Please try again.');
    }
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
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 border border-gray-200 dark:border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Parking
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Parking Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-[150px]">
                    Location
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Total Car Slots
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Total Bicycle Slots
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Total Truck Slots
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
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 w-[150px]">
                      {parking.location?.address?.city || 'N/A'}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails?.car?.totalSlot || 0}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails?.bicycle?.totalSlot || 0}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {parking.slotDetails?.truck?.totalSlot || 0}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(parking)}
                          className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-1 text-xs border border-gray-200 dark:border-gray-600" 
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleUpdateClick(parking)}
                          className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-1 text-xs border border-gray-200 dark:border-gray-600"
                          title="Update Parking"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(parking)}
                          className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-1 text-xs border border-gray-200 dark:border-gray-600"
                          title="Delete Parking"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Slots For booking</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.bookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booking Available Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.bookingAvailableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Slots for Normal use</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.withoutBookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available slots for Normal use</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.car?.withoutBookingAvailableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                      <p className="text-gray-800 dark:text-white">$. {selectedParking.slotDetails?.car?.perPrice30Min || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                      <p className="text-gray-800 dark:text-white">$. {selectedParking.slotDetails?.car?.perDayPrice || 0}</p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Slots For booking</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.bookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booking Available Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.bookingAvailableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Slots for Normal use</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.withoutBookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available slots for Normal use</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.bicycle?.withoutBookingAvailableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                      <p className="text-gray-800 dark:text-white">$. {selectedParking.slotDetails?.bicycle?.perPrice30Min || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                      <p className="text-gray-800 dark:text-white">$. {selectedParking.slotDetails?.bicycle?.perDayPrice || 0}</p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Slots For booking</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.bookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booking Available Slots</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.bookingAvailableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Slots for Normal use</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.withoutBookingSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available slots for Normal use</p>
                      <p className="text-gray-800 dark:text-white">{selectedParking.slotDetails?.truck?.withoutBookingAvailableSlot || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per 30 min</p>
                      <p className="text-gray-800 dark:text-white">$. {selectedParking.slotDetails?.truck?.perPrice30Min || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price per Day</p>
                      <p className="text-gray-800 dark:text-white">$. {selectedParking.slotDetails?.truck?.perDayPrice || 0}</p>
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

      {/* Update Modal */}
      {showUpdate && selectedParking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Update Parking Details
              </h2>
              <button
                onClick={handleUpdateClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Parking Name</label>
                    <input
                      type="text"
                      value={updateForm.name}
                      onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Location Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={updateForm.location.latitude}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: { ...updateForm.location, latitude: parseFloat(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={updateForm.location.longitude}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: { ...updateForm.location, longitude: parseFloat(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Street Number</label>
                    <input
                      type="text"
                      value={updateForm.location.address.No}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: {
                          ...updateForm.location,
                          address: { ...updateForm.location.address, No: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Street</label>
                    <input
                      type="text"
                      value={updateForm.location.address.street}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: {
                          ...updateForm.location,
                          address: { ...updateForm.location.address, street: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">City</label>
                    <input
                      type="text"
                      value={updateForm.location.address.city}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: {
                          ...updateForm.location,
                          address: { ...updateForm.location.address, city: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Province</label>
                    <input
                      type="text"
                      value={updateForm.location.address.province}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: {
                          ...updateForm.location,
                          address: { ...updateForm.location.address, province: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Country</label>
                    <input
                      type="text"
                      value={updateForm.location.address.country}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: {
                          ...updateForm.location,
                          address: { ...updateForm.location.address, country: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Postal Code</label>
                    <input
                      type="text"
                      value={updateForm.location.address.postalCode}
                      onChange={(e) => setUpdateForm({
                        ...updateForm,
                        location: {
                          ...updateForm.location,
                          address: { ...updateForm.location.address, postalCode: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
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
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total Slots</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.totalSlot}
                        onChange={(e) => handleSlotUpdate('car', 'totalSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Slots For booking</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.bookingSlot}
                        onChange={(e) => handleSlotUpdate('car', 'bookingSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Available Slots for Booking</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.bookingAvailableSlot}
                        readOnly
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Slots for Normal use</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.withoutBookingSlot}
                        onChange={(e) => handleSlotUpdate('car', 'withoutBookingSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Available slots for Normal use</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.withoutBookingAvailableSlot}
                        readOnly
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per 30 min</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.perPrice30Min}
                        onChange={(e) => setUpdateForm({
                          ...updateForm,
                          slotDetails: {
                            ...updateForm.slotDetails,
                            car: { ...updateForm.slotDetails.car, perPrice30Min: parseFloat(e.target.value) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per Day</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.car.perDayPrice}
                        onChange={(e) => setUpdateForm({
                          ...updateForm,
                          slotDetails: {
                            ...updateForm.slotDetails,
                            car: { ...updateForm.slotDetails.car, perDayPrice: parseFloat(e.target.value) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bicycle Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Bicycle Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total Slots</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.totalSlot}
                        onChange={(e) => handleSlotUpdate('bicycle', 'totalSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Slots For booking</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.bookingSlot}
                        onChange={(e) => handleSlotUpdate('bicycle', 'bookingSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Available Slots for Booking</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.bookingAvailableSlot}
                        readOnly
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Slots for Normal use</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.withoutBookingSlot}
                        onChange={(e) => handleSlotUpdate('bicycle', 'withoutBookingSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Available slots for Normal use</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.withoutBookingAvailableSlot}
                        readOnly
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per 30 min</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.perPrice30Min}
                        onChange={(e) => setUpdateForm({
                          ...updateForm,
                          slotDetails: {
                            ...updateForm.slotDetails,
                            bicycle: { ...updateForm.slotDetails.bicycle, perPrice30Min: parseFloat(e.target.value) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per Day</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.bicycle.perDayPrice}
                        onChange={(e) => setUpdateForm({
                          ...updateForm,
                          slotDetails: {
                            ...updateForm.slotDetails,
                            bicycle: { ...updateForm.slotDetails.bicycle, perDayPrice: parseFloat(e.target.value) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Truck Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Truck Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total Slots</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.totalSlot}
                        onChange={(e) => handleSlotUpdate('truck', 'totalSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Slots For booking</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.bookingSlot}
                        onChange={(e) => handleSlotUpdate('truck', 'bookingSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Available Slots for Booking</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.bookingAvailableSlot}
                        readOnly
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Slots for Normal use</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.withoutBookingSlot}
                        onChange={(e) => handleSlotUpdate('truck', 'withoutBookingSlot', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Available slots for Normal use</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.withoutBookingAvailableSlot}
                        readOnly
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per 30 min</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.perPrice30Min}
                        onChange={(e) => setUpdateForm({
                          ...updateForm,
                          slotDetails: {
                            ...updateForm.slotDetails,
                            truck: { ...updateForm.slotDetails.truck, perPrice30Min: parseFloat(e.target.value) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per Day</label>
                      <input
                        type="number"
                        value={updateForm.slotDetails.truck.perDayPrice}
                        onChange={(e) => setUpdateForm({
                          ...updateForm,
                          slotDetails: {
                            ...updateForm.slotDetails,
                            truck: { ...updateForm.slotDetails.truck, perDayPrice: parseFloat(e.target.value) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleUpdateClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Update Parking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Parking Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add New Parking
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Parking Name</label>
                    <input
                      type="text"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Landowner</label>
                    <select
                      value={selectedOwner}
                      onChange={handleOwnerChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select a landowner</option>
                      {landowners.map((owner) => (
                        <option key={owner._id} value={owner._id}>
                          {owner.username} ({owner.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Location Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={addForm.location.latitude}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: { ...addForm.location, latitude: parseFloat(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={addForm.location.longitude}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: { ...addForm.location, longitude: parseFloat(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Street Number</label>
                    <input
                      type="text"
                      value={addForm.location.address.No}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: {
                          ...addForm.location,
                          address: { ...addForm.location.address, No: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Street</label>
                    <input
                      type="text"
                      value={addForm.location.address.street}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: {
                          ...addForm.location,
                          address: { ...addForm.location.address, street: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">City</label>
                    <input
                      type="text"
                      value={addForm.location.address.city}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: {
                          ...addForm.location,
                          address: { ...addForm.location.address, city: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Province</label>
                    <input
                      type="text"
                      value={addForm.location.address.province}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: {
                          ...addForm.location,
                          address: { ...addForm.location.address, province: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Country</label>
                    <input
                      type="text"
                      value={addForm.location.address.country}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: {
                          ...addForm.location,
                          address: { ...addForm.location.address, country: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Postal Code</label>
                    <input
                      type="text"
                      value={addForm.location.address.postalCode}
                      onChange={(e) => setAddForm({
                        ...addForm,
                        location: {
                          ...addForm.location,
                          address: { ...addForm.location.address, postalCode: e.target.value }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
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
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total Slots</label>
                      <input
                        type="number"
                        min="0"
                        value={addForm.slotDetails.car.totalSlot}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            car: { 
                              ...addForm.slotDetails.car, 
                              totalSlot: Math.max(0, parseInt(e.target.value) || 0),
                              
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per 30 min</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.slotDetails.car.perPrice30Min}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            car: { ...addForm.slotDetails.car, perPrice30Min: Math.max(0, parseFloat(e.target.value) || 0) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per Day</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.slotDetails.car.perDayPrice}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            car: { ...addForm.slotDetails.car, perDayPrice: Math.max(0, parseFloat(e.target.value) || 0) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Bicycle Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Bicycle Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total Slots</label>
                      <input
                        type="number"
                        min="0"
                        value={addForm.slotDetails.bicycle.totalSlot}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            bicycle: { 
                              ...addForm.slotDetails.bicycle, 
                              totalSlot: Math.max(0, parseInt(e.target.value) || 0),
                              
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per 30 min</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.slotDetails.bicycle.perPrice30Min}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            bicycle: { ...addForm.slotDetails.bicycle, perPrice30Min: Math.max(0, parseFloat(e.target.value) || 0) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per Day</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.slotDetails.bicycle.perDayPrice}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            bicycle: { ...addForm.slotDetails.bicycle, perDayPrice: Math.max(0, parseFloat(e.target.value) || 0) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Truck Slots */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Truck Slots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Total Slots</label>
                      <input
                        type="number"
                        min="0"
                        value={addForm.slotDetails.truck.totalSlot}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            truck: { 
                              ...addForm.slotDetails.truck, 
                              totalSlot: Math.max(0, parseInt(e.target.value) || 0),
                              
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per 30 min</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.slotDetails.truck.perPrice30Min}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            truck: { ...addForm.slotDetails.truck, perPrice30Min: Math.max(0, parseFloat(e.target.value) || 0) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Price per Day</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.slotDetails.truck.perDayPrice}
                        onChange={(e) => setAddForm({
                          ...addForm,
                          slotDetails: {
                            ...addForm.slotDetails,
                            truck: { ...addForm.slotDetails.truck, perDayPrice: Math.max(0, parseFloat(e.target.value) || 0) }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Add Parking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
