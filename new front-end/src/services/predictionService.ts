import axios from 'axios';

// Define the API base URL - should be configured properly in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types for API 1: Parking Availability Prediction
export interface ParkingAvailabilityRequest {
  timestamp: string;
  parking_lot_id: number;
  event: 0 | 1;
  holiday: 0 | 1;
  weather: 1 | 2 | 3; // 1: Rainy, 2: Snowy, 3: Sunny
}

export interface ParkingAvailabilityResponse {
  available_car_spots: number;
  available_van_spots: number;
  available_truck_spots: number;
  available_motorcycle_spots: number;
}

// Types for API 2: Rush Hour Prediction
export interface RushHourRequest {
  timestamp: string;
  parking_lot_id: number;
  weather: 1 | 2 | 3;
  avg_entry_15min: number;
  avg_exit_15min: number;
  avg_waiting_time: number;
}

export interface RushHourResponse {
  rush_hour_prediction: 0 | 1;
}

// Types for API 3: Demand Classification
export interface DemandClassificationRequest {
  timestamp: string;
  total_used_slots: number;
  total_booking_count: number;
  weather: 0 | 1 | 2; // 0: Rainy, 1: Snowy, 2: Sunny
}

export interface DemandClassificationResponse {
  prediction: number; // cluster ID
}

// API 1: Predict Parking Availability
export const predictParkingAvailability = async (
  data: ParkingAvailabilityRequest
): Promise<ParkingAvailabilityResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, data);
    return response.data;
  } catch (error) {
    console.error('Error predicting parking availability:', error);
    throw error;
  }
};

// API 2: Predict Rush Hour
export const predictRushHour = async (
  data: RushHourRequest
): Promise<RushHourResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict2`, data);
    return response.data;
  } catch (error) {
    console.error('Error predicting rush hour:', error);
    throw error;
  }
};

// API 3: Predict Demand Classification
export const predictDemandClassification = async (
  data: DemandClassificationRequest
): Promise<DemandClassificationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict3`, data);
    return response.data;
  } catch (error) {
    console.error('Error predicting demand classification:', error);
    throw error;
  }
};
