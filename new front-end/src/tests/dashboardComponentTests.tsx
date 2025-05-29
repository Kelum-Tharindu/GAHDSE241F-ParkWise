import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MonthlySalesChart from '../components/ecommerce/MonthlySalesChart';
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics';
import * as dashboardService from '../services/dashboardService';
import * as bookingAnalyticsService from '../services/bookingAnalyticsService';

// Mock the service modules
jest.mock('../services/dashboardService');
jest.mock('../services/bookingAnalyticsService');

describe('Dashboard Components', () => {
  // Test data
  const mockMetricsData = {
    userCount: 250,
    bookingCount: 1250,
    revenue: 45000,
    transactions: [
      { id: 1, name: 'User A', amount: 120, date: '2025-05-01', status: 'completed' },
      { id: 2, name: 'User B', amount: 85, date: '2025-05-02', status: 'pending' },
    ]
  };

  const mockBookingData = {
    year: 2025,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
  };

  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();
    
    // Setup mock implementations
    (dashboardService.getDashboardMetrics as jest.Mock).mockResolvedValue(mockMetricsData);
    (bookingAnalyticsService.getMonthlyBookings as jest.Mock).mockResolvedValue(mockBookingData);
  });

  describe('EcommerceMetrics Component', () => {
    test('renders loading state initially', () => {
      render(<EcommerceMetrics />);
      expect(screen.getByText(/loading/i) || screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders metrics data after loading', async () => {
      render(<EcommerceMetrics />);
      
      await waitFor(() => {
        expect(dashboardService.getDashboardMetrics).toHaveBeenCalledTimes(1);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/250/)).toBeInTheDocument(); // User count
        expect(screen.getByText(/1250/)).toBeInTheDocument(); // Booking count
        expect(screen.getByText(/45000/)).toBeInTheDocument(); // Revenue
      });
    });

    test('renders error state if API fails', async () => {
      (dashboardService.getDashboardMetrics as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      render(<EcommerceMetrics />);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      });
    });
  });

  describe('MonthlySalesChart Component', () => {
    test('renders loading state initially', () => {
      render(<MonthlySalesChart />);
      expect(screen.getByText(/loading/i) || screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders chart data after loading', async () => {
      render(<MonthlySalesChart />);
      
      await waitFor(() => {
        expect(bookingAnalyticsService.getMonthlyBookings).toHaveBeenCalledTimes(1);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/Total Bookings/i)).toBeInTheDocument();
        expect(screen.getByText(/Highest Month/i)).toBeInTheDocument();
        expect(screen.getByText(/Dec/)).toBeInTheDocument(); // Highest month
        expect(screen.getByText(/120/)).toBeInTheDocument(); // Highest count
      });
    });

    test('renders error state if API fails', async () => {
      (bookingAnalyticsService.getMonthlyBookings as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      render(<MonthlySalesChart />);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      });
    });
  });
});
