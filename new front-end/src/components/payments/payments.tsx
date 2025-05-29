import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCar,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaParking,
  FaClock,
} from "react-icons/fa";
import "./styles.css"; // Import the animation styles

// Types for transaction
interface BookingRef {
  spot?: string;
  location?: string;
}
interface BillingRef {
  spaces?: number;
  location?: string;
}
interface Transaction {
  _id: string;
  type: string;
  bookingId?: BookingRef;
  billingId?: BillingRef;
  amount: number;
  method: string;
  status: string;
  date: string;
  spot?: string;
  spaces?: number;
  location?: string;
  landownerName?: string; // Add landownerName field from admin transactions
}

function formatLKR(amount: number) {
  return "LKR " + amount.toLocaleString("en-LK");
}

function StatusChip({ status, onClick }: { status: string, onClick?: () => void }) {
  const color =
    status === "Completed" || status === "Paid"
      ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400"
      : status === "Pending"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-400"
      : "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400";
  const icon =
    status === "Completed" || status === "Paid" ? (
      <FaCheckCircle className="mr-1" />
    ) : status === "Pending" ? (
      <FaClock className="mr-1" />
    ) : (
      <FaTimesCircle className="mr-1" />
    );  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color} cursor-pointer select-none transition-all hover:scale-105 hover:shadow-sm`}
      onClick={onClick}
    >
      {icon}
      {status}
    </span>
  );
}

function PaymentForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [landowners, setLandowners] = useState<{ _id: string; username: string }[]>([]);
  const [landownerId, setLandownerId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[PaymentForm] Fetching landowners from /api/landowners/all");
    fetch('http://localhost:5000/api/landowners/all', { credentials: 'include' })
      .then((res) => {
        console.log("[PaymentForm] Response status for landowners:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[PaymentForm] Landowners data received:", data);
        setLandowners(data);
      })
      .catch((err) => {
        console.log("[PaymentForm] Error fetching landowners:", err);
        setLandowners([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        type: "admin",
        LandOwnerID: landownerId,
        amount: Number(amount),
        method,
        status,
        date: new Date(),
      };
      console.log("[PaymentForm] Sending payment payload:", payload);
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      console.log("[PaymentForm] Payment response status:", res.status);
      const resData = await res.json().catch(() => undefined);
      console.log("[PaymentForm] Payment response data:", resData);
      if (!res.ok) throw new Error("Failed to save transaction");
      onSuccess();
      onClose();
    } catch (err) {
      console.log("[PaymentForm] Error during payment:", err);
      setError("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setStatus("Cancelled");
    setLoading(true);
    setError("");
    try {
      const payload = {
        type: "billing",
        amount: Number(amount),
        method,
        status: "Cancelled",
        billingId: landownerId,
        date: new Date(),
      };
      console.log("[PaymentForm] Sending cancel payload:", payload);
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      console.log("[PaymentForm] Cancel response status:", res.status);
      const resData = await res.json().catch(() => undefined);
      console.log("[PaymentForm] Cancel response data:", resData);
      if (!res.ok) throw new Error("Failed to save transaction");
      onSuccess();
      onClose();
    } catch (err) {
      console.log("[PaymentForm] Error during cancel:", err);
      setError("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form className="bg-white dark:bg-[#232b39] rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200 dark:border-[#444c5e] relative" onSubmit={handleSubmit}>
        {/* Close button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl focus:outline-none"
        >
          <FaTimesCircle />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Pay Landowner</h2>
        <div className="mb-4 text-left">
          <label htmlFor="landowner" className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Landowner</label>
          <select
            id="landowner"
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-[#232b39] text-gray-900 dark:text-white border-gray-200 dark:border-[#444c5e] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={landownerId}
            onChange={(e) => setLandownerId(e.target.value)}
            required
          >
            <option value="" className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">Select Landowner</option>
            {landowners.map((l) => (
              <option key={l._id} value={l._id} className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">{l.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="amount" className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Amount</label>
          <input id="amount" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-[#232b39] text-gray-900 dark:text-white border-gray-200 dark:border-[#444c5e] focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="method" className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Method</label>
          <select
            id="method"
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-[#232b39] text-gray-900 dark:text-white border-gray-200 dark:border-[#444c5e] focus:outline-none focus:ring-2 focus:ring-blue-400 transition appearance-none"
            value={method}
            onChange={e => setMethod(e.target.value)}
            required
            style={{
              backgroundColor: 'var(--tw-bg-opacity,1) #f9fafb',
              color: 'var(--tw-text-opacity,1) #111827',
            }}
          >
            <option value="" className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">Select Method</option>
            <option value="card" className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">Card</option>
            <option value="Bank Transfer" className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">Bank Transfer</option>
            <option value="check" className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">Check</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-4 justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition
              bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800
              text-white dark:from-green-700 dark:to-green-900 dark:hover:from-green-800 dark:hover:to-green-950 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <FaCheckCircle className="text-lg" />
            {loading ? "Paying..." : "Pay Now"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition
              bg-gradient-to-r from-gray-400 to-gray-600 hover:from-red-500 hover:to-red-700
              text-white dark:from-red-700 dark:to-red-900 dark:hover:from-red-800 dark:hover:to-red-950 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FaTimesCircle className="text-lg" />
            Cancel
          </button>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ml-2
    ${status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" :
      status === "Pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" :
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"}`}
          >
            {status === "Completed" ? <FaCheckCircle className="mr-1" /> :
              status === "Pending" ? <FaClock className="mr-1" /> :
              <FaTimesCircle className="mr-1" />}
            {status}
          </span>
        </div>
      </form>
    </div>
  );
}

