import React, { useState, useEffect } from "react";
import { 
  FaFilePdf, FaDownload, FaCalendarAlt, FaCar, FaMoneyBillWave, 
  FaParking, FaChartBar, FaFilter, FaSearch, FaMapMarkerAlt, FaUserAlt
} from "react-icons/fa";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Example Data ---
const paymentsData = [
  { id: 1, user: "Kasun Perera", type: "Booking", amount: 400, date: "2025-04-27", method: "Credit Card" },
  { id: 2, user: "Nimal Silva", type: "Payout", amount: 1500, date: "2025-04-28", method: "Bank Transfer" },
  { id: 3, user: "Saman Fernando", type: "Booking", amount: 900, date: "2025-04-29", method: "PayPal" },
  { id: 4, user: "Priya Mendis", type: "Booking", amount: 300, date: "2025-04-30", method: "Credit Card" },
  { id: 5, user: "Lakmal Perera", type: "Booking", amount: 750, date: "2025-05-01", method: "Mobile Payment" },
  { id: 6, user: "Chamari Silva", type: "Payout", amount: 2000, date: "2025-05-02", method: "Bank Transfer" },
];

const spotsData = [
  { id: 1, location: "Colombo City Center", total: 50, available: 12, occupied: 38, hourlyRate: 200, coordinates: "6.9271° N, 79.8612° E" },
  { id: 2, location: "Kandy Mall", total: 30, available: 6, occupied: 24, hourlyRate: 150, coordinates: "7.2906° N, 80.6337° E" },
  { id: 3, location: "Galle Fort", total: 20, available: 2, occupied: 18, hourlyRate: 180, coordinates: "6.0328° N, 80.2170° E" },
  { id: 4, location: "Negombo Beach", total: 25, available: 15, occupied: 10, hourlyRate: 120, coordinates: "7.2095° N, 79.8417° E" },
  { id: 5, location: "Ella Town Center", total: 15, available: 3, occupied: 12, hourlyRate: 100, coordinates: "6.8667° N, 81.0466° E" },
];

// --- PDF Styles ---
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 10, fontWeight: "bold", color: "#2563eb", textAlign: 'center' },
  subtitle: { fontSize: 14, marginBottom: 20, color: "#64748b", textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, marginBottom: 10, fontWeight: "bold", color: "#334155", borderBottom: '1px solid #e2e8f0', paddingBottom: 5 },
  table: { display: "flex", flexDirection: "column", width: "auto", marginBottom: 20, borderRadius: 5 },
  row: { flexDirection: "row", borderBottom: "1px solid #e2e8f0" },
  cellHeader: { fontWeight: "bold", padding: 8, backgroundColor: "#2563eb", color: "#fff", flex: 1, textAlign: 'center' },
  cell: { padding: 8, flex: 1, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#94a3b8', fontSize: 10, borderTop: '1px solid #e2e8f0', paddingTop: 10 },
  summary: { marginBottom: 20, padding: 10, backgroundColor: '#f1f5f9', borderRadius: 5 },
  summaryRow: { flexDirection: 'row', marginBottom: 5 },
  summaryLabel: { flex: 1, fontWeight: 'bold', color: '#334155' },
  summaryValue: { flex: 1, color: '#334155' },
  logo: { width: 50, height: 50, marginBottom: 10, alignSelf: 'center' },
});

