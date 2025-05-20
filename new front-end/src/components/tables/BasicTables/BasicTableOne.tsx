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

  if (loading) {
    return <div className="text-center py-4">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {summary && (
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
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Vehicle Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Time Slot
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Duration
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Payment
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Fee
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
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
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {booking.vehicleType}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {`${booking.entryTime} - ${booking.exitTime}`}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {booking.duration}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={booking.paymentStatus === "completed" ? "success" : "warning"}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {booking.cost}
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
