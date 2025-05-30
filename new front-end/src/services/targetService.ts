import axios from 'axios';
import { API_CONFIG, debugLog } from '../config';

// Define the interface for Monthly Target data
export interface MonthlyTargetData {
  targetAmount: number;
  currentRevenue: number;
  todayRevenue: number;
  percentageAchieved: number;
  growthPercentage: number;
  growthDirection: 'up' | 'down';
}

// Define the interface for Monthly Target item in the management view
export interface MonthlyTargetItem {
  _id?: string;
  year: number;
  month: number;
  targetAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Fallback data in case the API call fails
const fallbackData: MonthlyTargetData = {
  targetAmount: 20000,
  currentRevenue: 15000,
  todayRevenue: 2000,
  percentageAchieved: 75.0,
  growthPercentage: 10.0,
  growthDirection: 'up'
};

// Base URL for API calls
// Using our centralized configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Fetches monthly target data from the API
 * @returns {Promise<MonthlyTargetData>} The monthly target data
 */
export const getMonthlyTarget = async (): Promise<MonthlyTargetData> => {
  try {
    debugLog('Fetching monthly target data from:', `${API_BASE_URL}/dashboard/monthly-target`);
    const response = await axios.get(`${API_BASE_URL}/dashboard/monthly-target`);
    
    if (response.data && response.data.success && response.data.data) {
      debugLog('Successfully fetched monthly target data:', response.data.data);
      return response.data.data as MonthlyTargetData;
    } else {
      console.error('Invalid API response format:', response.data);
      return fallbackData;
    }
  } catch (error) {
    console.error('Error fetching monthly target data:', error);
    return fallbackData;
  }
};

/**
 * Fetches all monthly targets for management
 * @returns {Promise<MonthlyTargetItem[]>} Array of monthly target items
 */
export const getAllMonthlyTargets = async (): Promise<MonthlyTargetItem[]> => {
  try {
    debugLog('Fetching all monthly targets from:', `${API_BASE_URL}/dashboard/target-management`);
    const response = await axios.get(`${API_BASE_URL}/dashboard/target-management`, {
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: API_CONFIG.WITH_CREDENTIALS
    });
    
    if (response.data && response.data.success && response.data.data) {
      debugLog('Successfully fetched all monthly targets:', response.data.data);
      return response.data.data as MonthlyTargetItem[];
    } else {
      console.error('Invalid API response format:', response.data);
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching all monthly targets:', error);
    throw error;
  }
};

/**
 * Fetches a specific monthly target by year and month
 * @param {number} year - The year of the target
 * @param {number} month - The month of the target (0-11)
 * @returns {Promise<MonthlyTargetItem>} The monthly target
 */
export const getMonthlyTargetByYearMonth = async (year: number, month: number): Promise<MonthlyTargetItem> => {
  try {
    debugLog('Fetching monthly target by year/month:', { year, month });
    const response = await axios.get(`${API_BASE_URL}/dashboard/target-management/${year}/${month}`, {
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: API_CONFIG.WITH_CREDENTIALS
    });
    
    if (response.data && response.data.success && response.data.data) {
      debugLog('Successfully fetched monthly target:', response.data.data);
      return response.data.data as MonthlyTargetItem;
    } else {
      console.error('Invalid API response format:', response.data);
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error(`Error fetching monthly target for ${year}/${month}:`, error);
    throw error;
  }
};

/**
 * Sets a monthly target
 * @param {MonthlyTargetItem} target The target to set
 * @returns {Promise<MonthlyTargetItem>} The saved target
 */
export const setMonthlyTarget = async (target: MonthlyTargetItem): Promise<MonthlyTargetItem> => {
  try {
    debugLog('Setting monthly target:', target);
    const response = await axios.post(`${API_BASE_URL}/dashboard/target-management`, target, {
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: API_CONFIG.WITH_CREDENTIALS
    });
    
    if (response.data && response.data.success && response.data.data) {
      debugLog('Successfully set monthly target:', response.data.data);
      return response.data.data as MonthlyTargetItem;
    } else {
      console.error('Invalid API response format:', response.data);
      throw new Error(response.data?.message || 'Failed to set monthly target');
    }
  } catch (error) {
    console.error('Error setting monthly target:', error);
    throw error;
  }
};

/**
 * Updates a monthly target
 * @param {MonthlyTargetItem} target The target to update
 * @returns {Promise<MonthlyTargetItem>} The updated target
 */
export const updateMonthlyTarget = async (target: MonthlyTargetItem): Promise<MonthlyTargetItem> => {
  try {
    if (!target.year || target.month === undefined || !target.targetAmount) {
      throw new Error('Year, month, and targetAmount are required');
    }
    
    debugLog('Updating monthly target:', target);
    const response = await axios.put(
      `${API_BASE_URL}/dashboard/target-management/${target.year}/${target.month}`,
      { targetAmount: target.targetAmount },
      {
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: API_CONFIG.WITH_CREDENTIALS
      }
    );
    
    if (response.data && response.data.success && response.data.data) {
      debugLog('Successfully updated monthly target:', response.data.data);
      return response.data.data as MonthlyTargetItem;
    } else {
      console.error('Invalid API response format:', response.data);
      throw new Error(response.data?.message || 'Failed to update monthly target');
    }
  } catch (error) {
    console.error('Error updating monthly target:', error);
    throw error;
  }
};

/**
 * Deletes a monthly target
 * @param {number} year The year of the target to delete
 * @param {number} month The month of the target to delete
 * @returns {Promise<void>}
 */
export const deleteMonthlyTarget = async (year: number, month: number): Promise<void> => {
  try {
    debugLog('Deleting monthly target:', { year, month });
    const response = await axios.delete(`${API_BASE_URL}/dashboard/target-management`, {
      data: { year, month },
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: API_CONFIG.WITH_CREDENTIALS
    });
    
    if (response.data && response.data.success) {
      debugLog('Successfully deleted monthly target');
    } else {
      console.error('Invalid API response format:', response.data);
      throw new Error(response.data?.message || 'Failed to delete monthly target');
    }
  } catch (error) {
    console.error('Error deleting monthly target:', error);
    throw error;
  }
};

// Function to format currency values
export const formatCurrency = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(2)}`;
};

// Helper function to get month name from month number (0-11)
export const getMonthName = (month: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};
