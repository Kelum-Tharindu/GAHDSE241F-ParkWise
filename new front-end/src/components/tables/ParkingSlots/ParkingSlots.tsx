import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../uiMy/table";
import Badge from "../../uiMy/badge/Badge";

interface ParkingArea {
  id: string;
  slotsAvailable: number;
  location: string;
  openTime: string;
  closeTime: string;
  pricePerSlot: string;
  status: string;
}

interface VehicleSlotDetails {
  totalSlot: number;
  bookingSlot: number;
  availableSlot: number;
  perPrice30Min: number;
  perDayPrice: number;
}

interface ParkingFormData {
  name: string;
  ownerId: string;
  slotDetails: {
    car: VehicleSlotDetails;
    bicycle: VehicleSlotDetails;
    truck: VehicleSlotDetails;
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
}

const parkingData: ParkingArea[] = [
  {
    id: "P-001",
    slotsAvailable: 20,
    location: "Colombo - Fort",
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    pricePerSlot: "Rs. 150",
    status: "Open",
  },
  {
    id: "P-002",
    slotsAvailable: 10,
    location: "Kandy - City Center",
    openTime: "7:00 AM",
    closeTime: "9:00 PM",
    pricePerSlot: "Rs. 200",
    status: "Open",
  },
  {
    id: "P-003",
    slotsAvailable: 0,
    location: "Galle - Bus Stand",
    openTime: "8:00 AM",
    closeTime: "8:00 PM",
    pricePerSlot: "Rs. 100",
    status: "Full",
  },
  {
    id: "P-004",
    slotsAvailable: 15,
    location: "Negombo - Beach Road",
    openTime: "5:30 AM",
    closeTime: "11:00 PM",
    pricePerSlot: "Rs. 180",
    status: "Open",
  },
  {
    id: "P-005",
    slotsAvailable: 8,
    location: "Maharagama - Town Hall",
    openTime: "6:30 AM",
    closeTime: "9:30 PM",
    pricePerSlot: "Rs. 120",
    status: "Maintenance",
  },
];

const initialFormData: ParkingFormData = {
  name: "",
  ownerId: "",
  slotDetails: {
    car: {
      totalSlot: 0,
      bookingSlot: 0,
      availableSlot: 0,
      perPrice30Min: 0,
      perDayPrice: 0,
    },
    bicycle: {
      totalSlot: 0,
      bookingSlot: 0,
      availableSlot: 0,
      perPrice30Min: 0,
      perDayPrice: 0,
    },
    truck: {
      totalSlot: 0,
      bookingSlot: 0,
      availableSlot: 0,
      perPrice30Min: 0,
      perDayPrice: 0,
    },
  },
  location: {
    latitude: 0,
    longitude: 0,
    address: {
      No: "",
      street: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    },
  },
};

export default function ParkingDetailsTable() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ParkingFormData>(initialFormData);

