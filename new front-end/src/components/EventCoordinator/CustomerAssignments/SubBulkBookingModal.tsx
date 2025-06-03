import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, MapPin, AlertCircle, Check } from 'lucide-react';
import { eventCoordinatorService, SubBulkBooking, BulkBookingChunk, CustomerUser, CreateSubBulkBookingRequest } from '../../../services/eventCoordinatorService';

interface SubBulkBookingModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  assignment?: SubBulkBooking | null;
  availableBookings: BulkBookingChunk[];
  customers: CustomerUser[];
  ownerId: string;
}

const SubBulkBookingModal: React.FC<SubBulkBookingModalProps> = ({
  isOpen,
  onClose,
  assignment,
  availableBookings,
  customers,
  ownerId
}) => {
  const [formData, setFormData] = useState<CreateSubBulkBookingRequest>({
    bulkBookingId: '',
    ownerId: ownerId,
    customerId: '',
    assignedSpots: 1,
    validFrom: '',
    validTo: '',
    notes: ''
  });
  const [selectedBulkBooking, setSelectedBulkBooking] = useState<BulkBookingChunk | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data
  useEffect(() => {
    if (assignment) {
      // Editing existing assignment
      const bulkBookingId = typeof assignment.bulkBookingId === 'object' 
        ? assignment.bulkBookingId._id 
        : assignment.bulkBookingId;
      const customerId = typeof assignment.customerId === 'object'
        ? assignment.customerId._id
        : assignment.customerId;

      setFormData({
        bulkBookingId,
        ownerId,
        customerId,
        assignedSpots: assignment.assignedSpots,
        validFrom: assignment.validFrom.split('T')[0], // Convert to YYYY-MM-DD format
        validTo: assignment.validTo.split('T')[0],
        notes: assignment.notes || ''
      });

      // Find the corresponding bulk booking
      const bulkBooking = availableBookings.find(bb => bb._id === bulkBookingId);
      setSelectedBulkBooking(bulkBooking || null);
    } else {
      // Creating new assignment
      setFormData({
        bulkBookingId: '',
        ownerId: ownerId,
        customerId: '',
        assignedSpots: 1,
        validFrom: '',
        validTo: '',
        notes: ''
      });
      setSelectedBulkBooking(null);
    }
    setError(null);
  }, [assignment, availableBookings, ownerId]);

  // Handle bulk booking selection
  const handleBulkBookingChange = (bulkBookingId: string) => {
    const bulkBooking = availableBookings.find(bb => bb._id === bulkBookingId);
    setSelectedBulkBooking(bulkBooking || null);
    
    if (bulkBooking) {
      // Auto-fill date range with bulk booking dates
      setFormData(prev => ({
        ...prev,
        bulkBookingId,
        validFrom: bulkBooking.validFrom.split('T')[0],
        validTo: bulkBooking.validTo.split('T')[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bulkBookingId,
        validFrom: '',
        validTo: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.bulkBookingId || !formData.customerId || !formData.validFrom || !formData.validTo) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.assignedSpots <= 0) {
        throw new Error('Assigned spots must be greater than 0');
      }

      if (selectedBulkBooking && formData.assignedSpots > selectedBulkBooking.availableSpots) {
        throw new Error(`Cannot assign more than ${selectedBulkBooking.availableSpots} available spots`);
      }

      if (new Date(formData.validFrom) > new Date(formData.validTo)) {
        throw new Error('Valid from date cannot be after valid to date');
      }

      if (assignment) {
        // Update existing assignment
        await eventCoordinatorService.updateSubBulkBooking(assignment._id, formData);
      } else {
        // Create new assignment
        await eventCoordinatorService.createSubBulkBooking(formData);
      }      onClose(true); // Close modal and refresh data
    } catch (err: unknown) {
      console.error('Error saving assignment:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save assignment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreateSubBulkBookingRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="mr-3 text-indigo-400" size={28} />
            {assignment ? 'Edit Customer Assignment' : 'Assign Spots to Customer'}
          </h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 p-2 rounded-full transition-all duration-200"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-6 flex items-start shadow-sm">
              <div className="flex-shrink-0">
                <AlertCircle className="text-red-400" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">            {/* Bulk Booking Selection */}
            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                <div className="w-8 h-8 bg-indigo-900/50 rounded-lg flex items-center justify-center mr-3 border border-indigo-700">
                  <MapPin className="text-indigo-400" size={18} />
                </div>
                Bulk Booking *
              </label><select
                value={formData.bulkBookingId}
                onChange={(e) => handleBulkBookingChange(e.target.value)}
                required
                disabled={loading || (assignment ? true : false)}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 transition-all duration-200 shadow-sm bg-gray-800 text-white"
              >
                <option value="">Select a bulk booking...</option>
                {availableBookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.parkingName} - {booking.chunkName} 
                    (Available: {booking.availableSpots}/{booking.totalSpots})
                  </option>
                ))}
              </select>              {selectedBulkBooking && (
                <div className="mt-3 p-4 bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-xl border border-indigo-700 shadow-sm">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-300">Company:</span>
                      <span className="text-indigo-300 font-semibold">{selectedBulkBooking.company}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-300">Available Spots:</span>
                      <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-700">
                        {selectedBulkBooking.availableSpots}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-300">Valid Period:</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(selectedBulkBooking.validFrom).toLocaleDateString()} - {new Date(selectedBulkBooking.validTo).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>            {/* Customer Selection */}
            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center mr-3 border border-purple-700">
                  <Users className="text-purple-400" size={18} />
                </div>
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm bg-gray-800 text-white"
              >
                <option value="">Select a customer...</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.username} ({customer.email})
                  </option>
                ))}
              </select>
            </div>            {/* Assigned Spots */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                <div className="w-8 h-8 bg-emerald-900/50 rounded-lg flex items-center justify-center mr-3 border border-emerald-700">
                  <span className="text-emerald-400 font-bold text-xs">#</span>
                </div>
                Assigned Spots *
              </label>
              <input
                type="number"
                min="1"
                max={selectedBulkBooking?.availableSpots || 999}
                value={formData.assignedSpots}
                onChange={(e) => handleInputChange('assignedSpots', parseInt(e.target.value) || 1)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 shadow-sm bg-gray-800 text-white"
              />
              {selectedBulkBooking && (
                <div className="text-xs text-emerald-400 mt-2 bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-700">
                  Maximum: {selectedBulkBooking.availableSpots} spots
                </div>
              )}
            </div>            {/* Valid From */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3 border border-blue-700">
                  <Calendar className="text-blue-400" size={18} />
                </div>
                Valid From *
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                min={selectedBulkBooking?.validFrom.split('T')[0]}
                max={selectedBulkBooking?.validTo.split('T')[0]}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-gray-800 text-white"
              />
            </div>

            {/* Valid To */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                <div className="w-8 h-8 bg-orange-900/50 rounded-lg flex items-center justify-center mr-3 border border-orange-700">
                  <Calendar className="text-orange-400" size={18} />
                </div>
                Valid To *
              </label>
              <input
                type="date"
                value={formData.validTo}
                onChange={(e) => handleInputChange('validTo', e.target.value)}
                min={formData.validFrom || selectedBulkBooking?.validFrom.split('T')[0]}
                max={selectedBulkBooking?.validTo.split('T')[0]}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm bg-gray-800 text-white"
              />
            </div>            {/* Notes */}
            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3 border border-gray-600">
                  <span className="text-gray-400 font-bold text-xs">📝</span>
                </div>
                Notes
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={loading}
                placeholder="Optional notes about this assignment..."
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-sm resize-none bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={loading}
              className="px-6 py-3 text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 font-medium border border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.bulkBookingId || !formData.customerId}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-3" size={18} />
                  {assignment ? 'Update Assignment' : 'Create Assignment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubBulkBookingModal;
