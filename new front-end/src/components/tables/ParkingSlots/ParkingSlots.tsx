import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../ui/table";

  import Badge from "../../ui/badge/Badge";
  
  interface ParkingArea {
    id: string;
    slotsAvailable: number;
    location: string;
    openTime: string;
    closeTime: string;
    pricePerSlot: string;
    status: string;
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
  
  export default function ParkingDetailsTable() {
    return (
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
    );
  }
  