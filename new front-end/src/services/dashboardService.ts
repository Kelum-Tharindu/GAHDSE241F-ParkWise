import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api/dashboard';

// Define metric data type
export interface DashboardMetrics {
  users: {
    total: number;
    growth: number;
    trend: 'up' | 'down';
  };
  bookings: {
    total: number;
    growth: number;
    trend: 'up' | 'down';
  };
  revenue: {
    total: number;
    growth: number;
    trend: 'up' | 'down';
  };
  transactions: {
    total: number;
    recent: number;
  };
}

// Fallback metrics in case the API fails
export const fallbackMetrics: DashboardMetrics = {
  users: {
    total: 3782,
    growth: 11.01,
    trend: 'up'
  },
  bookings: {
    total: 5359,
    growth: -9.05,
    trend: 'down'
  },
  revenue: {
    total: 120450,
    growth: 15.8,
    trend: 'up'
  },
  transactions: {
    total: 6217,
    recent: 412
  }
};

// Get dashboard metrics
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    console.log('Fetching dashboard metrics from API...');
    const response = await axios.get(`${API_URL}/metrics`);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    console.log('Using fallback metrics data');
    return fallbackMetrics;
  }
};
