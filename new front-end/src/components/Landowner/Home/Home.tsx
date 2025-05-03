import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
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
  BarChart3,
  CalendarClock,
  Zap,
  Moon,
  Sun
} from "lucide-react";

// Sample data (in a real app, this would come from an API)
const parkingLocations = [
  { id: 1, name: 'Downtown Lot', address: '123 Main St', revenue: 2450, occupancy: 87, spots: 45, trend: 'up' },
  { id: 2, name: 'City Center', address: '456 Park Ave', revenue: 1850, occupancy: 75, spots: 30, trend: 'down' },
  { id: 3, name: 'East Side Plaza', address: '789 East Blvd', revenue: 3200, occupancy: 92, spots: 60, trend: 'up' },
];

const recentTransactions = [
  { id: 1, date: '2025-05-02', amount: 45, location: 'Downtown Lot', type: 'Daily', status: 'completed' },
  { id: 2, date: '2025-05-01', amount: 180, location: 'City Center', type: 'Weekly', status: 'completed' },
  { id: 3, date: '2025-04-30', amount: 25, location: 'East Side Plaza', type: 'Hourly', status: 'pending' },
  { id: 4, date: '2025-04-30', amount: 350, location: 'Downtown Lot', type: 'Monthly', status: 'completed' },
];

const alerts = [
  { id: 1, message: 'Downtown Lot payment processing issue', severity: 'high', time: '2 hours ago' },
  { id: 2, message: 'City Center maintenance scheduled', severity: 'medium', time: '1 day ago' },
];

const revenueData = [
  { name: 'Jan', revenue: 4200, occupancy: 72 },
  { name: 'Feb', revenue: 4500, occupancy: 76 },
  { name: 'Mar', revenue: 5100, occupancy: 81 },
  { name: 'Apr', revenue: 4800, occupancy: 79 },
  { name: 'May', revenue: 5500, occupancy: 85 },
  { name: 'Jun', revenue: 5700, occupancy: 88 },
];

