import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import {
  ParkingAvailabilityRequest,
  ParkingAvailabilityResponse,
  RushHourRequest,
  RushHourResponse,
  DemandClassificationRequest,
  DemandClassificationResponse,
  predictParkingAvailability,
  predictRushHour,
  predictDemandClassification
} from '../../services/predictionService';
import { Card } from '../../components/ui/card';
import { Label } from '@radix-ui/react-label';
import toast from 'react-hot-toast';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css'; // For dark mode support
import '../../styles/colors.css'; // Import custom ParkWise colors
import styles from './styles.module.css'; // Import component-specific styles

// Prediction types
type PredictionType = 'availability' | 'rushHour' | 'demand';

export default function PredictionDashboard() {
  // State for form selection
  const [predictionType, setPredictionType] = useState<PredictionType>('availability');
  
  // State for theme
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Detect system theme preference on component mount
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Add listener for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // State for form inputs
  const [parkingAvailabilityForm, setParkingAvailabilityForm] = useState<ParkingAvailabilityRequest>({
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    parking_lot_id: 1,
    event: 0,
    holiday: 0,
    weather: 3, // Default to Sunny
  });

  const [rushHourForm, setRushHourForm] = useState<RushHourRequest>({
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    parking_lot_id: 1,
    weather: 3, // Default to Sunny
    avg_entry_15min: 0,
    avg_exit_15min: 0,
    avg_waiting_time: 0,
  });

  const [demandForm, setDemandForm] = useState<DemandClassificationRequest>({
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    total_used_slots: 0,
    total_booking_count: 0,
    weather: 2, // Default to Sunny
  });

  // State for prediction results
  const [parkingAvailabilityResult, setParkingAvailabilityResult] = useState<ParkingAvailabilityResponse | null>(null);
  const [rushHourResult, setRushHourResult] = useState<RushHourResponse | null>(null);
  const [demandResult, setDemandResult] = useState<DemandClassificationResponse | null>(null);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);    try {
      switch (predictionType) {
        case 'availability': {
          const availabilityResult = await predictParkingAvailability(parkingAvailabilityForm);
          setParkingAvailabilityResult(availabilityResult);
          break;
        }
        case 'rushHour': {
          const rushHourResponse = await predictRushHour(rushHourForm);
          setRushHourResult(rushHourResponse);
          break;
        }
        case 'demand': {
          const demandResult = await predictDemandClassification(demandForm);
          setDemandResult(demandResult);
          break;
        }
      }
      toast.success('Prediction completed successfully!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to complete prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes for parking availability form
  const handleParkingAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParkingAvailabilityForm(prev => ({
      ...prev,
      [name]: name === 'parking_lot_id' || name === 'event' || name === 'holiday' || name === 'weather'
        ? Number(value)
        : value
    }));
  };

  // Handle input changes for rush hour form
  const handleRushHourChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRushHourForm(prev => ({
      ...prev,
      [name]: name === 'parking_lot_id' || name === 'weather' || 
              name === 'avg_entry_15min' || name === 'avg_exit_15min' || 
              name === 'avg_waiting_time'
        ? Number(value)
        : value
    }));
  };

  // Handle input changes for demand classification form
  const handleDemandChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemandForm(prev => ({
      ...prev,
      [name]: name === 'total_used_slots' || name === 'total_booking_count' || name === 'weather'
        ? Number(value)
        : value
    }));
  };  // Handle date change for parking availability form
  const handleParkingAvailabilityDateChange = (selectedDates: Date[]) => {
    if (selectedDates && selectedDates[0]) {
      // Format the date to match the API's expected format: YYYY-MM-DD HH:MM:SS
      const formattedDate = selectedDates[0].toISOString().slice(0, 19).replace('T', ' ');
      setParkingAvailabilityForm(prev => ({
        ...prev,
        timestamp: formattedDate
      }));
    }
  };

  // Handle date change for rush hour form
  const handleRushHourDateChange = (selectedDates: Date[]) => {
    if (selectedDates && selectedDates[0]) {
      const formattedDate = selectedDates[0].toISOString().slice(0, 19).replace('T', ' ');
      setRushHourForm(prev => ({
        ...prev,
        timestamp: formattedDate
      }));
    }
  };
  // Handle date change for demand classification form
  const handleDemandDateChange = (selectedDates: Date[]) => {
    if (selectedDates && selectedDates[0]) {
      const formattedDate = selectedDates[0].toISOString().slice(0, 19).replace('T', ' ');
      setDemandForm(prev => ({
        ...prev,
        timestamp: formattedDate
      }));
    }
  };
  
  // Render weather options for both models
  const renderWeatherOptions = (weatherFormat: 'format1' | 'format2') => {
    if (weatherFormat === 'format1') {
      // For API 1 and 2: 1: Rainy, 2: Snowy, 3: Sunny
      return (
        <>
          <option value={1}>Rainy</option>
          <option value={2}>Snowy</option>
          <option value={3}>Sunny</option>
        </>
      );
    } else {
      // For API 3: 0: Rainy, 1: Snowy, 2: Sunny
      return (
        <>
          <option value={0}>Rainy</option>
          <option value={1}>Snowy</option>
          <option value={2}>Sunny</option>
        </>
      );
    }
  };  return (
    <>
      <PageMeta
        title="Parking Prediction Dashboard | ParkWise"
        description="Smart parking analytics dashboard to predict parking availability, rush hour, and demand classification"
      />
      
      <div className={`space-y-6 ${styles.predictionDashboard} ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Parking Prediction Dashboard</h1>
         
        </div>{/* Model Selection */}
        <Card className={`p-6 ${styles.customCard}`}>
          <h2 className="text-xl font-medium mb-4">Select Prediction Model</h2>
          <div className="grid grid-cols-3 gap-4">
            <button 
              className={`p-4 rounded-lg border transition-colors ${styles.modelButton} ${predictionType === 'availability' 
                ? styles.modelButtonActive
                : ''}`}
              onClick={() => setPredictionType('availability')}
            >
              Parking Availability
            </button>
            <button 
              className={`p-4 rounded-lg border transition-colors ${styles.modelButton} ${predictionType === 'rushHour' 
                ? styles.modelButtonActive
                : ''}`}
              onClick={() => setPredictionType('rushHour')}
            >
              Rush Hour Prediction
            </button>
            <button 
              className={`p-4 rounded-lg border transition-colors ${styles.modelButton} ${predictionType === 'demand' 
                ? styles.modelButtonActive
                : ''}`}
              onClick={() => setPredictionType('demand')}
            >
              Demand Classification
            </button>
          </div>
        </Card>        {/* Input Form */}
        <Card className={`p-6 ${styles.customCard}`}>
          <h2 className="text-xl font-medium mb-4">Prediction Input Parameters</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Parking Availability Form */}
            {predictionType === 'availability' && (
              <div className="space-y-4">                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timestamp" className={styles.customLabel}>Timestamp</Label>
                    <div className="relative">
                      <Flatpickr
                        value={parkingAvailabilityForm.timestamp}
                        onChange={handleParkingAvailabilityDateChange}
                        options={{
                          enableTime: true,
                          dateFormat: 'Y-m-d H:i:S',
                          time_24hr: true,
                          minuteIncrement: 1
                        }}
                        className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput} ${styles.flatpickrDark}`}
                        placeholder="Select date and time"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD HH:MM:SS</p>
                  </div>
                  <div>
                    <Label htmlFor="parking_lot_id" className={styles.customLabel}>Parking Lot ID</Label>
                    <input
                      type="number"
                      id="parking_lot_id"
                      name="parking_lot_id"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={parkingAvailabilityForm.parking_lot_id}
                      onChange={handleParkingAvailabilityChange}
                      required
                    />
                  </div>
                </div>                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="event" className={styles.customLabel}>Event</Label>
                    <select
                      id="event"
                      name="event"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customSelect}`}
                      value={parkingAvailabilityForm.event}
                      onChange={handleParkingAvailabilityChange}
                      required
                    >
                      <option value={0}>No Event</option>
                      <option value={1}>Event</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="holiday" className={styles.customLabel}>Holiday</Label>
                    <select
                      id="holiday"
                      name="holiday"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customSelect}`}
                      value={parkingAvailabilityForm.holiday}
                      onChange={handleParkingAvailabilityChange}
                      required
                    >
                      <option value={0}>Not Holiday </option>
                      <option value={1}>Holiday </option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="weather" className={styles.customLabel}>Weather</Label>
                    <select
                      id="weather"
                      name="weather"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customSelect}`}
                      value={parkingAvailabilityForm.weather}
                      onChange={handleParkingAvailabilityChange}
                      required
                    >
                      {renderWeatherOptions('format1')}
                    </select>
                  </div>
                </div>
              </div>
            )}            {/* Rush Hour Prediction Form */}
            {predictionType === 'rushHour' && (
              <div className="space-y-4">                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timestamp" className={styles.customLabel}>Timestamp</Label>
                    <div className="relative">
                      <Flatpickr
                        value={rushHourForm.timestamp}
                        onChange={handleRushHourDateChange}
                        options={{
                          enableTime: true,
                          dateFormat: 'Y-m-d H:i:S',
                          time_24hr: true,
                          minuteIncrement: 1
                        }}
                        className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput} ${styles.flatpickrDark}`}
                        placeholder="Select date and time"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD HH:MM:SS</p>
                  </div>
                  <div>
                    <Label htmlFor="parking_lot_id" className={styles.customLabel}>Parking Lot ID</Label>
                    <input
                      type="number"
                      id="parking_lot_id"
                      name="parking_lot_id"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={rushHourForm.parking_lot_id}
                      onChange={handleRushHourChange}
                      required
                    />
                  </div>
                </div>                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="weather" className={styles.customLabel}>Weather</Label>
                    <select
                      id="weather"
                      name="weather"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customSelect}`}
                      value={rushHourForm.weather}
                      onChange={handleRushHourChange}
                      required
                    >
                      {renderWeatherOptions('format1')}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="avg_entry_15min" className={styles.customLabel}>Avg. Entry (15min)</Label>
                    <input
                      type="number"
                      id="avg_entry_15min"
                      name="avg_entry_15min"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={rushHourForm.avg_entry_15min}
                      onChange={handleRushHourChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="avg_exit_15min" className={styles.customLabel}>Avg. Exit (15min)</Label>
                    <input
                      type="number"
                      id="avg_exit_15min"
                      name="avg_exit_15min"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={rushHourForm.avg_exit_15min}
                      onChange={handleRushHourChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="avg_waiting_time" className={styles.customLabel}>Avg. Waiting Time</Label>
                    <input
                      type="number"
                      id="avg_waiting_time"
                      name="avg_waiting_time"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={rushHourForm.avg_waiting_time}
                      onChange={handleRushHourChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}            {/* Demand Classification Form */}
            {predictionType === 'demand' && (
              <div className="space-y-4">                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="timestamp" className={styles.customLabel}>Timestamp</Label>
                    <div className="relative">
                      <Flatpickr
                        value={demandForm.timestamp}
                        onChange={handleDemandDateChange}
                        options={{
                          enableTime: true,
                          dateFormat: 'Y-m-d H:i:S',
                          time_24hr: true,
                          minuteIncrement: 1
                        }}
                        className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput} ${styles.flatpickrDark}`}
                        placeholder="Select date and time"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD HH:MM:SS</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="total_used_slots" className={styles.customLabel}>Total Used Slots</Label>
                    <input
                      type="number"
                      id="total_used_slots"
                      name="total_used_slots"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={demandForm.total_used_slots}
                      onChange={handleDemandChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_booking_count" className={styles.customLabel}>Total Booking Count</Label>
                    <input
                      type="number"
                      id="total_booking_count"
                      name="total_booking_count"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customInput}`}
                      value={demandForm.total_booking_count}
                      onChange={handleDemandChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weather" className={styles.customLabel}>Weather</Label>
                    <select
                      id="weather"
                      name="weather"
                      className={`mt-1 block w-full rounded-md shadow-sm ${styles.customSelect}`}
                      value={demandForm.weather}
                      onChange={handleDemandChange}
                      required
                    >
                      {renderWeatherOptions('format2')}
                    </select>
                  </div>
                </div>
              </div>
            )}            <div className="pt-4">
              <button
                type="submit"
                className={`w-full rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  transition-colors ${styles.primaryButton}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Generate Prediction'}
              </button>
            </div>
          </form>
        </Card>        {/* Results Section */}
        {(parkingAvailabilityResult || rushHourResult || demandResult) && (
          <Card className={`p-6 ${styles.customCard}`}>
            <h2 className="text-xl font-medium mb-4">Prediction Results</h2>
            
            {/* Parking Availability Results */}
            {parkingAvailabilityResult && predictionType === 'availability' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg shadow border ${styles.resultCard}`}>
                  <h3 className="text-sm font-medium">Available Car Spots</h3>
                  <p className="text-2xl font-semibold mt-1">{parkingAvailabilityResult.available_car_spots}</p>
                </div>
                <div className={`p-4 rounded-lg shadow border ${styles.resultCard}`}>
                  <h3 className="text-sm font-medium">Available Van Spots</h3>
                  <p className="text-2xl font-semibold mt-1">{parkingAvailabilityResult.available_van_spots}</p>
                </div>
                <div className={`p-4 rounded-lg shadow border ${styles.resultCard}`}>
                  <h3 className="text-sm font-medium">Available Truck Spots</h3>
                  <p className="text-2xl font-semibold mt-1">{parkingAvailabilityResult.available_truck_spots}</p>
                </div>
                <div className={`p-4 rounded-lg shadow border ${styles.resultCard}`}>
                  <h3 className="text-sm font-medium">Available Motorcycle Spots</h3>
                  <p className="text-2xl font-semibold mt-1">{parkingAvailabilityResult.available_motorcycle_spots}</p>
                </div>
              </div>
            )}              {/* Rush Hour Results */}
            {rushHourResult && predictionType === 'rushHour' && (
              <div className={`p-6 rounded-lg shadow border ${styles.resultCard}`}>
                <h3 className="text-lg font-medium mb-2">Rush Hour Prediction</h3>
                <div className="flex items-center justify-center p-4">
                  <div className={`text-2xl font-bold p-4 rounded-full ${
                    rushHourResult.rush_hour_prediction === 1 
                    ? styles.statusWarning
                    : styles.statusSuccess
                  }`}>
                    {rushHourResult.rush_hour_prediction === 1 
                      ? 'Rush Hour Detected ⚠️' 
                      : 'No Rush Hour 👍'}
                  </div>
                </div>
                <p className="text-center mt-2">
                  {rushHourResult.rush_hour_prediction === 1 
                    ? 'Expect congestion and longer waiting times.' 
                    : 'Traffic flow is normal.'}
                </p>
              </div>
            )}              {/* Demand Classification Results */}
            {demandResult && predictionType === 'demand' && (
              <div className={`p-6 rounded-lg shadow border ${styles.resultCard}`}>
                <h3 className="text-lg font-medium mb-2">Demand Classification Result</h3>
                <div className="flex items-center justify-center p-4">
                  <div className={`text-3xl font-bold p-6 rounded-full ${styles.statusSuccess}`}>
                    Cluster #{demandResult.prediction}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium">Demand Group Interpretation:</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {demandResult.prediction === 0 && (
                      <>
                        <li>Low demand cluster</li>
                        <li>Off-peak hours with minimal parking usage</li>
                        <li>Consider promotions or special rates</li>
                      </>
                    )}
                    {demandResult.prediction === 1 && (
                      <>
                        <li>Medium demand cluster</li>
                        <li>Moderate parking usage</li>
                        <li>Regular operations appropriate</li>
                      </>
                    )}
                    {demandResult.prediction === 2 && (
                      <>
                        <li>High demand cluster</li>
                        <li>Peak hours with high utilization</li>
                        <li>Consider dynamic pricing</li>
                      </>
                    )}
                    {demandResult.prediction >= 3 && (
                      <>
                        <li>Special demand pattern</li>
                        <li>Unusual usage pattern detected</li>
                        <li>Further analysis recommended</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