export default function PaymentTables() {
  const [showCustomers, setShowCustomers] = useState(true);
  const [filter, setFilter] = useState("");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    console.log('[PaymentTables] Fetching transactions from /api/transactions');

    fetch('http://localhost:5000/api/transactions', { credentials: 'include' })
      .then((res) => {
        console.log('[PaymentTables] Response status:', res.status);
        return res.json();
      })
      .then((data: Transaction[]) => {
        console.log('[PaymentTables] Transactions data received:', data);
        setAllTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('[PaymentTables] Error fetching transactions:', err);
        setLoading(false);
      });
  }, [tableRefreshKey]);

  // Filtered data
  let currentData: Transaction[] = [];
  if (showCustomers) {
    currentData = allTransactions.filter((t) => t.type === "booking" || t.type === "billing");
  } else {
    currentData = allTransactions.filter((t) => t.type === "admin");
  }
  const filteredData = currentData.filter((p) =>
    Object.values(p)
      .map(String)
      .some((value) => value.toLowerCase().includes(filter.toLowerCase()))
  );
  const totalAmount = currentData.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Add handler for status update
  const handleStatusChange = (id: string, newStatus: string) => {
    setStatusDropdownId(null);
    setLoading(true);
    fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(() => setTableRefreshKey((k) => k + 1))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#181f2a] dark:to-[#232b39] py-8 px-2 flex flex-col items-center">
      {/* Toggle */}
      <div className="flex items-center justify-center mb-8">
        <span
          className={`mr-3 text-sm font-semibold transition-colors ${
            showCustomers ? "text-gray-900 dark:text-white" : "text-gray-400"
          }`}
        >
          User
        </span>
        <button
          className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none bg-gray-200 dark:bg-[#222b3a]"
          style={{
            background: showCustomers ? "#2563eb" : "#222b3a",
            border: "2px solid #2563eb",
          }}
          aria-label="Toggle payments view"
          onClick={() => setShowCustomers((v) => !v)}
        >
          <span
            className="absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
            style={{
              transform: showCustomers
                ? "translateX(0)"
                : "translateX(28px)",
            }}
          />
        </button>
        <span
          className={`ml-3 text-sm font-semibold transition-colors ${
            !showCustomers ? "text-gray-900 dark:text-white" : "text-gray-400"
          }`}
        >
          Landowner
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl rounded-xl shadow-lg bg-white/90 dark:bg-[#232b39] border border-gray-200 dark:border-[#222b3a] p-5">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-gray-200 dark:bg-[#222b3a] text-gray-700 dark:text-white rounded-full w-8 h-8 text-base shadow">
              {showCustomers ? <FaUser /> : <FaCar />}
            </span>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {showCustomers ? "Customer Payments" : "Landowner Payments"}
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400">
                Total {showCustomers ? "Payments" : "Payouts"}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {formatLKR(totalAmount)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400">Transactions</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {currentData.length}
              </span>
            </div>
            {!showCustomers && (
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition
                  bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
                  text-white dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowPaymentModal(true)}
              >
                <FaMoneyBillWave className="text-lg" />
                Pay Landowner
              </button>
            )}
          </div>
        </div>        {/* Search */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400 text-xs" />
          </div>
          <input
            type="text"
            placeholder={`Search ${showCustomers ? "users" : "landowners"}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-[#222b3a] bg-gray-50 dark:bg-[#1b2230] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          />
          {filter && (
            <button 
              onClick={() => setFilter("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimesCircle className="text-xs" />
            </button>
          )}
        </div>{/* Table */}
        <div className="overflow-x-auto rounded-lg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-2"></div>
              <p>Loading transactions...</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-[#1b2230]">
                <tr className="text-gray-700 dark:text-gray-200 uppercase">
                  <th className="px-2 py-2 text-left">ID</th>
                  <th className="px-2 py-2 text-left">
                    <FaCalendarAlt className="inline mr-1" /> Date
                  </th>
                  <th className="px-2 py-2 text-left">
                    <FaMoneyBillWave className="inline mr-1" /> Amount
                  </th>
                  <th className="px-2 py-2 text-left">Method</th>
                  {showCustomers ? (
                    <>
                      <th className="px-2 py-2 text-left">
                        <FaMapMarkerAlt className="inline mr-1" /> Location
                      </th>
                      <th className="px-2 py-2 text-left">
                        <FaParking className="inline mr-1" /> Spot/Spaces
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-2 py-2 text-left">Landowner</th>
                    </>
                  )}
                  <th className="px-2 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showCustomers ? 7 : 6}
                      className="px-2 py-8 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <FaMoneyBillWave className="text-2xl mb-2 text-gray-400 dark:text-gray-500" />
                        <p className="mb-1 font-medium">No {showCustomers ? "customer" : "landowner"} payments found</p>
                        <p className="text-xs">
                          {filter ? 
                            "Try changing your search criteria" : 
                            showCustomers ? 
                              "Customer transactions will appear here" : 
                              "Landowner payouts will appear here"
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (                  filteredData.map((payment, idx) => (                    
                    <tr
                      key={payment._id}
                      className={`border-b border-gray-100 dark:border-[#222b3a] transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 animate-fadeIn ${
                        idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="px-2 py-2 font-mono">{payment._id}</td>
                      <td className="px-2 py-2">
                        {payment.date ? payment.date.slice(0, 10) : "-"}
                      </td>
                      <td className="px-2 py-2 font-semibold">
                        {formatLKR(payment.amount)}
                      </td>
                      <td className="px-2 py-2">{payment.method}</td>
                      {showCustomers ? (
                        <>
                          <td className="px-2 py-2">
                            {payment.location || payment.bookingId?.location || payment.billingId?.location || "-"}
                          </td>
                          <td className="px-2 py-2">
                            {payment.spot || payment.bookingId?.spot || payment.spaces || payment.billingId?.spaces || "-"}
                          </td>
                        </>
                      ) : (                        <>
                          <td className="px-2 py-2">{payment.landownerName || "Unknown"}</td>
                        </>
                      )}
                      <td className="px-2 py-2" style={{ position: 'relative' }}>
                        <StatusChip
                          status={payment.status}
                          onClick={() => setStatusDropdownId(payment._id)}
                        />                        {statusDropdownId === payment._id && (
                          <div className="absolute z-20 bg-white dark:bg-[#232b39] border border-gray-200 dark:border-[#444c5e] rounded shadow-lg mt-1 w-28">
                            {(["Pending", "Completed", "Failed"] as const)
                              .filter(opt => opt !== payment.status)
                              .map(option => (
                                <button
                                  key={option}
                                  className="block w-full text-left px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                  onClick={() => handleStatusChange(payment._id, option)}
                                >
                                  {option === "Completed" ? (
                                    <><FaCheckCircle className="inline mr-1 text-green-500" /> Completed</>
                                  ) : option === "Pending" ? (
                                    <><FaClock className="inline mr-1 text-yellow-500" /> Pending</>
                                  ) : (
                                    <><FaTimesCircle className="inline mr-1 text-red-500" /> Cancel</>
                                  )}
                                </button>
                              ))}
                            <button
                              className="block w-full text-left px-3 py-1 text-xs text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                              onClick={() => setStatusDropdownId(null)}
                            >
                              <FaTimesCircle className="inline mr-1" /> Close
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>        {/* Footer summary */}
        <div className="flex justify-between items-center mt-4 border-t border-gray-100 dark:border-[#222b3a] pt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FaMoneyBillWave className="mr-1 text-blue-500" /> 
            Total: <span className="font-semibold ml-1">{formatLKR(filteredData.reduce((sum, p) => sum + p.amount, 0))}</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{currentData.length}</span> records
          </span>
        </div>
      </div>
      {showPaymentModal && (
        <PaymentForm
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setTableRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
