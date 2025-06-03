import { useState, useEffect } from "react";
import { 
  DollarSign, 
  Calendar, 
  Car, 
  MapPin, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  FileText,
  ChevronRight,
  Users,
  Tag,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import eventCoordinatorService from "../../../services/eventCoordinatorService";

// Define interface for parking location data (transformed from BulkBookingChunk)
interface ParkingLocationData {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  purchasedSpots: number;
}

// Define interface for customer data (transformed from CustomerUser)
interface CustomerDisplayData {
  id: string;
  name: string;
  email: string;
  assignedSpots: number;
  lastActivity: string;
}

// Define interface for alert data
interface AlertData {
  id: number;
  message: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
}

// Define interface for transaction display data
interface TransactionDisplayData {
  id: string;
  customer: string;
  amount: number;
  date: string;
  location: string;
  status: 'completed' | 'pending' | 'cancelled';
  duration: string;
}

// Define local interfaces for the data returned from the service
interface DashboardData {
  metrics: {
    totalPurchasedSpots: number;
    totalAvailableSpots: number;
    totalRevenue: number;
    totalCustomers: number;
  };
  parkingLocations: ParkingLocationData[];
  customers: CustomerDisplayData[];
  recentTransactions: TransactionDisplayData[];
  alerts: AlertData[];
}

export default function CoordinatorDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading: userLoading } = useUser();
  const isDarkMode = theme === "dark";  // Dashboard state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Legacy state for backward compatibility
  const [totalPurchasedSpots, setTotalPurchasedSpots] = useState<number>(0);
  const [totalAvailableSpots, setTotalAvailableSpots] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id || userLoading) return;

      try {
        setLoading(true);
        setError(null);
        const data = await eventCoordinatorService.getDashboardSummary(user._id);
        setDashboardData(data);
        
        // Update legacy state
        setTotalPurchasedSpots(data.metrics.totalPurchasedSpots);
        setTotalAvailableSpots(data.metrics.totalAvailableSpots);
        setTotalRevenue(data.metrics.totalRevenue);
        setTotalCustomers(data.metrics.totalCustomers);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id, userLoading]);
  // Get data from dashboard or fallback to empty arrays
  const parkingLocations = dashboardData?.parkingLocations || [];
  const customers = dashboardData?.customers || [];
  const recentTransactions = dashboardData?.recentTransactions || [];
  const alerts = dashboardData?.alerts || [];

  // Show loading state
  if (loading || userLoading) {
    return (
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'} transition-colors duration-300`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#013220] mx-auto"></div>
            <p className="mt-4 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'} transition-colors duration-300`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#013220] text-white px-4 py-2 rounded-lg hover:bg-[#013220]/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Theme toggle button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-[#013220]' : 'bg-white text-[#013220] shadow'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      {/* Welcome Banner */}
      <div className={`mb-6 ${isDarkMode ? 'bg-gradient-to-r from-[#013220] to-[#013220]' : 'bg-gradient-to-r from-[#013220] to-[#013220]'} rounded-xl text-white p-6 shadow-lg`}>
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome back, Coordinator!</h2>
            <p className="mt-2 opacity-90">Manage your parking inventory and customer assignments</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className={`${isDarkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-white text-blue-600 hover:bg-opacity-90'} px-4 py-2 rounded-lg font-medium transition-all flex items-center`}>
              <Tag size={18} className="mr-2" />
              Purchase Spots
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Purchased Spots</p>
              <h2 className="text-2xl font-bold mt-1">{totalPurchasedSpots}</h2>
            </div>
            <div className={`rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2`}>
              <Car size={18} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-sm font-medium flex items-center`}>
              <TrendingUp size={14} className="mr-1" /> +5%
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Available to Assign</p>
              <h2 className="text-2xl font-bold mt-1">{totalAvailableSpots}</h2>
            </div>
            <div className={`rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} p-2`}>
              <MapPin size={18} className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
              <div 
                className={`${isDarkMode ? 'bg-green-500' : 'bg-green-600'} h-2 rounded-full`} 
                style={{ width: `${(totalAvailableSpots / (totalAvailableSpots + totalPurchasedSpots)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Monthly Cost</p>
              <h2 className="text-2xl font-bold mt-1">${totalRevenue}</h2>
            </div>
            <div className={`rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} p-2`}>
              <DollarSign size={18} className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-sm font-medium flex items-center`}>
              <TrendingUp size={14} className="mr-1" /> +12%
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Active Customers</p>
              <h2 className="text-2xl font-bold mt-1">{totalCustomers}</h2>
            </div>
            <div className={`rounded-full ${isDarkMode ? 'bg-amber-900' : 'bg-amber-100'} p-2`}>
              <Users size={18} className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} text-sm font-medium`}>3 active now</span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>using spots</span>
          </div>
        </div>
      </div>

      {/* Customers and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 lg:col-span-2 border`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">Customer Assignments</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Manage your customer parking allocations</p>
            </div>
            <button className={`${isDarkMode ? 'bg-[#013220] hover:bg-[#013220]/90' : 'bg-[#013220] hover:bg-[#013220]/80'} text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm`}>
              Assign Spots
            </button>
          </div>
          
          <div className={`mt-4 overflow-x-auto ${isDarkMode ? 'bg-gray-750 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Spots</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Activity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>              <tbody className={`${isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                {customers.map((customer: CustomerDisplayData) => (
                  <tr key={customer.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                          <span className={`text-lg font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{customer.name.charAt(0)}</span>
                        </div>                        <div className="ml-4">
                          <div className="text-sm font-medium">{customer.name}</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                        {customer.assignedSpots} spots
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {customer.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'} mr-3`}>Edit</button>
                      <button className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Alerts & Notifications</h3>
            <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:underline`}>View All</span>
          </div>          <div className="space-y-4">
            {alerts.map((alert: AlertData) => (
              <div 
                key={alert.id} 
                className={`${
                  alert.severity === 'high' 
                    ? isDarkMode 
                      ? 'border-l-4 border-red-500 bg-red-900/20' 
                      : 'border-l-4 border-red-500 bg-red-50'
                    : isDarkMode 
                      ? 'border-l-4 border-amber-500 bg-amber-900/20' 
                      : 'border-l-4 border-amber-500 bg-amber-50'
                } p-4 rounded-lg`}
              >
                <div className="flex items-start">
                  <AlertTriangle 
                    size={18} 
                    className={alert.severity === 'high' ? 'text-red-500 mr-2 mt-0.5' : 'text-amber-500 mr-2 mt-0.5'} 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-medium`}>{alert.message}</p>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{alert.time}</span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {alert.severity === 'high' ? 'Requires immediate attention' : 'Please review soon'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length < 3 && (
              <div className={`p-4 rounded-lg border border-dashed ${isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'} text-center`}>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No more alerts</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>You're all caught up!</p>
              </div>
            )}
          </div>
          <button className={`mt-4 w-full ${isDarkMode ? 'bg-[#013220]/30 text-[#013220] hover:bg-[#013220]/50' : 'bg-[#013220]/20 text-[#013220] hover:bg-[#013220]/40'} py-2 rounded-lg transition-colors`}>
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Parking Locations and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
          <div className={`p-6 ${isDarkMode ? 'border-b border-gray-700' : 'border-b'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Your Parking Inventory</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Manage your parking locations</p>
              </div>
              <button className={`${isDarkMode ? 'bg-[#013220] hover:bg-[#013220]/90' : 'bg-[#013220] hover:bg-[#013220]/80'} text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm`}>
                Purchase More
              </button>
            </div>
          </div>          <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {parkingLocations.map((location: ParkingLocationData) => (
              <div key={location.id} className={`p-4 ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-start">
                    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-3 mr-3`}>
                      <MapPin size={20} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{location.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{location.address}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                          ${location.pricePerHour}/hr
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {location.availableSpots} available
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{location.purchasedSpots} spots</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      purchased
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-4 text-center ${isDarkMode ? 'border-t border-gray-700' : 'border-t'}`}>
            <button className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium hover:underline flex items-center justify-center w-full`}>
              View All Locations
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
          <div className={`p-6 ${isDarkMode ? 'border-b border-gray-700' : 'border-b'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Recent Transactions</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Latest customer payments</p>
              </div>
              <button className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100 bg-gray-700' : 'text-gray-600 hover:text-gray-900 bg-gray-100'} p-2 rounded-lg`}>
                <FileText size={18} />
              </button>
            </div>
          </div>          <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {recentTransactions.map((transaction: TransactionDisplayData) => (
              <div key={transaction.id} className={`p-4 ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 ${
                      transaction.duration === '1 Month' ? isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600' :
                      transaction.duration === '1 Week' ? isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600' :
                      isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
                    }`}>
                      {transaction.duration === '1 Month' ? <Calendar size={16} /> :
                       transaction.duration === '1 Week' ? <Clock size={16} /> :
                       <Clock size={16} />
                      }
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{transaction.customer}</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {transaction.date} • {transaction.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="font-semibold">${transaction.amount}</p>
                    <span className={`text-xs ml-2 py-1 px-2 rounded-full ${
                      transaction.status === 'completed' ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' : 
                      transaction.status === 'pending' ? isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600' :
                      isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.status === 'completed' ? 'Paid' : transaction.status === 'pending' ? 'Pending' : 'Cancelled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-4 text-center ${isDarkMode ? 'border-t border-gray-700' : 'border-t'}`}>
            <button className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium hover:underline flex items-center justify-center w-full`}>
              View All Transactions
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
