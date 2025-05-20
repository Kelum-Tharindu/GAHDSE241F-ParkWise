import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye,
  ArrowLeft,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Banknote,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Payout {
  id: string;
  date: string;
  period: string;
  parkingName: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  method: "Bank Transfer" | "Mobile Wallet" | "Cheque";
  reference?: string;
  remarks?: string;
}

const allPayouts: Payout[] = [
  {
    id: "PAYOUT-2025-04",
    date: "2025-04-05",
    period: "Mar 2025",
    parkingName: "Colombo Fort Parking",
    amount: 120000,
    status: "Success",
    method: "Bank Transfer",
    reference: "DFCC-123456",
    remarks: "Credited to DFCC Bank",
  },
  {
    id: "PAYOUT-2025-03",
    date: "2025-03-05",
    period: "Feb 2025",
    parkingName: "Galle Face Green",
    amount: 115000,
    status: "Success",
    method: "Bank Transfer",
    reference: "BOC-789012",
    remarks: "Credited to BOC",
  },
  {
    id: "PAYOUT-2025-02",
    date: "2025-02-05",
    period: "Jan 2025",
    parkingName: "Kandy Lake Parking",
    amount: 99000,
    status: "Pending",
    method: "Mobile Wallet",
    reference: "EZCASH-998877",
    remarks: "Processing",
  },
  {
    id: "PAYOUT-2025-01",
    date: "2025-01-05",
    period: "Dec 2024",
    parkingName: "Negombo Beach Parking",
    amount: 102000,
    status: "Failed",
    method: "Cheque",
    reference: "CHQ-556677",
    remarks: "Cheque returned",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Success":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    case "Failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
  }
};

type SortKey = "date" | "amount" | "status";
type SortDirection = "asc" | "desc";

export default function LandownerPayoutsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Success" | "Pending" | "Failed">("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [viewPayout, setViewPayout] = useState<Payout | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 4;

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

  const filteredPayouts = useMemo(() => {
    let list = allPayouts;
    if (statusFilter !== "All") list = list.filter((p) => p.status === statusFilter);
    if (dateFrom) list = list.filter((p) => new Date(p.date) >= new Date(dateFrom));
    if (dateTo) list = list.filter((p) => new Date(p.date) <= new Date(dateTo));
    const lower = search.trim().toLowerCase();
    if (lower) {
      list = list.filter(
        (p) =>
          p.parkingName.toLowerCase().includes(lower) ||
          p.period.toLowerCase().includes(lower) ||
          p.id.toLowerCase().includes(lower) ||
          (p.reference && p.reference.toLowerCase().includes(lower))
      );
    }
    list = [...list].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortKey) {
        case "date":
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
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
  }, [search, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredPayouts.length / PAGE_SIZE));
  const pagedPayouts = filteredPayouts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      <div>
        <div className="max-w-full mx-auto px-2 py-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-white">Landowner Payouts</span>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-2 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                Payouts
              </span>
              {!viewPayout && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                      <Search className="text-gray-400 dark:text-gray-500" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search payouts..."
                      className="w-full sm:w-44 pl-7 pr-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
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
                    className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <div className="flex gap-1">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => {
                        setDateFrom(e.target.value);
                        setPage(1);
                      }}
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => {
                        setDateTo(e.target.value);
                        setPage(1);
                      }}
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                      placeholder="To"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="min-w-full max-w-full table-fixed text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-28"
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortKey === "date" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Period
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">
                    Parking
                  </th>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-20"
                    onClick={() => handleSort("amount")}
                  >
                    Amount{" "}
                    {sortKey === "amount" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-16"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    {sortKey === "status" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Method
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pagedPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs">
                      <div className="flex flex-col items-center justify-center">
                        <p>No payouts found.</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedPayouts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => setViewPayout(p)}
                    >
                      <td className="px-2 py-2 whitespace-nowrap">{formatDate(p.date)}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{p.period}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{p.parkingName}</td>
                      <td className="px-2 py-2 whitespace-nowrap font-semibold text-green-700 dark:text-green-400">
                        Rs.{p.amount.toLocaleString("en-LK")}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">{p.method}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewPayout(p);
                          }}
                          className="inline-flex items-center justify-center p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 transition duration-200"
                          title="View payout details"
                        >
                          <Eye size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-700 text-xs">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}-
              {Math.min(page * PAGE_SIZE, filteredPayouts.length)} of {filteredPayouts.length}
            </span>
            <div className="flex gap-1">
              <button
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={12} />
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {viewPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xs w-full mx-2 p-4 relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setViewPayout(null)}
            >
              <ArrowLeft size={14} />
            </button>
            <div className="mb-2 text-xs text-gray-400">{viewPayout.id}</div>
            <div className="text-base font-bold text-gray-900 dark:text-white mb-1">{viewPayout.parkingName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{viewPayout.period}</div>
            <div className="flex items-center gap-2 mb-2">
              {viewPayout.status === "Success" && <CheckCircle className="text-emerald-500" size={14} />}
              {viewPayout.status === "Pending" && <Clock className="text-yellow-500" size={14} />}
              {viewPayout.status === "Failed" && <XCircle className="text-red-500" size={14} />}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewPayout.status)}`}>
                {viewPayout.status}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(viewPayout.date)}</span>
            </div>
            <ul className="space-y-1 text-xs mb-2">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span className="font-semibold text-green-700 dark:text-green-400">Rs.{viewPayout.amount.toLocaleString("en-LK")}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Method</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewPayout.method}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reference</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewPayout.reference || "-"}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-600 dark:text-gray-400">Remarks</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewPayout.remarks || "-"}</span>
              </li>
            </ul>
            <button
              className="w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition duration-200"
              onClick={() => {
                const receipt = `
--- Payout Receipt ---
Payout ID: ${viewPayout.id}
Date: ${formatDate(viewPayout.date)}
Period: ${viewPayout.period}
Parking Name: ${viewPayout.parkingName}
Amount: Rs.${viewPayout.amount.toLocaleString("en-LK")}
Status: ${viewPayout.status}
Method: ${viewPayout.method}
Reference: ${viewPayout.reference || "-"}
Remarks: ${viewPayout.remarks || "-"}
--------------------------
                `.trim();
                const blob = new Blob([receipt], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `payout-${viewPayout.id}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