  const handleAddParking = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData(initialFormData);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Process form data here
    setShowForm(false);
    setFormData(initialFormData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: string,
    subsection?: string,
    field?: string
  ) => {
    const { name, value } = e.target;
    
    if (!section) {
      setFormData({ ...formData, [name]: value });
    } else if (section === "slotDetails" && subsection) {
      setFormData({
        ...formData,
        slotDetails: {
          ...formData.slotDetails,
          [subsection]: {
            ...formData.slotDetails[subsection as keyof typeof formData.slotDetails],
            [name]: parseFloat(value) || 0,
          },
        },
      });
    } else if (section === "location") {
      if (subsection === "address" && field) {
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            address: {
              ...formData.location.address,
              [field]: value,
            },
          },
        });
      } else {
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            [name]: parseFloat(value) || 0,
          },
        });
      }
    }
  };

  // Calculate available slots based on total and booked
  const calculateAvailableSlots = (vehicleType: keyof typeof formData.slotDetails) => {
    const { totalSlot, bookingSlot } = formData.slotDetails[vehicleType];
    const available = totalSlot - bookingSlot;
    
    // Update the form data
    setFormData({
      ...formData,
      slotDetails: {
        ...formData.slotDetails,
        [vehicleType]: {
          ...formData.slotDetails[vehicleType],
          availableSlot: available >= 0 ? available : 0,
        },
      },
    });
  };

  if (showForm) {
    return (
      <div className="bg-white dark:bg-white/[0.03] p-6 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white/90">Add New Parking Area</h2>
        
        <form onSubmit={handleSubmitForm}>
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-white/80">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Parking Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Owner ID</label>
                <input
                  type="text"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Slot Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-white/80">Slot Details</h3>
            
            {/* Car Slots */}
            <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300">Car Slots</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Slots</label>
                  <input
                    type="number"
                    name="totalSlot"
                    value={formData.slotDetails.car.totalSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", "car");
                      setTimeout(() => calculateAvailableSlots("car"), 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Booked Slots</label>
                  <input
                    type="number"
                    name="bookingSlot"
                    value={formData.slotDetails.car.bookingSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", "car");
                      setTimeout(() => calculateAvailableSlots("car"), 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Slots</label>
                  <input
                    type="number"
                    name="availableSlot"
                    value={formData.slotDetails.car.availableSlot}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per 30 min</label>
                  <input
                    type="number"
                    name="perPrice30Min"
                    value={formData.slotDetails.car.perPrice30Min}
                    onChange={(e) => handleInputChange(e, "slotDetails", "car")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per Day</label>
                  <input
                    type="number"
                    name="perDayPrice"
                    value={formData.slotDetails.car.perDayPrice}
                    onChange={(e) => handleInputChange(e, "slotDetails", "car")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Bicycle Slots */}
            <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300">Bicycle Slots</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Slots</label>
                  <input
                    type="number"
                    name="totalSlot"
                    value={formData.slotDetails.bicycle.totalSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", "bicycle");
                      setTimeout(() => calculateAvailableSlots("bicycle"), 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Booked Slots</label>
                  <input
                    type="number"
                    name="bookingSlot"
                    value={formData.slotDetails.bicycle.bookingSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", "bicycle");
                      setTimeout(() => calculateAvailableSlots("bicycle"), 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Slots</label>
                  <input
                    type="number"
                    name="availableSlot"
                    value={formData.slotDetails.bicycle.availableSlot}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per 30 min</label>
                  <input
                    type="number"
                    name="perPrice30Min"
                    value={formData.slotDetails.bicycle.perPrice30Min}
                    onChange={(e) => handleInputChange(e, "slotDetails", "bicycle")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per Day</label>
                  <input
                    type="number"
                    name="perDayPrice"
                    value={formData.slotDetails.bicycle.perDayPrice}
                    onChange={(e) => handleInputChange(e, "slotDetails", "bicycle")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Truck Slots */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300">Truck Slots</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Slots</label>
                  <input
                    type="number"
                    name="totalSlot"
                    value={formData.slotDetails.truck.totalSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", "truck");
                      setTimeout(() => calculateAvailableSlots("truck"), 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Booked Slots</label>
                  <input
                    type="number"
                    name="bookingSlot"
                    value={formData.slotDetails.truck.bookingSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", "truck");
                      setTimeout(() => calculateAvailableSlots("truck"), 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Slots</label>
                  <input
                    type="number"
                    name="availableSlot"
                    value={formData.slotDetails.truck.availableSlot}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per 30 min</label>
                  <input
                    type="number"
                    name="perPrice30Min"
                    value={formData.slotDetails.truck.perPrice30Min}
                    onChange={(e) => handleInputChange(e, "slotDetails", "truck")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per Day</label>
                  <input
                    type="number"
                    name="perDayPrice"
                    value={formData.slotDetails.truck.perDayPrice}
                    onChange={(e) => handleInputChange(e, "slotDetails", "truck")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-white/80">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.location.latitude}
                  onChange={(e) => handleInputChange(e, "location")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  step="any"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.location.longitude}
                  onChange={(e) => handleInputChange(e, "location")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  step="any"
                  required
                />
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Building No</label>
                  <input
                    type="text"
                    value={formData.location.address.No}
                    onChange={(e) => handleInputChange(e, "location", "address", "No")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.location.address.street}
                    onChange={(e) => handleInputChange(e, "location", "address", "street")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.location.address.city}
                    onChange={(e) => handleInputChange(e, "location", "address", "city")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Province/State</label>
                  <input
                    type="text"
                    value={formData.location.address.province}
                    onChange={(e) => handleInputChange(e, "location", "address", "province")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.location.address.country}
                    onChange={(e) => handleInputChange(e, "location", "address", "country")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.location.address.postalCode}
                    onChange={(e) => handleInputChange(e, "location", "address", "postalCode")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Save Parking Area
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {/* Add button section */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddParking}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Parking Area
        </button>
      </div>

      {/* Table section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Parking ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Slots Available
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Location
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Open Time
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Close Time
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Slot Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {parkingData.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {area.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {area.slotsAvailable}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {area.location}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {area.openTime}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {area.closeTime}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {area.pricePerSlot}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        area.status === "Open"
                          ? "success"
                          : area.status === "Full"
                          ? "error"
                          : "warning"
                      }
                    >
                      {area.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

