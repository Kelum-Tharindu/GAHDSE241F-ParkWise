import { useState, useEffect } from 'react';
import {
  getAllMonthlyTargets,
  setMonthlyTarget,
  updateMonthlyTarget,
  deleteMonthlyTarget,
  getMonthlyTargetByYearMonth,
  MonthlyTargetItem,
  getMonthName
} from '../../services/targetService';

export default function MonthlyTargetManagement() {
  const [targets, setTargets] = useState<MonthlyTargetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTarget, setIsAddingTarget] = useState<boolean>(false);
  const [isEditingTarget, setIsEditingTarget] = useState<boolean>(false);
  const [targetToEdit, setTargetToEdit] = useState<MonthlyTargetItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<MonthlyTargetItem>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    targetAmount: 0
  });

  // Fetch all monthly targets
  const fetchTargets = async () => {
    try {
      setLoading(true);
      const data = await getAllMonthlyTargets();
      setTargets(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch target data');
      console.error('Error fetching monthly targets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      targetAmount: 0
    });
    setIsAddingTarget(false);
    setIsEditingTarget(false);
    setTargetToEdit(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'targetAmount' ? parseFloat(value) : parseInt(value, 10)
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditingTarget) {
        // Update existing target
        await updateMonthlyTarget(formData);
      } else {
        // Create new target
        await setMonthlyTarget(formData);
      }
      
      await fetchTargets();
      resetForm();
      setSuccessMessage(isEditingTarget ? 'Target updated successfully!' : 'Target added successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save target');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Edit target
  const handleEditTarget = async (target: MonthlyTargetItem) => {
    try {
      setLoading(true);
      // Fetch the latest data for this target to ensure we have the most up-to-date information
      const latestTarget = await getMonthlyTargetByYearMonth(target.year, target.month);
      
      setTargetToEdit(latestTarget);
      setFormData({
        year: latestTarget.year,
        month: latestTarget.month,
        targetAmount: latestTarget.targetAmount,
        _id: latestTarget._id,
        createdAt: latestTarget.createdAt,
        updatedAt: latestTarget.updatedAt
      });
      setIsEditingTarget(true);
      setIsAddingTarget(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load target for editing');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Delete target
  const handleDeleteTarget = async (year: number, month: number) => {
    if (window.confirm(`Are you sure you want to delete the target for ${getMonthName(month)} ${year}?`)) {
      try {
        setLoading(true);
        await deleteMonthlyTarget(year, month);
        await fetchTargets();
        setSuccessMessage('Target deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete target');
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  // Generate years for dropdown (current year - 1 to current year + 5)
  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 1 + i);

  // Generate months for dropdown
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: getMonthName(i)
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-default p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Monthly Target Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your monthly revenue targets
          </p>
        </div>
        {!isAddingTarget && (
          <button
            onClick={() => setIsAddingTarget(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add New Target
          </button>
        )}
      </div>

      {/* Success or error message */}
      {successMessage && (
        <div className="mb-6 p-3 bg-success-50 text-success-700 rounded-lg dark:bg-success-500/15 dark:text-success-500">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-lg dark:bg-error-500/15 dark:text-error-500">
          {error}
        </div>
      )}

      {/* Add/Edit Target Form */}
      {isAddingTarget && (
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white/90">
            {isEditingTarget ? 'Edit Target' : 'Add New Target'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  disabled={isEditingTarget}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Month
                </label>
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  disabled={isEditingTarget}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditingTarget ? 'Update Target' : 'Add Target')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Targets Table */}
      <div className="overflow-x-auto">
        {loading && !isAddingTarget ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : targets.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No monthly targets found. Click "Add New Target" to create one.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Month
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Target Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {targets.map((target) => (
                <tr key={`${target.year}-${target.month}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {target.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {getMonthName(target.month)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${target.targetAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {target.updatedAt ? new Date(target.updatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <button
                      onClick={() => handleEditTarget(target)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTarget(target.year, target.month)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}