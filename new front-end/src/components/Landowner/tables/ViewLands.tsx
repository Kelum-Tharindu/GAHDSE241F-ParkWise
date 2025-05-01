import React, { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaPlus,
  FaFilter,
  FaMapMarkerAlt,
  FaCar,
  FaMoneyBill,
  FaClipboardList,
  FaArrowLeft,
  FaSun,
  FaMoon,
  FaEdit,
} from "react-icons/fa";

interface VehicleSlotDetails {
  totalSlot: number;
  bookingSlot: number;
  availableSlot: number;
  perPrice30Min: number;
  perDayPrice: number;
}

interface ParkingLocation {
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
}

interface ParkingRental {
  id: number;
  name: string;
  ownerId: string;
  slotDetails: {
    car: VehicleSlotDetails;
    bicycle: VehicleSlotDetails;
    truck: VehicleSlotDetails;
  };
  location: ParkingLocation;
  status: "Active" | "Inactive";
  rentedFrom: string;
  rentedTo: string;
  notes: string;
  updatedAt: string;
}

const initialRentals: ParkingRental[] = [
  {
    id: 1,
    name: "Springfield Parking",
    ownerId: "owner-001",
    slotDetails: {
      car: { totalSlot: 20, bookingSlot: 5, availableSlot: 15, perPrice30Min: 2, perDayPrice: 20 },
      bicycle: { totalSlot: 10, bookingSlot: 2, availableSlot: 8, perPrice30Min: 0.5, perDayPrice: 4 },
      truck: { totalSlot: 3, bookingSlot: 1, availableSlot: 2, perPrice30Min: 5, perDayPrice: 40 },
    },
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: {
        No: "123",
        street: "Main St",
        city: "Springfield",
        province: "Illinois",
        country: "USA",
        postalCode: "62701",
      },
    },
    status: "Active",
    rentedFrom: "2024-01-01",
    rentedTo: "2025-01-01",
    notes: "Prime location, covered parking.",
    updatedAt: "2025-04-27",
  },
  {
    id: 2,
    name: "Metropolis Center",
    ownerId: "owner-002",
    slotDetails: {
      car: { totalSlot: 12, bookingSlot: 3, availableSlot: 9, perPrice30Min: 3, perDayPrice: 25 },
      bicycle: { totalSlot: 8, bookingSlot: 1, availableSlot: 7, perPrice30Min: 0.75, perDayPrice: 5 },
      truck: { totalSlot: 2, bookingSlot: 0, availableSlot: 2, perPrice30Min: 6, perDayPrice: 50 },
    },
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: {
        No: "456",
        street: "Elm St",
        city: "Metropolis",
        province: "Illinois",
        country: "USA",
        postalCode: "62960",
      },
    },
    status: "Active",
    rentedFrom: "2024-06-01",
    rentedTo: "2025-06-01",
    notes: "",
    updatedAt: "2025-04-27",
  },
];

const emptyForm: Omit<ParkingRental, "id" | "status" | "updatedAt"> = {
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
  rentedFrom: "",
  rentedTo: "",
  notes: "",
};

function validate(form: typeof emptyForm) {
  const errs: { [key: string]: string } = {};
  if (!form.name.trim()) errs.name = "Parking Name is required";
  if (!form.ownerId.trim()) errs.ownerId = "Owner ID is required";
  ["car", "bicycle", "truck"].forEach((type) => {
    if (form.slotDetails[type as keyof typeof form.slotDetails].totalSlot < 0)
      errs[`${type}TotalSlot`] = "Total slot must be >= 0";
    if (form.slotDetails[type as keyof typeof form.slotDetails].bookingSlot < 0)
      errs[`${type}BookingSlot`] = "Booked slot must be >= 0";
    if (form.slotDetails[type as keyof typeof form.slotDetails].perPrice30Min < 0)
      errs[`${type}PerPrice30Min`] = "Price must be >= 0";
    if (form.slotDetails[type as keyof typeof form.slotDetails].perDayPrice < 0)
      errs[`${type}PerDayPrice`] = "Price must be >= 0";
  });
  if (!form.location.address.No.trim()) errs.No = "Building No is required";
  if (!form.location.address.street.trim()) errs.street = "Street is required";
  if (!form.location.address.city.trim()) errs.city = "City is required";
  if (!form.location.address.province.trim()) errs.province = "Province/State is required";
  if (!form.location.address.country.trim()) errs.country = "Country is required";
  if (!form.location.address.postalCode.trim()) errs.postalCode = "Postal Code is required";
  if (!form.rentedFrom.trim()) errs.rentedFrom = "Rented from date is required";
  if (!form.rentedTo.trim()) errs.rentedTo = "Rented to date is required";
  return errs;
}

