import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye,
  ArrowLeft,
  Moon,
  Sun,
  MapPin,
  User,
  Car,
  Clock,
  AlignLeft
} from "lucide-react";

interface Booking {
  id: number;
  parkingName: string;
  address: string;
  slotType: "Car" | "Bicycle" | "Truck";
  slotNumber: number;
  bookedBy: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Completed" | "Cancelled";
  notes?: string;
}

const allBookings: Booking[] = [
  {
    id: 1,
    parkingName: "Springfield Parking",
    address: "123 Main St, Springfield",
    slotType: "Car",
    slotNumber: 5,
    bookedBy: "Alice Johnson",
    vehicleNumber: "XYZ-1234",
    startTime: "2025-05-01T09:00:00+05:30",
    endTime: "2025-05-01T18:00:00+05:30",
    status: "Active",
    notes: "VIP booking",
  },
  {
    id: 2,
    parkingName: "Metropolis Center",
    address: "456 Elm St, Metropolis",
    slotType: "Bicycle",
    slotNumber: 2,
    bookedBy: "Bob Smith",
    vehicleNumber: "BIC-5678",
    startTime: "2025-05-02T10:00:00+05:30",
    endTime: "2025-05-02T12:00:00+05:30",
    status: "Active",
  },
  {
    id: 3,
    parkingName: "Springfield Parking",
    address: "123 Main St, Springfield",
    slotType: "Truck",
    slotNumber: 1,
    bookedBy: "Carlos Martinez",
    vehicleNumber: "TRK-9999",
    startTime: "2025-04-30T20:00:00+05:30",
    endTime: "2025-05-01T06:00:00+05:30",
    status: "Completed",
    notes: "Completed booking",
  },
  {
    id: 4,
    parkingName: "Springfield Parking",
    address: "123 Main St, Springfield",
    slotType: "Car",
    slotNumber: 6,
    bookedBy: "David Lee",
    vehicleNumber: "XYZ-5555",
    startTime: "2025-05-01T11:00:00+05:30",
    endTime: "2025-05-01T15:00:00+05:30",
    status: "Active",
  },
];

const CURRENT_DATE = new Date("2025-05-01T10:53:00+05:30");

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const calculateDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Completed":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "Cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
  }
};

export default function LandownerCurrentBookingsTable() {
  const [search, setSearch] = useState("");
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
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

  const currentBookings = useMemo(
    () =>
      allBookings.filter(
        (b) =>
          b.status === "Active" &&
          new Date(b.endTime) > CURRENT_DATE
      ),
    []
  );

  const filteredBookings = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return currentBookings;
    return currentBookings.filter(
      (b) =>
        b.parkingName.toLowerCase().includes(lower) ||
        b.address.toLowerCase().includes(lower) ||
        b.bookedBy.toLowerCase().includes(lower) ||
        b.vehicleNumber.toLowerCase().includes(lower)
    );
  }, [search, currentBookings]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">Parking Management</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                Current Bookings for My Lands/Parking
              </span>
              {!viewBooking && (
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="text-gray-400 dark:text-gray-500" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="w-full md:w-80 pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {viewBooking ? (
            <div className="p-6">
              <button
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 text-sm font-medium transition duration-200"
                onClick={() => setViewBooking(null)}
              >
                <ArrowLeft size={16} /> Back to Bookings
              </button>
              <div className="max-w-4xl mx-auto">
                <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-800 to-emerald-900 dark:from-green-900 dark:to-emerald-950 px-6 py-6 relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
                    <div className="relative z-10">
                      <div className="text-white/80 text-sm font-medium mb-1">Booking #{viewBooking.id}</div>
                      <div className="text-2xl font-bold text-white mb-1">{viewBooking.parkingName}</div>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin size={16} className="mr-1" />
                        {viewBooking.address}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewBooking.status)}`}>
                        {viewBooking.status}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {calculateDuration(viewBooking.startTime, viewBooking.endTime)}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <ul className="space-y-4">
                          <li className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Booked By</span>
                            <span className="font-medium text-gray-900 dark:text-white">{viewBooking.bookedBy}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Vehicle Number</span>
                            <span className="font-medium text-gray-900 dark:text-white">{viewBooking.vehicleNumber}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Slot Type</span>
                            <span className="font-medium text-gray-900 dark:text-white flex items-center">
                              {viewBooking.slotType}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Slot Number</span>
                            <span className="font-medium text-gray-900 dark:text-white">#{viewBooking.slotNumber}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="space-y-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Check-in</div>
                            <div className="text-base font-medium text-gray-900 dark:text-white">
                              {formatDate(viewBooking.startTime)}
                            </div>
                          </div>
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Check-out</div>
                            <div className="text-base font-medium text-gray-900 dark:text-white">
                              {formatDate(viewBooking.endTime)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {viewBooking.notes && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        Notes
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{viewBooking.notes}</p>
                    </div>
                  )}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-200">
                      Contact User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parking Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slot</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booked By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <span className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
                          <p>No current bookings found.</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or check back later.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => setViewBooking(booking)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{booking.id}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{booking.parkingName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.address}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <span className="mr-2">{booking.slotType}</span>
                            <span>#{booking.slotNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.bookedBy}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.vehicleNumber}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500">From: {formatDate(booking.startTime)}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">To: {formatDate(booking.endTime)}</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                              Duration: {calculateDuration(booking.startTime, booking.endTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewBooking(booking);
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 transition duration-200"
                            title="View booking details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
