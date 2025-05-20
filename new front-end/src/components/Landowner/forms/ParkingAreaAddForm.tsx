import { useState } from "react";

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

const initialFormData: ParkingFormData = {
  name: "",
  ownerId: "",
  slotDetails: {
    car: { totalSlot: 0, bookingSlot: 0, availableSlot: 0, perPrice30Min: 0, perDayPrice: 0 },
    bicycle: { totalSlot: 0, bookingSlot: 0, availableSlot: 0, perPrice30Min: 0, perDayPrice: 0 },
    truck: { totalSlot: 0, bookingSlot: 0, availableSlot: 0, perPrice30Min: 0, perDayPrice: 0 },
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

export default function ParkingAreaAddForm() {
  const [formData, setFormData] = useState<ParkingFormData>(initialFormData);

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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // You can handle submission here (e.g. API call)
    alert("Parking Area Added!\n" + JSON.stringify(formData, null, 2));
    setFormData(initialFormData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Parking Area</h2>
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
          {["car", "bicycle", "truck"].map((type) => (
            <div key={type} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300 capitalize">{type} Slots</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Slots</label>
                  <input
                    type="number"
                    name="totalSlot"
                    value={formData.slotDetails[type as keyof typeof formData.slotDetails].totalSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", type);
                      setTimeout(() => calculateAvailableSlots(type as keyof typeof formData.slotDetails), 0);
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
                    value={formData.slotDetails[type as keyof typeof formData.slotDetails].bookingSlot}
                    onChange={(e) => {
                      handleInputChange(e, "slotDetails", type);
                      setTimeout(() => calculateAvailableSlots(type as keyof typeof formData.slotDetails), 0);
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
                    value={formData.slotDetails[type as keyof typeof formData.slotDetails].availableSlot}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per 30 min</label>
                  <input
                    type="number"
                    name="perPrice30Min"
                    value={formData.slotDetails[type as keyof typeof formData.slotDetails].perPrice30Min}
                    onChange={(e) => handleInputChange(e, "slotDetails", type)}
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
                    value={formData.slotDetails[type as keyof typeof formData.slotDetails].perDayPrice}
                    onChange={(e) => handleInputChange(e, "slotDetails", type)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
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
            type="reset"
            onClick={() => setFormData(initialFormData)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Clear
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
