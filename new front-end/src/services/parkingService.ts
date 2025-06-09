import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Types for parking data
export interface ParkingAddress {
  street: string;
  city: string;
  province: string;
  country: string;
}

export interface VehicleSlotDetails {
  totalSlot: number;
  bookingSlot: number;
  bookingAvailableSlot: number;
  withoutBookingSlot: number;
  withoutBookingAvailableSlot: number;
  perPrice30Min: number;
  perDayPrice: number;
}

export interface ParkingSlotDetails {
  car: VehicleSlotDetails;
  bicycle: VehicleSlotDetails;
  truck: VehicleSlotDetails;
}

export interface ParkingLocation {
  latitude: number;
  longitude: number;
  address: ParkingAddress;
}

export interface ParkingData {
  id: string;
  name: string;
  slotDetails: ParkingSlotDetails;
  location: ParkingLocation;
}

// API service class
class ParkingService {
  // Get all parking details for frontend (without sensitive info)
  async getAllParkingForFrontend(): Promise<ParkingData[]> {
    try {
      console.log('===REQUEST=== Fetching all parking locations for frontend');
      
      const response = await axios.get<ParkingData[]>(
        `${API_BASE_URL}/parking/frontend`
      );
      
      console.log(`===RESPONSE=== Received ${response.data.length} parking locations`);
      return response.data;
    } catch (error) {
      console.error('===ERROR=== Error fetching parking locations:', error);
      throw this.handleError(error);
    }
  }

  // Get parking details by ID
  async getParkingById(id: string): Promise<ParkingData> {
    try {
      console.log(`===REQUEST=== Fetching parking location with ID: ${id}`);
      
      const response = await axios.get<ParkingData>(
        `${API_BASE_URL}/parking/${id}`
      );
      
      console.log('===RESPONSE=== Received parking location details');
      return response.data;
    } catch (error) {
      console.error('===ERROR=== Error fetching parking location details:', error);
      throw this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any): Error {
    let errorMessage = 'An unknown error occurred';
    
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return new Error(errorMessage);
  }
}

export const parkingService = new ParkingService();