// --- PDF Components ---
function BookingsPDF({ data, from, to, summary }: { data: BookingRow[]; from: string; to: string; summary: { total: number; completed: number; cancelled: number; active: number; } }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Bookings Report</Text>
        <Text style={styles.subtitle}>Period: {from} to {to}</Text>
        
        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Bookings:</Text>
            <Text style={styles.summaryValue}>{summary.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active Bookings:</Text>
            <Text style={styles.summaryValue}>{summary.active}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed Bookings:</Text>
            <Text style={styles.summaryValue}>{summary.completed}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cancelled Bookings:</Text>
            <Text style={styles.summaryValue}>{summary.cancelled}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Bookings</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>Booking ID</Text>
              <Text style={styles.cellHeader}>Parking Name</Text>
              <Text style={styles.cellHeader}>User Name</Text>
              <Text style={styles.cellHeader}>Vehicle Type</Text>
              <Text style={styles.cellHeader}>Booking State</Text>
              <Text style={styles.cellHeader}>Total Duration</Text>
              <Text style={styles.cellHeader}>Date</Text>
            </View>
            {data.map((row) => (
              <View style={styles.row} key={row.bookingId}>
                <Text style={styles.cell}>{row.bookingId}</Text>
                <Text style={styles.cell}>{row.parkingName}</Text>
                <Text style={styles.cell}>{row.userName}</Text>
                <Text style={styles.cell}>{row.vehicleType}</Text>
                <Text style={styles.cell}>{row.bookingState}</Text>
                <Text style={styles.cell}>{row.totalDuration}</Text>
                <Text style={styles.cell}>{row.Date}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()} by ParkEasy Admin Dashboard</Text>
      </Page>
    </Document>
  );
}

function PaymentsPDF({ data, from, to, summary }: { data: typeof paymentsData; from: string; to: string; summary: { total: number; income: number; payouts: number; net: number; } }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Payments Report</Text>
        <Text style={styles.subtitle}>Period: {from} to {to}</Text>
        
        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Transactions:</Text>
            <Text style={styles.summaryValue}>{summary.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Income:</Text>
            <Text style={styles.summaryValue}>LKR {summary.income}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Payouts:</Text>
            <Text style={styles.summaryValue}>LKR {summary.payouts}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net Balance:</Text>
            <Text style={styles.summaryValue}>LKR {summary.net}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>ID</Text>
              <Text style={styles.cellHeader}>User</Text>
              <Text style={styles.cellHeader}>Type</Text>
              <Text style={styles.cellHeader}>Method</Text>
              <Text style={styles.cellHeader}>Amount</Text>
              <Text style={styles.cellHeader}>Date</Text>
            </View>
            {data.map((row) => (
              <View style={styles.row} key={row.id}>
                <Text style={styles.cell}>{row.id}</Text>
                <Text style={styles.cell}>{row.user}</Text>
                <Text style={styles.cell}>{row.type}</Text>
                <Text style={styles.cell}>{row.method}</Text>
                <Text style={styles.cell}>{row.amount}</Text>
                <Text style={styles.cell}>{row.date}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()} by ParkEasy Admin Dashboard</Text>
      </Page>
    </Document>
  );
}

function SpotsPDF({ data, summary }: { data: typeof spotsData; summary: { locations: number; totalSpots: number; availableSpots: number; occupancyRate: number; } }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Parking Spots Report</Text>
        <Text style={styles.subtitle}>Current Status Overview</Text>
        
        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Locations:</Text>
            <Text style={styles.summaryValue}>{summary.locations}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Spots:</Text>
            <Text style={styles.summaryValue}>{summary.totalSpots}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Available Spots:</Text>
            <Text style={styles.summaryValue}>{summary.availableSpots}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Occupancy Rate:</Text>
            <Text style={styles.summaryValue}>{summary.occupancyRate}%</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>ID</Text>
              <Text style={styles.cellHeader}>Location</Text>
              <Text style={styles.cellHeader}>Total</Text>
              <Text style={styles.cellHeader}>Available</Text>
              <Text style={styles.cellHeader}>Occupied</Text>
              <Text style={styles.cellHeader}>Rate/hr</Text>
            </View>
            {data.map((row) => (
              <View style={styles.row} key={row.id}>
                <Text style={styles.cell}>{row.id}</Text>
                <Text style={styles.cell}>{row.location}</Text>
                <Text style={styles.cell}>{row.total}</Text>
                <Text style={styles.cell}>{row.available}</Text>
                <Text style={styles.cell}>{row.occupied}</Text>
                <Text style={styles.cell}>{row.hourlyRate}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()} by ParkEasy Admin Dashboard</Text>
      </Page>
    </Document>
  );
}

// --- Define BookingRow type for backend data
interface BookingRow {
  bookingId: string;
  parkingName: string;
  userName: string;
  vehicleType: string;
  bookingState: string;
  totalDuration: string;
  Date: string;
}


// --- Main Component ---
type ReportType = "bookings" | "payments" | "spots";

export default function AdminReportsDashboard() {
  const [report, setReport] = useState<ReportType>("bookings");
  const [from, setFrom] = useState("2025-04-27");
  const [to, setTo] = useState("2025-05-02");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [showCharts, setShowCharts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
    };
    
    loadData();
  }, [report, from, to]);
  // Fetch bookings from backend on mount or when report changes to 'bookings'
  useEffect(() => {
    if (report !== 'bookings') return;
    setIsLoading(true);
    fetch('http://localhost:5000/api/bookings/booking-details')
      .then(res => res.json())
      .then(data => {
        console.log('Bookings API response (raw):', data);
        if (Array.isArray(data)) {
          console.log('Bookings data is an array with length:', data.length);
          console.log('First booking item example:', data.length > 0 ? data[0] : 'No items');
          setBookings(data);
          console.log('Bookings set in state:', data);
        } else {
          console.error('Bookings API did not return an array:', data);
          setBookings([]);
        }
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      })
      .finally(() => setIsLoading(false));  }, [report]);
  // Filter data based on search and filters
  const filteredBookings = bookings.filter(booking => {
    // Debug logging for each booking item
    console.log('Checking booking item:', booking);
    
    // Convert date strings to Date objects for proper comparison
    let bookingDate = booking.Date;
    // If bookingDate is a string, try to convert it to a comparable format
    try {
      if (typeof bookingDate === 'string') {
        // Format will depend on your backend implementation
        bookingDate = new Date(bookingDate).toISOString().split('T')[0];
      }
      console.log('Parsed booking date:', bookingDate, 'comparing with', from, 'and', to);
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    
    const dateFilter = (!from || !to || !bookingDate) ? true : (bookingDate >= from && bookingDate <= to);
    const searchFilter = (searchTerm === "" || 
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.parkingName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusFilterResult = (statusFilter === "all" || booking.bookingState?.toLowerCase() === statusFilter.toLowerCase());
    const vehicleFilterResult = (vehicleFilter === "all" || booking.vehicleType === vehicleFilter);
    
    // Log filter results for debugging
    if (!dateFilter || !searchFilter || !statusFilterResult || !vehicleFilterResult) {
      console.log('Booking filtered out:', {
        booking,
        bookingDate,
        fromDate: from,
        toDate: to,
        dateFilter,
        searchFilter,
        statusFilterResult,
        vehicleFilterResult
      });
    }
    
    return dateFilter && searchFilter && statusFilterResult && vehicleFilterResult;
  });
  
  // Log final filtered bookings
  console.log('Final filtered bookings for table:', filteredBookings);

  const filteredPayments = paymentsData.filter(payment => 
    (payment.date >= from && payment.date <= to) &&
    (searchTerm === "" || 
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (paymentMethodFilter === "all" || payment.method === paymentMethodFilter)
  );

  const filteredSpots = spotsData.filter(spot =>
    searchTerm === "" || 
    spot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calculate summaries for PDF reports
  const bookingsSummary = {
    total: filteredBookings.length,
    completed: filteredBookings.filter(b => b.bookingState?.toLowerCase() === "completed").length,
    cancelled: filteredBookings.filter(b => b.bookingState?.toLowerCase() === "cancelled").length,
    active: filteredBookings.filter(b => b.bookingState?.toLowerCase() === "active" || b.bookingState?.toLowerCase() === "pending").length
  };

  const paymentsSummary = {
    total: filteredPayments.length,
    income: filteredPayments.filter(p => p.type === "Booking").reduce((sum, p) => sum + p.amount, 0),
    payouts: filteredPayments.filter(p => p.type === "Payout").reduce((sum, p) => sum + p.amount, 0),
    net: filteredPayments.reduce((sum, p) => p.type === "Booking" ? sum + p.amount : sum - p.amount, 0)
  };

  const spotsSummary = {
    locations: filteredSpots.length,
    totalSpots: filteredSpots.reduce((sum, s) => sum + s.total, 0),
    availableSpots: filteredSpots.reduce((sum, s) => sum + s.available, 0),
    occupancyRate: Math.round(filteredSpots.reduce((sum, s) => sum + s.occupied, 0) / 
      filteredSpots.reduce((sum, s) => sum + s.total, 0) * 100)
  };
  // Chart data
  const bookingsChartData = {
    labels: ['Completed', 'Cancelled', 'Active'],
    datasets: [
      {
        label: 'Bookings by State',
        data: [
          filteredBookings.filter(b => b.bookingState?.toLowerCase() === "completed").length,
          filteredBookings.filter(b => b.bookingState?.toLowerCase() === "cancelled").length,
          filteredBookings.filter(b => b.bookingState?.toLowerCase() === "active" || b.bookingState?.toLowerCase() === "pending").length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const paymentsChartData = {
    labels: ['Bookings', 'Payouts'],
    datasets: [
      {
        label: 'Transaction Amounts',
        data: [
          filteredPayments.filter(p => p.type === "Booking").reduce((sum, p) => sum + p.amount, 0),
          filteredPayments.filter(p => p.type === "Payout").reduce((sum, p) => sum + p.amount, 0)
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const spotsChartData = {
    labels: filteredSpots.map(spot => spot.location),
    datasets: [
      {
        label: 'Available',
        data: filteredSpots.map(spot => spot.available),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Occupied',
        data: filteredSpots.map(spot => spot.occupied),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-[#181f2a] dark:to-[#0f172a] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-6xl rounded-2xl shadow-xl bg-white dark:bg-[#232b39] border border-gray-200 dark:border-[#222b3a] p-8 transition-all">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              ParkEasy Admin Reports
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Generate detailed reports and analytics for your parking business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCharts(!showCharts)}
              className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
            >
              <FaChartBar className="inline mr-1" /> {showCharts ? 'Hide Charts' : 'Show Charts'}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              report === "bookings"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-[#202736] text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#2a3548]"
            }`}
            onClick={() => setReport("bookings")}
          >
            <FaCar /> Bookings
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              report === "payments"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-[#202736] text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#2a3548]"
            }`}
            onClick={() => setReport("payments")}
          >
            <FaMoneyBillWave /> Payments
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              report === "spots"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-[#202736] text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#2a3548]"
            }`}
            onClick={() => setReport("spots")}
          >
            <FaParking /> Parking Spots
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 dark:bg-[#1b2230] rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#181f2a] dark:text-white"
              />
            </div>
            
            {(report === "bookings" || report === "payments") && (
              <div className="flex flex-wrap gap-2 items-center">
                <label className="flex items-center gap-1 text-gray-700 dark:text-gray-200 text-sm whitespace-nowrap">
                  <FaCalendarAlt /> From:
                  <input
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="rounded px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-[#181f2a] dark:text-white text-sm"
                  />
                </label>
                <label className="flex items-center gap-1 text-gray-700 dark:text-gray-200 text-sm whitespace-nowrap">
                  <FaCalendarAlt /> To:
                  <input
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    className="rounded px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-[#181f2a] dark:text-white text-sm"
                  />
                </label>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 items-center">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              
              {report === "bookings" && (
                <>                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="rounded px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-[#181f2a] dark:text-white text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  
                  <select 
                    value={vehicleFilter} 
                    onChange={e => setVehicleFilter(e.target.value)}
                    className="rounded px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-[#181f2a] dark:text-white text-sm"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </>
              )}
              
              {report === "payments" && (
                <select 
                  value={paymentMethodFilter} 
                  onChange={e => setPaymentMethodFilter(e.target.value)}
                  className="rounded px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-[#181f2a] dark:text-white text-sm"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {report === "bookings" && (
            <>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{bookingsSummary.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaCar className="text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {bookingsSummary.completed} completed, {bookingsSummary.active} active, {bookingsSummary.cancelled} cancelled
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Bookings</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{bookingsSummary.active}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FaCar className="text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Currently active or pending bookings
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed Bookings</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{bookingsSummary.completed}</p>
                  </div>
                  <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                    <FaCar className="text-teal-600 dark:text-teal-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Successfully completed bookings
                </div>
              </div>
            </>
          )}
          
          {report === "payments" && (
            <>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">LKR {paymentsSummary.income}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FaMoneyBillWave className="text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  From booking payments
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Payouts</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">LKR {paymentsSummary.payouts}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <FaMoneyBillWave className="text-red-600 dark:text-red-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Outgoing payments
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Net Balance</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">LKR {paymentsSummary.net}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaMoneyBillWave className="text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Income minus payouts
                </div>
              </div>
            </>
          )}
          
          {report === "spots" && (
            <>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Spots</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{spotsSummary.totalSpots}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaParking className="text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Across {spotsSummary.locations} locations
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available Spots</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{spotsSummary.availableSpots}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FaParking className="text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Ready for booking
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{spotsSummary.occupancyRate}%</p>
                  </div>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <FaMapMarkerAlt className="text-yellow-600 dark:text-yellow-300" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Current utilization
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        {showCharts && (
          <div className="mb-6">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {report === "bookings" ? "Bookings by Status" : 
                 report === "payments" ? "Transaction Overview" : 
                 "Parking Spots Availability"}
              </h3>
              
              <div className="h-64">
                {report === "bookings" && (
                  <div className="flex justify-center">
                    <div className="w-64 h-64">
                      <Pie data={bookingsChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </div>
                )}
                
                {report === "payments" && (
                  <div className="flex justify-center">
                    <div className="w-64 h-64">
                      <Pie data={paymentsChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </div>
                )}
                
                {report === "spots" && (
                  <Bar 
                    data={spotsChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          stacked: false
                        },
                        x: {
                          stacked: false
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaFilePdf className="text-blue-600" />
              {report === "bookings"
                ? "Bookings Report"
                : report === "payments"
                ? "Payments Report"
                : "Parking Spots Report"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {report === "bookings" &&
                `Showing ${filteredBookings.length} bookings from ${from} to ${to}`}
              {report === "payments" &&
                `Showing ${filteredPayments.length} transactions from ${from} to ${to}`}
              {report === "spots" &&
                `Showing ${filteredSpots.length} parking locations`}
            </p>
          </div>
          
          <div>
            {report === "bookings" && (
              <PDFDownloadLink
                document={<BookingsPDF data={filteredBookings} from={from} to={to} summary={bookingsSummary} />}
                fileName={`bookings-report-${from}-to-${to}.pdf`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition shadow-md"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
            
            {report === "payments" && (
              <PDFDownloadLink
                document={<PaymentsPDF data={filteredPayments} from={from} to={to} summary={paymentsSummary} />}
                fileName={`payments-report-${from}-to-${to}.pdf`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition shadow-md"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
            
            {report === "spots" && (
              <PDFDownloadLink
                document={<SpotsPDF data={filteredSpots} summary={spotsSummary} />}
                fileName={`parking-spots-report.pdf`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition shadow-md"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Tables with loading state */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#222b3a] bg-white dark:bg-[#1b2230] relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {report === "bookings" && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#222b3a] text-gray-700 dark:text-gray-200 uppercase">
                      <th className="px-4 py-3 text-left">Booking ID</th>
                      <th className="px-4 py-3 text-left">Parking Name</th>
                      <th className="px-4 py-3 text-left">User Name</th>
                      <th className="px-4 py-3 text-left">Vehicle Type</th>
                      <th className="px-4 py-3 text-left">Booking State</th>
                      <th className="px-4 py-3 text-left">Total Duration</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                          No bookings for selected period or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((row, idx) => (
                        <tr
                          key={row.bookingId}
                          className={`border-b border-gray-100 dark:border-[#222b3a] transition-all hover:bg-blue-50 dark:hover:bg-[#1e2a3d] ${
                            idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-mono">{row.bookingId}</td>
                          <td className="px-4 py-3">{row.parkingName}</td>
                          <td className="px-4 py-3">{row.userName}</td>
                          <td className="px-4 py-3">{row.vehicleType}</td>
                          <td className="px-4 py-3">{row.bookingState}</td>
                          <td className="px-4 py-3">{row.totalDuration}</td>
                          <td className="px-4 py-3">{row.Date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              
              {report === "payments" && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#222b3a] text-gray-700 dark:text-gray-200 uppercase">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Method</th>
                      <th className="px-4 py-3 text-left">Amount (LKR)</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                          No payments for selected period or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={`border-b border-gray-100 dark:border-[#222b3a] transition-all hover:bg-blue-50 dark:hover:bg-[#1e2a3d] ${
                            idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-mono">{row.id}</td>
                          <td className="px-4 py-3">{row.user}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              row.type === "Booking" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                              "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            }`}>
                              {row.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">{row.method}</td>
                          <td className="px-4 py-3">{row.amount}</td>
                          <td className="px-4 py-3">{row.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              
              {report === "spots" && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#222b3a] text-gray-700 dark:text-gray-200 uppercase">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Location</th>
                      <th className="px-4 py-3 text-left">Coordinates</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Available</th>
                      <th className="px-4 py-3 text-left">Occupied</th>
                      <th className="px-4 py-3 text-left">Rate/hr (LKR)</th>
                      <th className="px-4 py-3 text-left">Occupancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpots.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                          No parking spots found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredSpots.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={`border-b border-gray-100 dark:border-[#222b3a] transition-all hover:bg-blue-50 dark:hover:bg-[#1e2a3d] ${
                            idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-mono">{row.id}</td>
                          <td className="px-4 py-3">{row.location}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{row.coordinates}</td>
                          <td className="px-4 py-3">{row.total}</td>
                          <td className="px-4 py-3">{row.available}</td>
                          <td className="px-4 py-3">{row.occupied}</td>
                          <td className="px-4 py-3">{row.hourlyRate}</td>
                          <td className="px-4 py-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  (row.occupied / row.total) > 0.8 ? "bg-red-600" : 
                                  (row.occupied / row.total) > 0.5 ? "bg-yellow-500" : 
                                  "bg-green-500"
                                }`} 
                                style={{ width: `${(row.occupied / row.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {Math.round((row.occupied / row.total) * 100)}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {report === "bookings"
              ? `Showing ${filteredBookings.length} of ${bookings.length} bookings`
              : report === "payments"
              ? `Showing ${filteredPayments.length} of ${paymentsData.length} payments`
              : `Showing ${filteredSpots.length} of ${spotsData.length} parking locations`}
          </span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
