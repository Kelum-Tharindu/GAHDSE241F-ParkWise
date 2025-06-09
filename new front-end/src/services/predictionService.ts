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
  parking_lot_id?: number; // Optional in the interface, but we'll default it to 1
}

export interface DemandClassificationResponse {
  prediction: number; // cluster ID
}

// API 1: Predict Parking Availability
export const predictParkingAvailability = async (
  data: ParkingAvailabilityRequest
): Promise<ParkingAvailabilityResponse> => {
  try {
    // Transform data keys to match backend expectations
    const transformedData = {
      Timestamp: data.timestamp,
      Parking_Lot_ID: data.parking_lot_id,
      Event: data.event,
      Holiday: data.holiday,
      Weather: data.weather
    };
    
    const response = await axios.post(`${API_BASE_URL}/predict`, transformedData);
    console.log('Backend response:', response.data);
    
    // Transform response keys to match frontend expectations
    const transformedResponse: ParkingAvailabilityResponse = {
      available_car_spots: response.data.Available_Car_Spots,
      available_van_spots: response.data.Available_Van_Spots,
      available_truck_spots: response.data.Available_Truck_Spots,
      available_motorcycle_spots: response.data.Available_Motorcycle_Spots
    };
    
    console.log('Transformed response for frontend:', transformedResponse);
    return transformedResponse;
  } catch (error) {
    console.error('Error predicting parking availability:', error);
    throw error;
  }
};

// API 2: Predict Rush Hour
export const predictRushHour = async (
  data: RushHourRequest
): Promise<RushHourResponse> => {
  try {    // Transform data keys to match backend expectations
    const transformedData = {
      Timestamp: data.timestamp,
      Parking_Lot_ID: data.parking_lot_id,
      Weather: data.weather,
      Avg_Entry_15Min: data.avg_entry_15min,
      Avg_Exit_15Min: data.avg_exit_15min,
      Avg_Waiting_Time: data.avg_waiting_time
    };
    
    const response = await axios.post(`${API_BASE_URL}/predict2`, transformedData);
    console.log('Backend response for rush hour prediction:', response.data);
      // Transform response keys to match frontend expectations
    const transformedResponse: RushHourResponse = {
      rush_hour_prediction: response.data.Rush_Hour_Prediction
    };
    
    console.log('Transformed rush hour response for frontend:', transformedResponse);
    return transformedResponse;
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
    // Use lowercase keys to match backend expectations
    const transformedData = {
      timestamp: data.timestamp,
      total_used_slots: data.total_used_slots,
      total_booking_count: data.total_booking_count,
      weather: data.weather,
      parking_lot_id: data.parking_lot_id || 1 // Include optional parameter with default
    };    const response = await axios.post(`${API_BASE_URL}/predict3`, transformedData);
    console.log('Backend response for demand classification:', response.data);
    
    // Transform response keys to match frontend expectations
    const transformedResponse: DemandClassificationResponse = {
      prediction: response.data.prediction
    };
    
    console.log('Transformed demand classification response for frontend:', transformedResponse);
    return transformedResponse;
  } catch (error) {
    console.error('Error predicting demand classification:', error);
    throw error;
  }
};
