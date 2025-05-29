import axios from 'axios';
import { fallbackMetrics } from './dashboardService';

// API URL
const API_URL = 'http://localhost:5000/api/dashboard';

// Monthly bookings data type
export interface MonthlyBookingsData {
  year: number;
  months: string[];
  data: number[];
}

// Fallback monthly bookings data in case the API fails
export const fallbackMonthlyBookings: MonthlyBookingsData = {
  year: 2025,
  months: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112]
};

// Get monthly bookings data
export const getMonthlyBookings = async (): Promise<MonthlyBookingsData> => {
  try {
    console.log('Fetching monthly bookings data from API...');
    const response = await axios.get(`${API_URL}/monthly-bookings`);
    console.log('Monthly bookings API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly bookings data:', error);
    console.log('Using fallback monthly bookings data');
    return fallbackMonthlyBookings;
  }
};
