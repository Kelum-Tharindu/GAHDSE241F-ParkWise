import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface ParkingSlot {
  id: string;
  location: string;
  capacity: number;
  price: number;
  paymentDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  validUntil: string;
  usage: number;
  chunkName?: string;
  company?: string;
  vehicleType?: string;
  availableSpots?: number;
  usedSpots?: number;
  status?: string;
}

export interface PaymentSummary {
  totalSpent: number;
  totalSlots: number;
  activePayments: number;
  pendingPayments: number;
  overduePayments: number;
  averageUsage: number;
}

export interface ParkingPaymentResponse {
  slots: ParkingSlot[];
  summary: PaymentSummary;
}

// API service class
class ParkingPaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Get parking payment summary for a specific user
  async getParkingPaymentSummary(userId: string): Promise<ParkingPaymentResponse> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/parking-payments/user/${userId}`,
      {
        withCredentials: true, 
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching parking payment summary:', error);
    throw this.handleError(error);
  }
}


  // Get all parking payments (Admin only)
  async getAllParkingPayments(): Promise<ParkingPaymentResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/parking-payments/all`,
        {
        withCredentials: true, 
      }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all parking payments:', error);
      throw this.handleError(error);
    }
  }

  // Get detailed information for a specific parking slot payment
  async getParkingPaymentDetails(slotId: string): Promise<ParkingSlot> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/parking-payments/details/${slotId}`,
        {
        withCredentials: true, 
      }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching parking payment details:', error);
      throw this.handleError(error);
    }
  }

  // Update parking slot usage
  async updateSlotUsage(slotId: string, usedSpots: number): Promise<{ message: string; slot: any }> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/parking-payments/usage/${slotId}`,
        { usedSpots },
        {
        withCredentials: true, 
      }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating slot usage:', error);
      throw this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Unknown error occurred';
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const parkingPaymentService = new ParkingPaymentService();