export default function DashboardContent() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSpots, setTotalSpots] = useState(0);
  const [averageOccupancy, setAverageOccupancy] = useState(0);

  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  useEffect(() => {
    const revenue = parkingLocations.reduce((sum, location) => sum + location.revenue, 0);
    const spots = parkingLocations.reduce((sum, location) => sum + location.spots, 0);
    const avgOcc = parkingLocations.reduce((sum, location) => sum + location.occupancy, 0) / parkingLocations.length;
    setTotalRevenue(revenue);
    setTotalSpots(spots);
    setAverageOccupancy(avgOcc);
  }, []);

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} transition-colors duration-300`}>
      {/* Theme toggle button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-white text-gray-800 shadow'}`}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      {/* Welcome Banner */}
      <div className={`mb-6 ${darkMode ? 'bg-gradient-to-r from-green-800 to-green-900' : 'bg-gradient-to-r from-green-600 to-green-700'} rounded-xl text-white p-6 shadow-lg`}>
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome back, John!</h2>
            <p className="mt-2 opacity-90">Your parking empire is performing well today</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className={`${darkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-white text-blue-600 hover:bg-opacity-90'} px-4 py-2 rounded-lg font-medium transition-all flex items-center`}>
              <Zap size={18} className="mr-2" />
              Quick Actions
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Monthly Revenue</p>
              <h2 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h2>
            </div>
            <div className={`rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'} p-2`}>
              <DollarSign size={18} className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-sm font-medium flex items-center`}>
              <TrendingUp size={14} className="mr-1" /> +12%
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Total Parking Spots</p>
              <h2 className="text-2xl font-bold mt-1">{totalSpots}</h2>
            </div>
            <div className={`rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2`}>
              <Car size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>{parkingLocations.length} locations</span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>across city</span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Average Occupancy</p>
              <h2 className="text-2xl font-bold mt-1">{averageOccupancy.toFixed(1)}%</h2>
            </div>
            <div className={`rounded-full ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} p-2`}>
              <TrendingUp size={18} className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
              <div 
                className={`${darkMode ? 'bg-purple-500' : 'bg-purple-600'} h-2 rounded-full`} 
                style={{ width: `${averageOccupancy}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:shadow-md'} rounded-xl shadow-sm p-6 border transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Peak Hours</p>
              <h2 className="text-2xl font-bold mt-1">9AM - 5PM</h2>
            </div>
            <div className={`rounded-full ${darkMode ? 'bg-amber-900' : 'bg-amber-100'} p-2`}>
              <CalendarClock size={18} className={`${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`${darkMode ? 'text-amber-400' : 'text-amber-600'} text-sm font-medium`}>92% occupancy</span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>during peak</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 lg:col-span-2 border`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h3 className="font-semibold text-lg">Revenue & Occupancy Trends</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Monthly performance overview</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <select className={`border rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200'}`}>
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
          </div>
          
          {/* Enhanced chart visualization */}
          <div className="relative h-64 mt-4">
            {/* Revenue bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {revenueData.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full max-w-md flex justify-center">
                    <div 
                      className={`w-4/5 ${darkMode ? 'bg-gradient-to-t from-blue-700 to-blue-500' : 'bg-gradient-to-t from-blue-600 to-blue-400'} rounded-md opacity-90 group-hover:opacity-100 transition-all`}
                      style={{ height: `${(month.revenue / 6000) * 100}%` }}
                    ></div>
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-white'} text-xs rounded py-1 px-2 pointer-events-none`}>
                      ${month.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Occupancy line */}
            <div className="absolute inset-0 flex items-end justify-between px-2 pointer-events-none">
              <svg className="absolute inset-0" style={{ height: '100%', width: '100%' }}>
                <polyline
                  points={revenueData.map((month, index) => 
                    `${(index / (revenueData.length - 1)) * 100}%,${100 - month.occupancy}%`
                  ).join(' ')}
                  fill="none"
                  stroke={darkMode ? "#a78bfa" : "#8b5cf6"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {revenueData.map((month, index) => (
                  <circle 
                    key={index}
                    cx={`${(index / (revenueData.length - 1)) * 100}%`} 
                    cy={`${100 - month.occupancy}%`}
                    r="4"
                    fill={darkMode ? "#a78bfa" : "#8b5cf6"}
                    stroke={darkMode ? "#1f2937" : "#fff"}
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
            {/* Bottom labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-4">
              {revenueData.map((month, index) => (
                <div key={index} className="flex-1 flex justify-center">
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>{month.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center items-center mt-4 text-sm">
            <div className="flex items-center mr-4">
              <div className={`w-3 h-3 ${darkMode ? 'bg-blue-500' : 'bg-blue-500'} rounded-sm mr-1`}></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 ${darkMode ? 'bg-purple-400' : 'bg-purple-500'} rounded-sm mr-1`}></div>
              <span>Occupancy %</span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Alerts & Notifications</h3>
            <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:underline`}>View All</span>
          </div>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`${
                  alert.severity === 'high' 
                    ? darkMode 
                      ? 'border-l-4 border-red-500 bg-red-900/20' 
                      : 'border-l-4 border-red-500 bg-red-50'
                    : darkMode 
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
                      <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium`}>{alert.message}</p>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{alert.time}</span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {alert.severity === 'high' ? 'Requires immediate attention' : 'Please review soon'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length < 3 && (
              <div className={`p-4 rounded-lg border border-dashed ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'} text-center`}>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No more alerts</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>You're all caught up!</p>
              </div>
            )}
          </div>
          <button className={`mt-4 w-full ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} py-2 rounded-lg transition-colors`}>
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Properties and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
          <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Your Parking Locations</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Manage your properties</p>
              </div>
              <button className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm`}>
                Add New
              </button>
            </div>
          </div>
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {parkingLocations.map(location => (
              <div key={location.id} className={`p-4 ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-start">
                    <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-3 mr-3`}>
                      <MapPin size={20} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{location.name}</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{location.address}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-16 h-1.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mr-2`}>
                          <div 
                            className={`h-1.5 rounded-full ${location.occupancy > 85 ? (darkMode ? 'bg-green-500' : 'bg-green-500') : (darkMode ? 'bg-blue-500' : 'bg-blue-500')}`}
                            style={{ width: `${location.occupancy}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{location.occupancy}% full</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${location.revenue}</p>
                    <p className={`text-xs ${location.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center justify-end mt-1`}>
                      {location.trend === 'up' ? 
                        <TrendingUp size={12} className="mr-1" /> : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 17l-8.5-8.5-5 5L2 7"></path><path d="M16 17h6v-6"></path></svg>
                      }
                      {location.trend === 'up' ? '+8%' : '-3%'} this month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-4 text-center ${darkMode ? 'border-t border-gray-700' : 'border-t'}`}>
            <button className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium hover:underline flex items-center justify-center w-full`}>
              View All Properties
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
          <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Recent Transactions</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Latest parking payments</p>
              </div>
              <button className={`${darkMode ? 'text-gray-300 hover:text-gray-100 bg-gray-700' : 'text-gray-600 hover:text-gray-900 bg-gray-100'} p-2 rounded-lg`}>
                <FileText size={18} />
              </button>
            </div>
          </div>
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className={`p-4 ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 ${
                      transaction.type === 'Monthly' ? darkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600' :
                      transaction.type === 'Weekly' ? darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600' :
                      transaction.type === 'Daily' ? darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600' :
                      darkMode ? 'bg-amber-900 text-amber-400' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {transaction.type === 'Monthly' ? <Calendar size={16} /> :
                       transaction.type === 'Weekly' ? <CalendarClock size={16} /> :
                       transaction.type === 'Daily' ? <Clock size={16} /> :
                       <Clock size={16} />
                      }
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{transaction.location}</h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {transaction.date} • {transaction.type} Pass
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="font-semibold">${transaction.amount}</p>
                    <span className={`text-xs ml-2 py-1 px-2 rounded-full ${
                      transaction.status === 'completed' ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' : darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {transaction.status === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-4 text-center ${darkMode ? 'border-t border-gray-700' : 'border-t'}`}>
            <button className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium hover:underline flex items-center justify-center w-full`}>
              View All Transactions
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
