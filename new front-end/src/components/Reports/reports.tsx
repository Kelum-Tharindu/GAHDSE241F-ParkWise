import React, { useState } from "react";
import { FaFilePdf, FaDownload, FaCalendarAlt, FaCar, FaMoneyBillWave, FaParking } from "react-icons/fa";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// --- Example Data ---
const bookingsData = [
  { id: 1, user: "Kasun Perera", spot: "Lot A - 12", amount: 400, date: "2025-04-27", status: "Completed" },
  { id: 2, user: "Nimal Silva", spot: "Lot B - 3", amount: 600, date: "2025-04-28", status: "Cancelled" },
  { id: 3, user: "Saman Fernando", spot: "Lot C - 7", amount: 900, date: "2025-04-29", status: "Completed" },
];

const paymentsData = [
  { id: 1, user: "Kasun Perera", type: "Booking", amount: 400, date: "2025-04-27" },
  { id: 2, user: "Nimal Silva", type: "Payout", amount: 1500, date: "2025-04-28" },
  { id: 3, user: "Saman Fernando", type: "Booking", amount: 900, date: "2025-04-29" },
];

const spotsData = [
  { id: 1, location: "Colombo City Center", total: 50, available: 12, occupied: 38 },
  { id: 2, location: "Kandy Mall", total: 30, available: 6, occupied: 24 },
  { id: 3, location: "Galle Fort", total: 20, available: 2, occupied: 18 },
];

// --- PDF Styles ---
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  title: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
  table: { display: "flex", flexDirection: "column", width: "auto", marginBottom: 10 },
  row: { flexDirection: "row" },
  cellHeader: { fontWeight: "bold", padding: 4, backgroundColor: "#2563eb", color: "#fff", width: 100 },
  cell: { padding: 4, borderBottom: "1px solid #eee", width: 100 },
});

