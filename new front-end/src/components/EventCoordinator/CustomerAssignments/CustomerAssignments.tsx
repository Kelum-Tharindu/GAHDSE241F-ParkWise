import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Users, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { eventCoordinatorService, SubBulkBooking, BulkBookingChunk, CustomerUser } from '../../../services/eventCoordinatorService';
import { useUser } from '../../../context/UserContext';
import SubBulkBookingModal from './SubBulkBookingModal';

interface CustomerAssignmentsProps {
  className?: string;
}

const CustomerAssignments: React.FC<CustomerAssignmentsProps> = ({ className = '' }) => {
  const { user } = useUser();
  const [subBookings, setSubBookings] = useState<SubBulkBooking[]>([]);
  const [availableBookings, setAvailableBookings] = useState<BulkBookingChunk[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<SubBulkBooking | null>(null);
  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [subBookingsData, availableBookingsData, customersData] = await Promise.all([
        eventCoordinatorService.getSubBulkBookingsByOwner(user._id),
        eventCoordinatorService.getAvailableBulkBookings(user._id),
        eventCoordinatorService.getCustomers()
      ]);

      setSubBookings(subBookingsData);
      setAvailableBookings(availableBookingsData);
      setCustomers(customersData);
    } catch (err) {
      console.error('Error fetching customer assignments data:', err);
      setError('Failed to load customer assignments data');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);
  useEffect(() => {
    fetchData();
  }, [user?._id, fetchData]);

  // Handle create assignment
  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  // Handle edit assignment
  const handleEditAssignment = (assignment: SubBulkBooking) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  // Handle delete assignment
  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const success = await eventCoordinatorService.deleteSubBulkBooking(id);
      if (success) {
        await fetchData(); // Refresh data
      } else {
        alert('Failed to delete assignment');
      }
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Failed to delete assignment');
    }
  };

  // Handle modal close and refresh
  const handleModalClose = (shouldRefresh: boolean = false) => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    if (shouldRefresh) {
      fetchData();
    }
  };

  // Get customer name
  const getCustomerName = (assignment: SubBulkBooking): string => {
    if (typeof assignment.customerId === 'object') {
      return assignment.customerId.username || assignment.customerName;
    }
    return assignment.customerName;
  };

  // Get bulk booking name
  const getBulkBookingName = (assignment: SubBulkBooking): string => {
    if (typeof assignment.bulkBookingId === 'object') {
      return `${assignment.bulkBookingId.parkingName} - ${assignment.bulkBookingId.chunkName}`;
    }
    return assignment.parkingLocation;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };
  // Get status color - Dark mode compatible
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active': return 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50';
      case 'Expired': return 'text-red-400 bg-red-900/30 border-red-700/50';
      case 'Suspended': return 'text-amber-400 bg-amber-900/30 border-amber-700/50';
      default: return 'text-gray-400 bg-gray-800/50 border-gray-600/50';
    }
  };
  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm p-8 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-gray-300 font-medium">Loading customer assignments...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-900 rounded-2xl shadow-2xl border border-red-700/50 backdrop-blur-sm p-8 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="bg-red-900/30 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-400" size={32} />
            </div>
            <div className="text-red-400 font-medium">{error}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm ${className}`}>
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-t-2xl p-8 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/30 mr-4">
              <Users className="text-indigo-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Customer Assignments</h2>
              <p className="text-gray-300 mt-1">Manage parking spot assignments for your customers</p>
            </div>
          </div>
          <button
            onClick={handleCreateAssignment}
            disabled={availableBookings.length === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              availableBookings.length === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 border border-indigo-500/50'
            }`}
          >
            <Plus className="mr-2" size={18} />
            Assign Spots
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* No available bookings message */}
        {availableBookings.length === 0 && (
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="bg-amber-600/20 p-2 rounded-lg mr-4">
                <AlertCircle className="text-amber-400" size={24} />
              </div>
              <div>
                <h4 className="text-amber-400 font-semibold mb-1">No Bulk Bookings Available</h4>
                <p className="text-amber-300">
                  Purchase bulk bookings first to assign spots to customers. You need available bulk bookings to create customer assignments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Assignments List */}
        {subBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Users className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No customer assignments yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {availableBookings.length === 0 
                ? 'Purchase bulk bookings first to start assigning spots to customers'
                : 'Click "Assign Spots" to create your first customer assignment and start managing parking access'
              }
            </p>
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700/50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Parking Location</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Assigned Spots</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Valid Period</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Usage</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subBookings.map((assignment, index) => (
                    <tr 
                      key={assignment._id} 
                      className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-gray-800/10' : 'bg-gray-800/20'
                      }`}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="bg-indigo-600/20 rounded-full p-2 mr-3">
                            <Users className="text-indigo-400" size={16} />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">
                              {getCustomerName(assignment)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {assignment.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="bg-purple-600/20 rounded-lg p-2 mr-3">
                            <MapPin className="text-purple-400" size={16} />
                          </div>
                          <span className="text-white font-medium">
                            {getBulkBookingName(assignment)}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="bg-blue-600/20 rounded-lg px-3 py-2 inline-block border border-blue-500/30">
                          <span className="font-bold text-blue-400 text-sm">
                            {assignment.assignedSpots} spots
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center text-sm text-gray-300">
                          <div className="bg-green-600/20 rounded-lg p-1.5 mr-2">
                            <Calendar className="text-green-400" size={14} />
                          </div>
                          <div>
                            <div>{formatDate(assignment.validFrom)}</div>
                            <div className="text-xs text-gray-500">to {formatDate(assignment.validTo)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-sm">
                          <div className="text-gray-300 font-medium">
                            {assignment.usageTime > 0 ? `${assignment.usageTime}h` : 'Not used'}
                          </div>
                          {assignment.lastAccessDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Last: {formatDate(assignment.lastAccessDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all duration-200 hover:scale-105"
                            title="Edit assignment"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment._id)}
                            className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg border border-red-500/30 hover:border-red-400 transition-all duration-200 hover:scale-105"
                            title="Delete assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SubBulkBookingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          assignment={editingAssignment}
          availableBookings={availableBookings}
          customers={customers}
          ownerId={user?._id || ''}
        />
      )}
    </div>
  );
};

export default CustomerAssignments;
