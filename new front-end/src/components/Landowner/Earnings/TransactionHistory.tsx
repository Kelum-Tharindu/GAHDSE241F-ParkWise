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
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

type TransactionType = "Credit" | "Debit";

interface Transaction {
  id: string;
  date: string;
  parkingName: string;
  description: string;
  type: TransactionType;
  amount: number;
  balance: number;
  status: "Success" | "Pending" | "Failed";
  reference?: string;
}

const allTransactions: Transaction[] = [
  {
    id: "TXN-2001",
    date: "2025-04-01T09:30:00+05:30",
    parkingName: "Colombo Fort Parking",
    description: "Monthly payout for March",
    type: "Credit",
    amount: 120000,
    balance: 340000,
    status: "Success",
    reference: "PAYOUT-MAR-2025",
  },
  {
    id: "TXN-2002",
    date: "2025-04-03T14:20:00+05:30",
    parkingName: "Kandy Lake Parking",
    description: "Refund for cancelled booking",
    type: "Debit",
    amount: 2500,
    balance: 337500,
    status: "Success",
    reference: "REFUND-BOOK-233",
  },
  {
    id: "TXN-2003",
    date: "2025-04-10T10:15:00+05:30",
    parkingName: "Galle Face Green",
    description: "Monthly payout for April",
    type: "Credit",
    amount: 135000,
    balance: 472500,
    status: "Pending",
    reference: "PAYOUT-APR-2025",
  },
  {
    id: "TXN-2004",
    date: "2025-03-15T16:40:00+05:30",
    parkingName: "Negombo Beach Parking",
    description: "Service fee",
    type: "Debit",
    amount: 1500,
    balance: 471000,
    status: "Success",
    reference: "FEE-MAR-2025",
  },
  {
    id: "TXN-2005",
    date: "2025-03-20T11:30:00+05:30",
    parkingName: "Colombo Fort Parking",
    description: "Payout failed",
    type: "Credit",
    amount: 125000,
    balance: 596000,
    status: "Failed",
    reference: "PAYOUT-FAIL",
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

type SortKey = "date" | "amount" | "type";
type SortDirection = "asc" | "desc";

function downloadReceipt(txn: Transaction) {
  // Simple text receipt (replace with PDF logic if needed)
  const receipt = `
--- Transaction Receipt ---
Transaction ID: ${txn.id}
Date: ${formatDate(txn.date)}
Parking Name: ${txn.parkingName}
Description: ${txn.description}
Type: ${txn.type}
Amount: ${txn.type === "Credit" ? "+" : "-"}Rs.${txn.amount.toLocaleString("en-LK")}
Balance After: Rs.${txn.balance.toLocaleString("en-LK")}
Status: ${txn.status}
Reference: ${txn.reference || "-"}
--------------------------
  `.trim();
  const blob = new Blob([receipt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${txn.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function LandownerTransactionHistory() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [viewTxn, setViewTxn] = useState<Transaction | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("date");
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

  const filteredTxns = useMemo(() => {
    let list = allTransactions;
    if (typeFilter !== "All") list = list.filter((t) => t.type === typeFilter);
    if (dateFrom) list = list.filter((t) => new Date(t.date) >= new Date(dateFrom));
    if (dateTo) list = list.filter((t) => new Date(t.date) <= new Date(dateTo));
    const lower = search.trim().toLowerCase();
    if (lower) {
      list = list.filter(
        (t) =>
          t.parkingName.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.id.toLowerCase().includes(lower) ||
          (t.reference && t.reference.toLowerCase().includes(lower))
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
        case "type":
          aVal = a.type;
          bVal = b.type;
          break;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, typeFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredTxns.length / PAGE_SIZE));
  const pagedTxns = filteredTxns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            <span className="text-lg font-bold text-white">Transaction History</span>
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
                Transactions
              </span>
              {!viewTxn && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                      <Search className="text-gray-400 dark:text-gray-500" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="w-full sm:w-44 pl-7 pr-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    value={typeFilter}
                    onChange={e => {
                      setTypeFilter(e.target.value as typeof typeFilter);
                      setPage(1);
                    }}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <option value="All">All Types</option>
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
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
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-32"
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortKey === "date" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">Parking</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">Description</th>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-20"
                    onClick={() => handleSort("type")}
                  >
                    Type{" "}
                    {sortKey === "type" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-24"
                    onClick={() => handleSort("amount")}
                  >
                    Amount{" "}
                    {sortKey === "amount" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Status</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Balance</th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pagedTxns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs">
                      <div className="flex flex-col items-center justify-center">
                        <p>No transactions found.</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedTxns.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => setViewTxn(txn)}
                    >
                      <td className="px-2 py-2 whitespace-nowrap">{formatDate(txn.date)}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{txn.parkingName}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{txn.description}</td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-medium ${txn.type === "Credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {txn.type === "Credit" ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`font-medium ${txn.type === "Credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {txn.type === "Credit" ? "+" : "-"}Rs.{txn.amount.toLocaleString("en-LK")}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">Rs.{txn.balance.toLocaleString("en-LK")}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewTxn(txn);
                          }}
                          className="inline-flex items-center justify-center p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 transition duration-200"
                          title="View transaction details"
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
              {Math.min(page * PAGE_SIZE, filteredTxns.length)} of {filteredTxns.length}
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
      {viewTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xs w-full mx-2 p-4 relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setViewTxn(null)}
            >
              <ArrowLeft size={14} />
            </button>
            <div className="mb-2 text-xs text-gray-400">{viewTxn.id}</div>
            <div className="text-base font-bold text-gray-900 dark:text-white mb-1">{viewTxn.parkingName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{viewTxn.description}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewTxn.status)}`}>
                {viewTxn.status}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(viewTxn.date)}</span>
            </div>
            <ul className="space-y-1 text-xs mb-2">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                  {viewTxn.type === "Credit" ? (
                    <ArrowDownCircle className="text-green-500" size={14} />
                  ) : (
                    <ArrowUpCircle className="text-red-500" size={14} />
                  )}
                  {viewTxn.type}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span className={`font-medium ${viewTxn.type === "Credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {viewTxn.type === "Credit" ? "+" : "-"}Rs.{viewTxn.amount.toLocaleString("en-LK")}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Balance After</span>
                <span className="font-medium text-gray-900 dark:text-white">Rs.{viewTxn.balance.toLocaleString("en-LK")}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reference</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewTxn.reference || "-"}</span>
              </li>
            </ul>
            <button
              className="w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition duration-200"
              onClick={() => downloadReceipt(viewTxn)}
            >
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
