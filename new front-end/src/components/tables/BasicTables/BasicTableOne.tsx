import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../uiMy/table";

import Badge from "../../uiMy/badge/Badge";

interface Booking {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  vehicleType: string;
  vehicleNumber: string;
  allocatedTime: string;
  parkingName: string;
  parkingSlotId: string;
  status: string;
  fee: string;
}

// Booking table data (Sri Lankan themed)
const tableData: Booking[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Nuwan Perera",
      role: "Car Owner",
    },
    vehicleType: "Toyota Axio",
    vehicleNumber: "CAG-1234",
    allocatedTime: "8:00 AM - 10:00 AM",
    parkingName: "Colombo City Parking",
    parkingSlotId: "P-101",
    fee: "Rs. 1,200",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Ishara Fernando",
      role: "Van Driver",
    },
    vehicleType: "Nissan Caravan",
    vehicleNumber: "BBA-4567",
    allocatedTime: "10:30 AM - 1:00 PM",
    parkingName: "Kandy Parking Zone",
    parkingSlotId: "P-202",
    fee: "Rs. 2,500",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Thilini Jayasuriya",
      role: "Bike Rider",
    },
    vehicleType: "Honda Dio",
    vehicleNumber: "EP-3344",
    allocatedTime: "2:00 PM - 4:00 PM",
    parkingName: "Galle Public Parking",
    parkingSlotId: "P-008",
    fee: "Rs. 300",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Sahan Madushanka",
      role: "Three-Wheeler Driver",
    },
    vehicleType: "Bajaj RE",
    vehicleNumber: "SP-1199",
    allocatedTime: "11:00 AM - 12:30 PM",
    parkingName: "Negombo Parking Center",
    parkingSlotId: "P-055",
    fee: "Rs. 500",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Nadeesha Rajapaksha",
      role: "SUV Owner",
    },
    vehicleType: "Kia Sportage",
    vehicleNumber: "CBA-7888",
    allocatedTime: "4:00 PM - 6:00 PM",
    parkingName: "Maharagama Park Hub",
    parkingSlotId: "P-120",
    fee: "Rs. 1,800",
    status: "Active",
  },
];

export default function BookingListTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
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
                Vehicle No.
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Allocated Time
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Parking Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Slot ID
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
                Parking Fee
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={booking.user.image}
                        alt={booking.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {booking.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {booking.user.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {booking.vehicleType}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {booking.vehicleNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {booking.allocatedTime}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {booking.parkingName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {booking.parkingSlotId}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      booking.status === "Active"
                        ? "success"
                        : booking.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {booking.fee}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