// --- PDF Components ---
function BookingsPDF({ data, from, to }: { data: typeof bookingsData; from: string; to: string }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Bookings Report ({from} to {to})</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>ID</Text>
            <Text style={styles.cellHeader}>User</Text>
            <Text style={styles.cellHeader}>Spot</Text>
            <Text style={styles.cellHeader}>Amount</Text>
            <Text style={styles.cellHeader}>Date</Text>
            <Text style={styles.cellHeader}>Status</Text>
          </View>
          {data.map((row) => (
            <View style={styles.row} key={row.id}>
              <Text style={styles.cell}>{row.id}</Text>
              <Text style={styles.cell}>{row.user}</Text>
              <Text style={styles.cell}>{row.spot}</Text>
              <Text style={styles.cell}>{row.amount}</Text>
              <Text style={styles.cell}>{row.date}</Text>
              <Text style={styles.cell}>{row.status}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

function PaymentsPDF({ data, from, to }: { data: typeof paymentsData; from: string; to: string }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Payments Report ({from} to {to})</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>ID</Text>
            <Text style={styles.cellHeader}>User</Text>
            <Text style={styles.cellHeader}>Type</Text>
            <Text style={styles.cellHeader}>Amount</Text>
            <Text style={styles.cellHeader}>Date</Text>
          </View>
          {data.map((row) => (
            <View style={styles.row} key={row.id}>
              <Text style={styles.cell}>{row.id}</Text>
              <Text style={styles.cell}>{row.user}</Text>
              <Text style={styles.cell}>{row.type}</Text>
              <Text style={styles.cell}>{row.amount}</Text>
              <Text style={styles.cell}>{row.date}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

function SpotsPDF({ data }: { data: typeof spotsData }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Parking Spots Report</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>ID</Text>
            <Text style={styles.cellHeader}>Location</Text>
            <Text style={styles.cellHeader}>Total</Text>
            <Text style={styles.cellHeader}>Available</Text>
            <Text style={styles.cellHeader}>Occupied</Text>
          </View>
          {data.map((row) => (
            <View style={styles.row} key={row.id}>
              <Text style={styles.cell}>{row.id}</Text>
              <Text style={styles.cell}>{row.location}</Text>
              <Text style={styles.cell}>{row.total}</Text>
              <Text style={styles.cell}>{row.available}</Text>
              <Text style={styles.cell}>{row.occupied}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

// --- Main Component ---
type ReportType = "bookings" | "payments" | "spots";

export default function AdminReportsDashboard() {
  const [report, setReport] = useState<ReportType>("bookings");
  const [from, setFrom] = useState("2025-04-27");
  const [to, setTo] = useState("2025-04-29");

  // Filter by date for bookings and payments
  const bookingsFiltered = bookingsData.filter((r) => r.date >= from && r.date <= to);
  const paymentsFiltered = paymentsData.filter((r) => r.date >= from && r.date <= to);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#181f2a] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-4xl rounded-2xl shadow-xl bg-white dark:bg-[#232b39] border border-gray-200 dark:border-[#222b3a] p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              report === "bookings"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-[#202736] text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setReport("bookings")}
          >
            <FaCar /> Bookings
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              report === "payments"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-[#202736] text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setReport("payments")}
          >
            <FaMoneyBillWave /> Payments
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              report === "spots"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-[#202736] text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setReport("spots")}
          >
            <FaParking /> Parking Spots
          </button>
        </div>

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
                "All bookings made in the selected period."}
              {report === "payments" &&
                "All payment transactions in the selected period."}
              {report === "spots" &&
                "Current status of all parking spots."}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {(report === "bookings" || report === "payments") && (
              <>
                <label className="flex items-center gap-1 text-gray-700 dark:text-gray-200 text-sm">
                  <FaCalendarAlt /> From:
                  <input
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="rounded px-2 py-1 border border-gray-300 dark:bg-[#181f2a] dark:text-white text-sm"
                  />
                </label>
                <label className="flex items-center gap-1 text-gray-700 dark:text-gray-200 text-sm">
                  <FaCalendarAlt /> To:
                  <input
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    className="rounded px-2 py-1 border border-gray-300 dark:bg-[#181f2a] dark:text-white text-sm"
                  />
                </label>
              </>
            )}
            {report === "bookings" && (
              <PDFDownloadLink
                document={<BookingsPDF data={bookingsFiltered} from={from} to={to} />}
                fileName={`bookings-report-${from}-to-${to}.pdf`}
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition"
              >
                {({ loading }) =>
                  loading ? "Preparing..." : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
            {report === "payments" && (
              <PDFDownloadLink
                document={<PaymentsPDF data={paymentsFiltered} from={from} to={to} />}
                fileName={`payments-report-${from}-to-${to}.pdf`}
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition"
              >
                {({ loading }) =>
                  loading ? "Preparing..." : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
            {report === "spots" && (
              <PDFDownloadLink
                document={<SpotsPDF data={spotsData} />}
                fileName={`parking-spots-report.pdf`}
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition"
              >
                {({ loading }) =>
                  loading ? "Preparing..." : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Tables */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#222b3a] bg-white dark:bg-[#1b2230]">
          {report === "bookings" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#222b3a] text-gray-700 dark:text-gray-200 uppercase">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Spot</th>
                  <th className="px-4 py-2 text-left">Amount (LKR)</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingsFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No bookings for selected period.
                    </td>
                  </tr>
                ) : (
                  bookingsFiltered.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 dark:border-[#222b3a] transition-all ${
                        idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-mono">{row.id}</td>
                      <td className="px-4 py-2">{row.user}</td>
                      <td className="px-4 py-2">{row.spot}</td>
                      <td className="px-4 py-2">{row.amount}</td>
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2">{row.status}</td>
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
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount (LKR)</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentsFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No payments for selected period.
                    </td>
                  </tr>
                ) : (
                  paymentsFiltered.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 dark:border-[#222b3a] transition-all ${
                        idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-mono">{row.id}</td>
                      <td className="px-4 py-2">{row.user}</td>
                      <td className="px-4 py-2">{row.type}</td>
                      <td className="px-4 py-2">{row.amount}</td>
                      <td className="px-4 py-2">{row.date}</td>
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
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Available</th>
                  <th className="px-4 py-2 text-left">Occupied</th>
                </tr>
              </thead>
              <tbody>
                {spotsData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No parking spots found.
                    </td>
                  </tr>
                ) : (
                  spotsData.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 dark:border-[#222b3a] transition-all ${
                        idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-mono">{row.id}</td>
                      <td className="px-4 py-2">{row.location}</td>
                      <td className="px-4 py-2">{row.total}</td>
                      <td className="px-4 py-2">{row.available}</td>
                      <td className="px-4 py-2">{row.occupied}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-500">
            {report === "bookings"
              ? `Showing ${bookingsFiltered.length} of ${bookingsData.length} bookings`
              : report === "payments"
              ? `Showing ${paymentsFiltered.length} of ${paymentsData.length} payments`
              : `Showing ${spotsData.length} parking locations`}
          </span>
        </div>
      </div>
    </div>
  );
}
