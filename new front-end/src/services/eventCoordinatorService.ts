import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Types for Event Coordinator Dashboard
export interface BulkBookingChunk {
  _id: string;
  user: string;
  purchaseDate: string;
  parkingName: string;
  chunkName: string;
  company: string;
  totalSpots: number;
  usedSpots: number;
  availableSpots: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expired' | 'Full';
  remarks?: string;
  vehicleType: 'car' | 'bicycle' | 'truck';
  qrImage?: string;
}

export interface CustomerUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phone?: string;
  country?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDetail {
  _id: string;
  type: 'booking' | 'billing' | 'bulkbooking' | 'admin';
  amount: number;
  method: string;
  status: string;
  date: string;
  name: string;
  bookedBy?: string;
  chunkName?: string;
  company?: string;
  landownerName?: string;
  parkingName?: string;
}

// Service class for Event Coordinator APIs
class EventCoordinatorService {

  // Get bulk booking chunks for a specific user (Event Coordinator's parking locations)
  async getBulkBookingChunks(userId: string): Promise<BulkBookingChunk[]> {
    try {
      console.log('Fetching bulk booking chunks for user:', userId);
      const response = await axios.get(
        `${API_BASE_URL}/bulkbooking/user/${userId}`,
        {
          withCredentials: true, // Use HTTP-only cookies for authentication
        }
      );
      console.log('Bulk booking chunks data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching bulk booking chunks:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Get all users with 'user' role (customers)
  async getCustomers(): Promise<CustomerUser[]> {
    try {
      console.log('Fetching customer users...');
      const response = await axios.get(
        `${API_BASE_URL}/users/role/user`,
        {
          withCredentials: true,
        }
      );
      console.log('Customer users data received:', response.data);
      // The API returns { success: true, count: number, data: UserArray }
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Get transaction details (for recent transactions)
  async getTransactionDetails(): Promise<TransactionDetail[]> {
    try {
      console.log('Fetching transaction details...');
      const response = await axios.get(
        `${API_BASE_URL}/transactions/details`,
        {
          withCredentials: true,
        }
      );
      console.log('Transaction details data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Get dashboard summary data for Event Coordinator
  async getDashboardSummary(userId: string) {
    try {
      console.log('Fetching dashboard summary for user:', userId);
      
      // Fetch all necessary data in parallel
      const [bulkBookings, customers, transactions] = await Promise.allSettled([
        this.getBulkBookingChunks(userId),
        this.getCustomers(),
        this.getTransactionDetails()
      ]);

      // Extract data from settled promises
      const bulkBookingData = bulkBookings.status === 'fulfilled' ? bulkBookings.value : [];
      const customerData = customers.status === 'fulfilled' ? customers.value : [];
      const transactionData = transactions.status === 'fulfilled' ? transactions.value : [];

      // Calculate summary metrics
      const totalPurchasedSpots = bulkBookingData.reduce((sum, booking) => sum + booking.totalSpots, 0);
      const totalAvailableSpots = bulkBookingData.reduce((sum, booking) => sum + booking.availableSpots, 0);
      
      // Filter recent transactions (last 30 days) and calculate revenue
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentTransactions = transactionData.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= thirtyDaysAgo && 
               (transaction.type === 'bulkbooking' ) &&
               transaction.status.toLowerCase() === 'completed';
      });
      
      const totalRevenue = recentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      const totalCustomers = customerData.length;

      // Transform bulk bookings to match frontend expectations
      const parkingLocations = bulkBookingData.map(booking => ({
        id: booking._id,
        name: booking.parkingName,
        address: booking.chunkName, // Using chunk name as address for now
        totalSpots: booking.totalSpots,
        availableSpots: booking.availableSpots,
        pricePerHour: 0, // This would need to be calculated from pricing data
        purchasedSpots: booking.usedSpots
      }));

      // Transform customers to match frontend expectations
      const transformedCustomers = customerData.slice(0, 10).map((customer, index) => ({
        id: customer._id,
        name: customer.username || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown User',
        email: customer.email,
        assignedSpots: Math.floor(Math.random() * 20) + 1, // This would need to be calculated from actual assignments
        lastActivity: index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : '3 hours ago' // This would come from actual activity data
      }));

      // Transform recent transactions to match frontend expectations
      const transformedTransactions = recentTransactions.slice(0, 5).map(transaction => ({
        id: transaction._id,
        date: new Date(transaction.date).toISOString().split('T')[0],
        amount: transaction.amount,
        location: transaction.parkingName || 'Unknown Location',
        customer: transaction.name || transaction.bookedBy || 'Unknown Customer',
        duration: transaction.type === 'bulkbooking' ? '1 Month' : '1 Day',
        status: transaction.status.toLowerCase() === 'completed' ? 'completed' as const : 'pending' as const
      }));

      console.log('Dashboard summary calculated:', {
        totalPurchasedSpots,
        totalAvailableSpots,
        totalRevenue,
        totalCustomers,
        parkingLocations: parkingLocations.length,
        customers: transformedCustomers.length,
        transactions: transformedTransactions.length
      });

      return {
        metrics: {
          totalPurchasedSpots,
          totalAvailableSpots,
          totalRevenue,
          totalCustomers
        },
        parkingLocations,
        customers: transformedCustomers,
        recentTransactions: transformedTransactions,
        alerts: [
          // These would typically come from real data analysis
          ...(totalAvailableSpots < totalPurchasedSpots * 0.2 ? [{
            id: Date.now(),
            message: 'Low parking inventory - consider purchasing more spots',
            severity: 'medium' as const,
            time: '1 hour ago'
          }] : []),
          ...(recentTransactions.length > 0 ? [{
            id: Date.now() + 1,
            message: `${recentTransactions.length} new transactions this month`,
            severity: 'low' as const,
            time: '2 hours ago'
          }] : [])
        ]
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw new Error('Failed to fetch dashboard data');    }
  }
}

// Export a singleton instance
export const eventCoordinatorService = new EventCoordinatorService();
export default eventCoordinatorService;
