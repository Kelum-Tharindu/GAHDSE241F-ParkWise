# Smart Parking Analytics Dashboard

This dashboard provides predictive analytics for your parking system using three different machine learning models:

1. **Parking Availability Prediction**: Predicts available spots for different vehicle types
2. **Rush Hour Prediction**: Predicts whether it's rush hour
3. **Demand Classification**: Uses KMeans clustering to classify demand patterns

## Features

- **Interactive UI**: Choose between different prediction models
- **Dynamic Forms**: Input fields change based on the selected prediction model
- **Real-time Results**: Instant predictions displayed in a clean, visual format
- **Responsive Design**: Works on all device sizes

## How to Use

1. Navigate to "Financial & Analytics" > "Prediction Dashboard" in the sidebar
2. Select which prediction model you want to use
3. Fill in the required input parameters
4. Click "Generate Prediction"
5. View the prediction results displayed below

## API Endpoints

The dashboard interacts with three backend API endpoints:

- `/predict` - Predicts available parking spots
- `/predict2` - Predicts whether it's rush hour
- `/predict3` - Predicts demand classification using KMeans

## Input Parameters

### Parking Availability Prediction
- Timestamp (format: YYYY-MM-DD HH:MM:SS)
- Parking Lot ID
- Event (0 or 1)
- Holiday (0 or 1)
- Weather (1: Rainy, 2: Snowy, 3: Sunny)

### Rush Hour Prediction
- Timestamp
- Parking Lot ID
- Weather (1: Rainy, 2: Snowy, 3: Sunny)
- Avg Entry (15min)
- Avg Exit (15min)
- Avg Waiting Time

### Demand Classification
- Timestamp
- Total Used Slots
- Total Booking Count
- Weather (0: Rainy, 1: Snowy, 2: Sunny)

## Development

To run the dashboard locally:

```bash
# Navigate to the frontend directory
cd "path/to/GAHDSE241F-ParkWise/new front-end"

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

Make sure your backend server is running and accessible at the URL specified in your environment variables or at the default URL (http://localhost:5000).

## Integration

This dashboard integrates with your existing ParkWise system and provides valuable insights for parking management decisions. The prediction models help in:

1. Optimizing parking space allocation
2. Preparing for peak hours
3. Understanding demand patterns
4. Making data-driven business decisions
