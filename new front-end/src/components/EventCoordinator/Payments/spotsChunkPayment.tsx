import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  Users,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { parkingPaymentService, ParkingSlot, PaymentSummary } from '../../../services/parkingPaymentService';
import { useUser } from '../../../context/UserContext';

export default function ParkingPaymentTracker() {
  const { user } = useUser();
  const [parkingData, setParkingData] = useState<ParkingSlot[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalSpent: 0,
    totalSlots: 0,
    activePayments: 0,
    pendingPayments: 0,
    overduePayments: 0,
    averageUsage: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  // Fetch parking payment data
  useEffect(() => {
    const fetchParkingData = async () => {
      if (!user._id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await parkingPaymentService.getParkingPaymentSummary(user._id);
        setParkingData(response.slots);
        setSummary(response.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch parking data');
        console.error('Error fetching parking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [user._id]);

  // Handle refresh
  const handleRefresh = async () => {
    if (!user._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await parkingPaymentService.getParkingPaymentSummary(user._id);
      setParkingData(response.slots);
      setSummary(response.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Parking Data</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch your parking payment information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filter data based on status and search term
  const filteredData = parkingData.filter(slot => {
    const matchesStatus = filterStatus === 'all' || slot.paymentStatus === filterStatus;
    const matchesSearch = slot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  // Get usage color
  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-red-600 dark:text-red-400';
    if (usage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  // --- Details Card (Creative, replaces table) ---
  if (selectedSlot) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 flex flex-col items-center w-full">
        <div className="w-full max-w-xl mx-auto">
          <button
            onClick={() => setSelectedSlot(null)}
            className="mb-6 flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 text-sm font-medium transition"
          >
            <ArrowLeft size={16} /> Back to List
          </button>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full p-0 animate-fade-in overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="text-blue-700 dark:text-blue-400" size={24} />
              <span className="text-lg font-bold text-gray-800 dark:text-white">{selectedSlot.location}</span>
            </div>
            <div className="px-6 pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedSlot.paymentStatus)}`}>
                  {selectedSlot.paymentStatus.charAt(0).toUpperCase() + selectedSlot.paymentStatus.slice(1)}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  Payment Date: {formatDate(selectedSlot.paymentDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard size={16} className="text-green-700 dark:text-green-400" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Rs. {selectedSlot.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 ml-2">Valid Until: {formatDate(selectedSlot.validUntil)}</span>
              </div>
            </div>
            {/* Body */}
            <div className="px-6 py-6 grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-purple-700 dark:text-purple-400" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Capacity:</span>
                <span className="ml-auto font-bold">{selectedSlot.capacity} slots</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-teal-700 dark:text-teal-400" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Usage:</span>
                <span className={`ml-auto font-bold ${getUsageColor(selectedSlot.usage)}`}>{selectedSlot.usage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-700 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Valid Until:</span>
                <span className="ml-auto font-semibold">{formatDate(selectedSlot.validUntil)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-green-700 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Total Price :</span>
                <span className="ml-auto font-semibold">Rs. {selectedSlot.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-700 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">Status:</span>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedSlot.paymentStatus)}`}>
                  {selectedSlot.paymentStatus.charAt(0).toUpperCase() + selectedSlot.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex justify-end px-6 pb-6 pt-2">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Table/List View ---
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Parking Payment Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your parking slot payments</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>        {/* Summary Cards */}
        {parkingData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Paid (LKR)</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">Rs. {summary.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-blue-500 mr-1">{parkingData.length}</span> active locations
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Parking Slots</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.totalSlots}</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <Package size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-purple-500 dark:text-purple-300 mr-1">{parkingData.length}</span> active locations
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.activePayments} / {parkingData.length}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <CreditCard size={20} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-yellow-500 dark:text-yellow-400">{summary.pendingPayments} pending</span>
                <span className="text-red-500 dark:text-red-400">{summary.overduePayments} overdue</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Average Usage</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.averageUsage.toFixed(1)}%</p>
                </div>
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                  <Users size={20} className="text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full"
                    style={{ width: `${Math.min(summary.averageUsage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8 border border-gray-100 dark:border-gray-700 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Parking Data Found</h3>
            <p className="text-gray-500 dark:text-gray-400">You don't have any parking slot payments yet.</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
                <select
                  id="status-filter"
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex-grow">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Location or ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="search"
                    className="block w-full p-2.5 pl-10 text-sm text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search for locations or IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Parking Slots Table */}
        {filteredData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID & Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Validity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{slot.id}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{slot.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{slot.capacity} slots</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Rs. {(slot.price).toFixed(2)} per vehicle
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Rs. {slot.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(slot.paymentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(slot.validUntil)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(slot.validUntil) > new Date()
                            ? `${Math.ceil((new Date(slot.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                            : 'Expired'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getUsageColor(slot.usage)}`}>{slot.usage}%</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              slot.usage >= 90 ? 'bg-red-500' : slot.usage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${slot.usage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(slot.paymentStatus)}`}>
                          {slot.paymentStatus.charAt(0).toUpperCase() + slot.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          onClick={() => setSelectedSlot(slot)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No Matching Results' : 'No Parking Data'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria or filters.' 
                : 'You don\'t have any parking slot payments to display.'
              }
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
