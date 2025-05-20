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
  Calendar,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
} from "lucide-react";

// Booking data structure
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

// Example data (replace with your real data)
const allBookings: Booking[] = [
  {
    id: 1,
    parkingName: "Springfield Parking",
    address: "123 Main St, Springfield",
    slotType: "Car",
    slotNumber: 5,
    bookedBy: "Alice Johnson",
    vehicleNumber: "XYZ-1234",
    startTime: "2025-04-01T09:00:00+05:30",
    endTime: "2025-04-01T18:00:00+05:30",
    status: "Completed",
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
    startTime: "2025-04-15T10:00:00+05:30",
    endTime: "2025-04-15T12:00:00+05:30",
    status: "Completed",
  },
  {
    id: 3,
    parkingName: "Springfield Parking",
    address: "123 Main St, Springfield",
    slotType: "Truck",
    slotNumber: 1,
    bookedBy: "Carlos Martinez",
    vehicleNumber: "TRK-9999",
    startTime: "2025-03-30T20:00:00+05:30",
    endTime: "2025-03-31T06:00:00+05:30",
    status: "Cancelled",
    notes: "Cancelled by user",
  },
  {
    id: 4,
    parkingName: "Springfield Parking",
    address: "123 Main St, Springfield",
    slotType: "Car",
    slotNumber: 6,
    bookedBy: "David Lee",
    vehicleNumber: "XYZ-5555",
    startTime: "2025-02-29T11:00:00+05:30",
    endTime: "2025-02-29T15:00:00+05:30",
    status: "Completed",
  },
  {
    id: 5,
    parkingName: "Metro Plaza",
    address: "789 Oak St, Metropolis",
    slotType: "Car",
    slotNumber: 3,
    bookedBy: "Eva Green",
    vehicleNumber: "CAR-1111",
    startTime: "2025-03-15T08:00:00+05:30",
    endTime: "2025-03-15T10:00:00+05:30",
    status: "Cancelled",
    notes: "No show",
  },
  // ...add more for testing pagination
];

const CURRENT_DATE = new Date("2025-05-01T13:32:00+05:30");

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
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

type SortKey = "parkingName" | "startTime" | "endTime" | "status";
type SortDirection = "asc" | "desc";

export default function LandownerBookingHistoryTable() {
  const [search, setSearch] = useState("");
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Advanced features
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "Cancelled">("All");
  const [sortKey, setSortKey] = useState<SortKey>("endTime");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

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

  // Booking history: show only bookings that have ended or are not active
  const historyBookings = useMemo(
    () =>
      allBookings.filter(
        (b) =>
          b.status === "Completed" ||
          b.status === "Cancelled" ||
          (b.status === "Active" && new Date(b.endTime) < CURRENT_DATE)
      ),
    []
  );

  // Filter, sort, and paginate
  const filteredBookings = useMemo(() => {
    let list = historyBookings;

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter((b) => b.status === statusFilter);
    }

    // Date filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((b) => new Date(b.endTime) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      list = list.filter((b) => new Date(b.endTime) <= to);
    }

    // Search
    const lower = search.trim().toLowerCase();
    if (lower) {
      list = list.filter(
        (b) =>
          b.parkingName.toLowerCase().includes(lower) ||
          b.address.toLowerCase().includes(lower) ||
          b.bookedBy.toLowerCase().includes(lower) ||
          b.vehicleNumber.toLowerCase().includes(lower)
      );
    }

    // Sorting
    list = [...list].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortKey) {
        case "parkingName":
          aVal = a.parkingName;
          bVal = b.parkingName;
          break;
        case "startTime":
          aVal = new Date(a.startTime).getTime();
          bVal = new Date(b.startTime).getTime();
          break;
        case "endTime":
          aVal = new Date(a.endTime).getTime();
          bVal = new Date(b.endTime).getTime();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [search, dateFrom, dateTo, statusFilter, sortKey, sortDir, historyBookings]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const pagedBookings = filteredBookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Sorting UI
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                Booking History for My Lands/Parking
              </span>
              {!viewBooking && (
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="text-gray-400 dark:text-gray-500" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="w-full md:w-56 pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => {
                      setStatusFilter(e.target.value as typeof statusFilter);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => {
                        setDateFrom(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => {
                        setDateTo(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                      placeholder="To"
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
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 px-6 py-6 relative overflow-hidden">
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
                          <span className="font-medium text-gray-900 dark:text-white">{viewBooking.slotType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Slot Number</span>
                          <span className="font-medium text-gray-900 dark:text-white">#{viewBooking.slotNumber}</span>
                        </li>
                      </ul>
                    </div>
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
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort("parkingName")}
                      >
                        Parking Name{" "}
                        {sortKey === "parkingName" ? (sortDir === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />) : ""}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slot</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booked By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort("endTime")}
                      >
                        End Time{" "}
                        {sortKey === "endTime" ? (sortDir === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />) : ""}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort("status")}
                      >
                        Status{" "}
                        {sortKey === "status" ? (sortDir === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />) : ""}
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pagedBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <p>No booking history found.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pagedBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => setViewBooking(booking)}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{booking.parkingName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.address}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <span>{booking.slotType}</span>
                              <span className="ml-2">#{booking.slotNumber}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.bookedBy}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.vehicleNumber}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(booking.endTime)}</td>
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
              {/* Pagination */}
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}-
                  {Math.min(page * PAGE_SIZE, filteredBookings.length)} of {filteredBookings.length}
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-gray-700 dark:text-gray-200 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
