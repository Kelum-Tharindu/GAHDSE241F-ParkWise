import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
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
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type SortKey = "purchaseDate" | "parkingName" | "chunkName" | "status";
type SortDirection = "asc" | "desc";

interface Chunk {
  _id: string;
  user: string;
  purchaseDate: string;
  parkingName: string;
  chunkName: string;
  company: string;
  totalSpots: number;
  usedSpots: number;
  availableSpots: number;
  validFrom: string;
  validTo: string;
  status: "Active" | "Expired" | "Full";
  remarks?: string;
  qrImage?: string;
  vehicleType: "car" | "bicycle" | "truck";
}

export default function ParkingCoordinatorChunksTable() {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Expired" | "Full">("All");
  const [companyFilter, setCompanyFilter] = useState<"All" | string>("All");
  const [viewChunk, setViewChunk] = useState<Chunk | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("purchaseDate");
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
    // Fetch chunks from backend
    axios.get("http://localhost:5000/api/bulkbooking/")
      .then(res => {
        // Defensive: ensure array or fallback to []
        if (Array.isArray(res.data)) {
          setChunks(res.data);
        } else {
          setChunks([]);
        }
      })
      .catch(() => setChunks([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  const allCompanies = Array.from(new Set(chunks.map((c) => c.company)));

  const filteredChunks = useMemo(() => {
    let list = chunks;
    if (statusFilter !== "All") list = list.filter((c) => c.status === statusFilter);
    if (companyFilter !== "All") list = list.filter((c) => c.company === companyFilter);
    const lower = search.trim().toLowerCase();
    if (lower) {
      list = list.filter(
        (c) =>
          c.parkingName.toLowerCase().includes(lower) ||
          c.chunkName.toLowerCase().includes(lower) ||
          c.company.toLowerCase().includes(lower) ||
          c._id.toLowerCase().includes(lower)
      );
    }
    list = [...list].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortKey) {
        case "purchaseDate":
          aVal = new Date(a.purchaseDate).getTime();
          bVal = new Date(b.purchaseDate).getTime();
          break;
        case "parkingName":
          aVal = a.parkingName;
          bVal = b.parkingName;
          break;
        case "chunkName":
          aVal = a.chunkName;
          bVal = b.chunkName;
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
  }, [search, statusFilter, companyFilter, sortKey, sortDir, chunks]);

  const totalPages = Math.max(1, Math.ceil(filteredChunks.length / PAGE_SIZE));
  const pagedChunks = filteredChunks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

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
      case "Active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
      case "Full":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "Expired":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Loading chunks...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <div>
        <div className="max-w-full mx-auto px-2 py-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-white">Parking Spot Chunks</span>
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
                View Chunks
              </span>
              {!viewChunk && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                      <Search className="text-gray-400 dark:text-gray-500" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search chunks..."
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
                    <option value="Active">Active</option>
                    <option value="Full">Full</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <select
                    value={companyFilter}
                    onChange={e => {
                      setCompanyFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <option value="All">All Companies</option>
                    {allCompanies.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
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
                    onClick={() => handleSort("purchaseDate")}
                  >
                    Purchased
                    {sortKey === "purchaseDate" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                    Parking
                  </th>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-36"
                    onClick={() => handleSort("chunkName")}
                  >
                    Chunk Name
                    {sortKey === "chunkName" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                    Company
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Spots
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Used
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Available
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Vehicle Type
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                    Validity
                  </th>
                  <th
                    className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none w-16"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortKey === "status" ? (sortDir === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />) : ""}
                  </th>
                  <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pagedChunks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs">
                      <div className="flex flex-col items-center justify-center">
                        <p>No chunks found.</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedChunks.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => setViewChunk(c)}
                    >
                      <td className="px-2 py-2 whitespace-nowrap">{formatDate(c.purchaseDate)}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{c.parkingName}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{c.chunkName}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{c.company}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">{c.totalSpots}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">{c.usedSpots}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">{c.availableSpots}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">{c.vehicleType}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">
                        <span className="block">{formatDate(c.validFrom)}</span>
                        <span className="block">{formatDate(c.validTo)}</span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>{c.status}</span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">
                        <Eye size={16} className="inline-block text-blue-500" />
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-center">
                        {c.qrImage ? (
                          <img src={c.qrImage} alt="QR" className="w-8 h-8 inline-block" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
              {Math.min(page * PAGE_SIZE, filteredChunks.length)} of {filteredChunks.length}
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
      {viewChunk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xs w-full mx-2 p-4 relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setViewChunk(null)}
            >
              <ArrowLeft size={14} />
            </button>
            <div className="mb-2 text-xs text-gray-400">{viewChunk._id}</div>
            <div className="text-base font-bold text-gray-900 dark:text-white mb-1">{viewChunk.parkingName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{viewChunk.chunkName}</div>
            <div className="flex items-center gap-2 mb-2">
              {viewChunk.status === "Active" && <CheckCircle className="text-emerald-500" size={14} />}
              {viewChunk.status === "Full" && <Clock className="text-yellow-500" size={14} />}
              {viewChunk.status === "Expired" && <XCircle className="text-red-500" size={14} />}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewChunk.status)}`}>{viewChunk.status}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(viewChunk.purchaseDate)}</span>
            </div>
            <ul className="space-y-1 text-xs mb-2">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Company</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewChunk.company}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Spots</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewChunk.totalSpots}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Used</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewChunk.usedSpots}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewChunk.availableSpots}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-600 dark:text-gray-400">Validity</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(viewChunk.validFrom)} to {formatDate(viewChunk.validTo)}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-600 dark:text-gray-400">Remarks</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewChunk.remarks || "-"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Vehicle Type</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewChunk.vehicleType}</span>
              </li>
              <li className="flex flex-col items-center">
                <span className="text-gray-600 dark:text-gray-400">QR Code</span>
                {viewChunk.qrImage ? (
                  <>
                    <img
                      src={viewChunk.qrImage}
                      alt="QR"
                      className="w-48 h-48 mt-2 border border-gray-300 dark:border-gray-600 rounded bg-white"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <a
                      href={viewChunk.qrImage}
                      download={`qr_${viewChunk._id}.png`}
                      className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs transition"
                    >
                      Download QR
                    </a>
                  </>
                ) : (
                  <span className="text-gray-400">No QR</span>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