function calcAvailableSlot(total: number, booked: number) {
  const avail = total - booked;
  return avail >= 0 ? avail : 0;
}

function ParkingRentalForm({
  initial,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  initial: typeof emptyForm;
  onCancel: () => void;
  onSubmit: (data: typeof emptyForm) => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<typeof emptyForm>(initial);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update available slots when total or booked changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      slotDetails: {
        car: {
          ...prev.slotDetails.car,
          availableSlot: calcAvailableSlot(prev.slotDetails.car.totalSlot, prev.slotDetails.car.bookingSlot),
        },
        bicycle: {
          ...prev.slotDetails.bicycle,
          availableSlot: calcAvailableSlot(prev.slotDetails.bicycle.totalSlot, prev.slotDetails.bicycle.bookingSlot),
        },
        truck: {
          ...prev.slotDetails.truck,
          availableSlot: calcAvailableSlot(prev.slotDetails.truck.totalSlot, prev.slotDetails.truck.bookingSlot),
        },
      },
    }));
    // eslint-disable-next-line
  }, [
    form.slotDetails.car.totalSlot,
    form.slotDetails.car.bookingSlot,
    form.slotDetails.bicycle.totalSlot,
    form.slotDetails.bicycle.bookingSlot,
    form.slotDetails.truck.totalSlot,
    form.slotDetails.truck.bookingSlot,
  ]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    vehicleType?: "car" | "bicycle" | "truck",
    field?: string
  ) => {
    const { name, value } = e.target;
    if (!section) {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else if (section === "slotDetails" && vehicleType) {
      setForm((prev) => ({
        ...prev,
        slotDetails: {
          ...prev.slotDetails,
          [vehicleType]: {
            ...prev.slotDetails[vehicleType],
            [name]: Number(value),
          },
        },
      }));
    } else if (section === "location" && field) {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: {
            ...prev.location.address,
            [field]: value,
          },
        },
      }));
    } else if (section === "location") {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: Number(value),
        },
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Parking Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInput}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
            {errors.name && <div className="text-xs text-red-500">{errors.name}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Owner ID</label>
            <input
              type="text"
              name="ownerId"
              value={form.ownerId}
              onChange={handleInput}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
            {errors.ownerId && <div className="text-xs text-red-500">{errors.ownerId}</div>}
          </div>
        </div>
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-white/80">Slot Details</h3>
        {(["car", "bicycle", "truck"] as const).map((type) => (
          <div key={type} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300 capitalize">{type} Slots</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Slots</label>
                <input
                  type="number"
                  name="totalSlot"
                  value={form.slotDetails[type].totalSlot}
                  onChange={(e) => handleInput(e, "slotDetails", type)}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
                {errors[`${type}TotalSlot`] && <div className="text-xs text-red-500">{errors[`${type}TotalSlot`]}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Booked Slots</label>
                <input
                  type="number"
                  name="bookingSlot"
                  value={form.slotDetails[type].bookingSlot}
                  onChange={(e) => handleInput(e, "slotDetails", type)}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
                {errors[`${type}BookingSlot`] && <div className="text-xs text-red-500">{errors[`${type}BookingSlot`]}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Slots</label>
                <input
                  type="number"
                  name="availableSlot"
                  value={form.slotDetails[type].availableSlot}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per 30 min</label>
                <input
                  type="number"
                  name="perPrice30Min"
                  value={form.slotDetails[type].perPrice30Min}
                  onChange={(e) => handleInput(e, "slotDetails", type)}
                  min={0}
                  step={0.01}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
                {errors[`${type}PerPrice30Min`] && <div className="text-xs text-red-500">{errors[`${type}PerPrice30Min`]}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price per Day</label>
                <input
                  type="number"
                  name="perDayPrice"
                  value={form.slotDetails[type].perDayPrice}
                  onChange={(e) => handleInput(e, "slotDetails", type)}
                  min={0}
                  step={0.01}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
                {errors[`${type}PerDayPrice`] && <div className="text-xs text-red-500">{errors[`${type}PerDayPrice`]}</div>}
              </div>
            </div>
          </div>
        ))}
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-white/80">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={form.location.latitude}
              onChange={(e) => handleInput(e, "location")}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={form.location.longitude}
              onChange={(e) => handleInput(e, "location")}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md mb-6">
          <h4 className="font-medium mb-3 text-gray-600 dark:text-gray-300">Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Building No</label>
              <input
                type="text"
                value={form.location.address.No}
                onChange={(e) => handleInput(e, "location", undefined, "No")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
              {errors.No && <div className="text-xs text-red-500">{errors.No}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Street</label>
              <input
                type="text"
                value={form.location.address.street}
                onChange={(e) => handleInput(e, "location", undefined, "street")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
              {errors.street && <div className="text-xs text-red-500">{errors.street}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
              <input
                type="text"
                value={form.location.address.city}
                onChange={(e) => handleInput(e, "location", undefined, "city")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
              {errors.city && <div className="text-xs text-red-500">{errors.city}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Province/State</label>
              <input
                type="text"
                value={form.location.address.province}
                onChange={(e) => handleInput(e, "location", undefined, "province")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
              {errors.province && <div className="text-xs text-red-500">{errors.province}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Country</label>
              <input
                type="text"
                value={form.location.address.country}
                onChange={(e) => handleInput(e, "location", undefined, "country")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
              {errors.country && <div className="text-xs text-red-500">{errors.country}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Postal Code</label>
              <input
                type="text"
                value={form.location.address.postalCode}
                onChange={(e) => handleInput(e, "location", undefined, "postalCode")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
              {errors.postalCode && <div className="text-xs text-red-500">{errors.postalCode}</div>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rented From</label>
            <input
              type="date"
              name="rentedFrom"
              value={form.rentedFrom}
              onChange={handleInput}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
            {errors.rentedFrom && <div className="text-xs text-red-500">{errors.rentedFrom}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rented To</label>
            <input
              type="date"
              name="rentedTo"
              value={form.rentedTo}
              onChange={handleInput}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
            {errors.rentedTo && <div className="text-xs text-red-500">{errors.rentedTo}</div>}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleInput}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ParkingRentalPage() {
  const [rentals, setRentals] = useState<ParkingRental[]>(initialRentals);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewRental, setViewRental] = useState<ParkingRental | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  // Add
  const handleAdd = (data: typeof emptyForm) => {
    setRentals((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1,
        ...data,
        status: "Active",
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowAddForm(false);
  };

  // Edit
  const handleEdit = (id: number, data: typeof emptyForm) => {
    setRentals((prev) =>
      prev.map((rental) =>
        rental.id === id
          ? {
              ...rental,
              ...data,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : rental
      )
    );
    setEditId(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this rental record?")) {
      setRentals((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredRentals = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return rentals;
    return rentals.filter((a) => a.name.toLowerCase().includes(lower));
  }, [rentals, search]);

  // Render
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-outfit">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Theme toggle button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Parking Rentals Management</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
          </button>
        </div>
        {/* View */}
        {viewRental ? (
          <div className="p-8">
            <button
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-xs font-medium"
              onClick={() => setViewRental(null)}
            >
              <FaArrowLeft /> Back to Table
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <FaMapMarkerAlt className="w-20 h-20 text-blue-500 mb-4" />
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{viewRental.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-4
                  ${viewRental.status === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
                `}>{viewRental.status}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <strong>Owner ID:</strong> {viewRental.ownerId}
                </div>
                <div>
                  <strong>Rental Period:</strong> {viewRental.rentedFrom} to {viewRental.rentedTo}
                </div>
                <div>
                  <strong>Car Slots:</strong> {viewRental.slotDetails.car.totalSlot} total, {viewRental.slotDetails.car.bookingSlot} booked, {viewRental.slotDetails.car.availableSlot} available
                </div>
                <div>
                  <strong>Bicycle Slots:</strong> {viewRental.slotDetails.bicycle.totalSlot} total, {viewRental.slotDetails.bicycle.bookingSlot} booked, {viewRental.slotDetails.bicycle.availableSlot} available
                </div>
                <div>
                  <strong>Truck Slots:</strong> {viewRental.slotDetails.truck.totalSlot} total, {viewRental.slotDetails.truck.bookingSlot} booked, {viewRental.slotDetails.truck.availableSlot} available
                </div>
                <div>
                  <strong>Location:</strong> {viewRental.location.address.No} {viewRental.location.address.street}, {viewRental.location.address.city}, {viewRental.location.address.province}, {viewRental.location.address.country}, {viewRental.location.address.postalCode}
                </div>
                <div>
                  <strong>Latitude:</strong> {viewRental.location.latitude}
                </div>
                <div>
                  <strong>Longitude:</strong> {viewRental.location.longitude}
                </div>
                <div>
                  <strong>Car Price:</strong> ${viewRental.slotDetails.car.perPrice30Min}/30min, ${viewRental.slotDetails.car.perDayPrice}/day
                </div>
                <div>
                  <strong>Bicycle Price:</strong> ${viewRental.slotDetails.bicycle.perPrice30Min}/30min, ${viewRental.slotDetails.bicycle.perDayPrice}/day
                </div>
                <div>
                  <strong>Truck Price:</strong> ${viewRental.slotDetails.truck.perPrice30Min}/30min, ${viewRental.slotDetails.truck.perDayPrice}/day
                </div>
                <div>
                  <strong>Notes:</strong> {viewRental.notes || "No notes"}
                </div>
                <div>
                  <strong>Last Updated:</strong> {viewRental.updatedAt}
                </div>
              </div>
            </div>
          </div>
        ) : showAddForm ? (
          <ParkingRentalForm
            initial={emptyForm}
            onCancel={() => setShowAddForm(false)}
            onSubmit={handleAdd}
            submitLabel="Add Parking Rental"
          />
        ) : editId !== null ? (
          <ParkingRentalForm
            initial={{
              ...rentals.find((r) => r.id === editId)!,
              // Remove id, status, updatedAt
              // updatedAt is excluded by Omit, so no need to assign it
            }}
            onCancel={() => setEditId(null)}
            onSubmit={(data) => handleEdit(editId, data)}
            submitLabel="Update Parking Rental"
          />
        ) : (
          <>
            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by parking name"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none text-xs text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition text-xs font-medium"
                  type="button"
                >
                  <FaFilter /> Filters
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition text-xs font-medium"
                >
                  <FaPlus /> Add Parking Rental
                </button>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner ID</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Car Slots</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bicycle Slots</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Truck Slots</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Edit</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  {filteredRentals.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No parking rentals found.
                      </td>
                    </tr>
                  ) : (
                    filteredRentals.map((rental) => (
                      <tr key={rental.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <td className="px-2 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{rental.id}</td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">{rental.name}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{rental.ownerId}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {rental.slotDetails.car.totalSlot} total, {rental.slotDetails.car.bookingSlot} booked, {rental.slotDetails.car.availableSlot} avail
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {rental.slotDetails.bicycle.totalSlot} total, {rental.slotDetails.bicycle.bookingSlot} booked, {rental.slotDetails.bicycle.availableSlot} avail
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {rental.slotDetails.truck.totalSlot} total, {rental.slotDetails.truck.bookingSlot} booked, {rental.slotDetails.truck.availableSlot} avail
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {rental.location.address.city}, {rental.location.address.country}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${rental.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
                          `}>{rental.status}</span>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{rental.updatedAt}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => setViewRental(rental)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            title="View details"
                          >
                            <FaEye size={14} />
                          </button>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => setEditId(rental.id)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(rental.id)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
