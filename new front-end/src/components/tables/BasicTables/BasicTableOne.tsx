import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../uiMy/table";
import Badge from "../../uiMy/badge/Badge";
import axios from "axios";

interface Booking {
  id: string;
  location: string;
  date: string;
  duration: string;
  cost: string;
  status: string;
  color: { r: number; g: number; b: number; a: number };
  vehicleType: string;
  entryTime: string;
  exitTime: string;
  paymentStatus: string;
  userId: string;
  billingHash: string;
  qrImage: string;
  feeDetails: {
    usageFee: string;
    bookingFee: string;
    totalFee: string;
    extraTimeFee: string;
  };
  extraTime: string;
  createdAt: string;
  updatedAt: string;
}

interface Summary {
  month: string;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  ongoingBookings: number;
  totalRevenue: string;
}

export default function BookingListTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/all-bookings');
        setBookings(response.data.bookings);
        setSummary(response.data.summary);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings by location
  const filteredBookings = bookings.filter(booking => 
    booking.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Summary for {summary.month}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
              <p className="text-2xl">{summary.totalBookings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-2xl">${summary.totalRevenue}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
              <p className="text-2xl">{summary.activeBookings}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold mb-2">Completed</h3>
              <p className="text-2xl">{summary.completedBookings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold mb-2">Ongoing</h3>
              <p className="text-2xl">{summary.ongoingBookings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold mb-2">Cancelled</h3>
              <p className="text-2xl">{summary.cancelledBookings}</p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Booking Details</h3>
          <div className="flex space-x-2">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium dark:bg-blue-900/30 dark:text-blue-300">
              All Bookings
            </div>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.08]">
              Export
            </div>
          </div>
        </div>

        {/* Add search bar for location filtering */}
        <div className="p-4 flex items-center">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="text" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Search by location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Vehicle Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Time Slot
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Duration
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Payment
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs uppercase tracking-wider dark:text-gray-300"
                >
                  Total Fee
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredBookings.map((booking, index) => (
                <TableRow 
                  key={booking.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out dark:hover:bg-white/[0.02] ${index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50/50 dark:bg-white/[0.01]'}`}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-300">
                        {booking.location.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {booking.location}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {booking.date}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 font-medium text-start text-theme-sm dark:text-gray-300">
                    {booking.vehicleType}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {`${booking.entryTime} - ${booking.exitTime}`}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {booking.duration}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        booking.status === "Active"
                          ? "success"
                          : booking.status === "Pending"
                          ? "warning"
                          : booking.status === "Completed"
                          ? "info"
                          : "error"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={booking.paymentStatus === "completed" ? "success" : "warning"}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 font-medium text-start text-theme-sm dark:text-white/90">
                    {booking.cost}
                  </TableCell>
                </TableRow>
              ))}            
            </TableBody>
          </Table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.05] flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredBookings.length} entries
          </span>
          <div className="inline-flex rounded-md shadow-sm">
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-gray-300 dark:hover:bg-white/[0.05]">
              Previous
            </button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-gray-300 dark:hover:bg-white/[0.05]">
              2
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-gray-300 dark:hover:bg-white/[0.05]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}