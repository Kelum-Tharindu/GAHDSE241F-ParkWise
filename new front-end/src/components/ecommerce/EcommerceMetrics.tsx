import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { useEffect, useState } from "react";
import Badge from "../uiMy/badge/Badge";
import { DashboardMetrics, getDashboardMetrics } from "../../services/dashboardService";

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Add a small delay to simulate network latency (only in development)
        if (process.env.NODE_ENV === 'development') {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        const data = await getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {loading ? (
        // Loading state
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="mt-2 h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="mt-2 h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </>      ) : error ? (
        // Error state
        <div className="col-span-2 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 md:p-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={handleRetry} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      ) : (
        // Data loaded state
        <>
          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Registered Users
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {metrics?.users.total.toLocaleString() || "N/A"}
                </h4>
              </div>
              {metrics && (
                <Badge color={metrics.users.trend === "up" ? "success" : "error"}>
                  {metrics.users.trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {Math.abs(metrics.users.growth).toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>
          {/* <!-- Metric Item End --> */}          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Parking Booking Count
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {metrics?.bookings.total.toLocaleString() || "N/A"}
                </h4>
              </div>
              {metrics && (
                <Badge color={metrics.bookings.trend === "up" ? "success" : "error"}>
                  {metrics.bookings.trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {Math.abs(metrics.bookings.growth).toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>          {/* <!-- Metric Item End --> */}

          {/* <!-- Revenue Metric Item --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-800 size-6 dark:text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Revenue
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {`LKR ${metrics?.revenue.total.toLocaleString() || "N/A"}`}
                </h4>
              </div>
              {metrics && (
                <Badge color={metrics.revenue.trend === "up" ? "success" : "error"}>
                  {metrics.revenue.trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {Math.abs(metrics.revenue.growth).toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>          {/* <!-- Revenue Metric End --> */}

          {/* <!-- Transactions Metric Item --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-800 size-6 dark:text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Transactions
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {metrics?.transactions.total.toLocaleString() || "N/A"}
                </h4>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {`${metrics?.transactions.recent || 0} recent`}
              </span>
            </div>
          </div>
          {/* <!-- Transactions Metric End --> */}
        </>
      )}
    </div>
  );
}
