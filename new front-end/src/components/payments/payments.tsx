import React, { useState } from "react";
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

// Define types for payments
interface BasePayment {
  id: string;
  date: string;
  amount: number;
  method: string;
  location: string;
  status: string;
}

interface CustomerPayment extends BasePayment {
  spot: string;
}

interface LandownerPayment extends BasePayment {
  spaces: number;
}

// Example data
const customerPayments = [
  {
    id: "C-1001",
    date: "2025-04-27",
    amount: 400,
    method: "Credit Card",
    spot: "Lot A - 12",
    location: "Colombo City Center",
    status: "Completed",
  },
  {
    id: "C-1002",
    date: "2025-04-28",
    amount: 1500,
    method: "UPI",
    spot: "Lot B - 3",
    location: "Kandy Mall",
    status: "Completed",
  },
  {
    id: "C-1003",
    date: "2025-04-29",
    amount: 3500,
    method: "Debit Card",
    spot: "Lot C - 7",
    location: "Galle Fort",
    status: "Failed",
  },
];

const landownerPayments = [
  {
    id: "L-2001",
    date: "2025-04-27",
    amount: 380,
    method: "Bank Transfer",
    spaces: 2,
    location: "Colombo City Center",
    status: "Paid",
  },
  {
    id: "L-2002",
    date: "2025-04-28",
    amount: 1425,
    method: "Bank Transfer",
    spaces: 5,
    location: "Kandy Mall",
    status: "Paid",
  },
  {
    id: "L-2003",
    date: "2025-04-29",
    amount: 3325,
    method: "Bank Transfer",
    spaces: 9,
    location: "Galle Fort",
    status: "Pending",
  },
];

function formatLKR(amount: number) {
  return "LKR " + amount.toLocaleString("en-LK");
}

function StatusChip({ status }: { status: string }) {
  const color =
    status === "Completed" || status === "Paid"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  const icon =
    status === "Completed" || status === "Paid" ? (
      <FaCheckCircle className="mr-1" />
    ) : status === "Pending" ? (
      <FaClock className="mr-1" />
    ) : (
      <FaTimesCircle className="mr-1" />
    );
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {icon}
      {status}
    </span>
  );
}

export default function PaymentTables() {
  const [showCustomers, setShowCustomers] = useState(true);
  const [filter, setFilter] = useState("");

  // Filtered data
  const currentData = showCustomers ? customerPayments : landownerPayments;
  const filteredData = currentData.filter((p) =>
    Object.values(p)
      .map(String)
      .some((value) => value.toLowerCase().includes(filter.toLowerCase()))
  );
  const totalAmount = currentData.reduce((sum, p) => sum + p.amount, 0);

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
          <div className="flex gap-4">
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
          </div>
        </div>
        {/* Search */}
        <div className="mb-2 flex items-center gap-2">
          <FaSearch className="text-gray-400 text-xs" />
          <input
            type="text"
            placeholder={`Search ${showCustomers ? "users" : "landowners"}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-60 px-2 py-1 rounded-lg border border-gray-200 dark:border-[#222b3a] bg-gray-50 dark:bg-[#1b2230] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        {/* Table */}
        <div className="overflow-x-auto rounded-lg">
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
                <th className="px-2 py-2 text-left">
                  <FaMapMarkerAlt className="inline mr-1" /> Location
                </th>
                {showCustomers ? (
                  <th className="px-2 py-2 text-left">
                    <FaParking className="inline mr-1" /> Spot
                  </th>
                ) : (
                  <th className="px-2 py-2 text-left">
                    <FaCar className="inline mr-1" /> Spaces
                  </th>
                )}
                <th className="px-2 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-2 py-6 text-center text-gray-400"
                  >
                    No {showCustomers ? "customer" : "landowner"} payments found.
                  </td>
                </tr>
              ) : (
                filteredData.map((payment, idx) => (
                  <tr
                    key={payment.id}
                    className={`border-b border-gray-100 dark:border-[#222b3a] transition-all hover:bg-blue-50 dark:hover:bg-[#202736] ${
                      idx % 2 === 0 ? "bg-gray-50 dark:bg-[#232b39]" : ""
                    }`}
                  >
                    <td className="px-2 py-2 font-mono">{payment.id}</td>
                    <td className="px-2 py-2">{payment.date}</td>
                    <td className="px-2 py-2 font-semibold">
                      {formatLKR(payment.amount)}
                    </td>
                    <td className="px-2 py-2">{payment.method}</td>
                    <td className="px-2 py-2">{payment.location}</td>
                    <td className="px-2 py-2">
                      {showCustomers
                        ? (payment as CustomerPayment).spot
                        : (payment as LandownerPayment).spaces}
                    </td>
                    <td className="px-2 py-2">
                      <StatusChip status={payment.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer summary */}
        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-500">
            Showing {filteredData.length} of {currentData.length} records
          </span>
        </div>
      </div>
    </div>
  );
}
