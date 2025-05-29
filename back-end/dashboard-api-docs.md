# ParkWise Dashboard API

## Dashboard Metrics API

### Get Dashboard Metrics
- **URL**: `/api/dashboard/metrics`
- **Method**: `GET`
- **Description**: Returns metrics data for the admin dashboard including user counts, booking counts, revenue, and transaction data with growth percentages.
- **Response Format**:
  ```json
  {
    "users": {
      "total": 3782,
      "growth": 11.01,
      "trend": "up"
    },
    "bookings": {
      "total": 5359,
      "growth": -9.05,
      "trend": "down"
    },
    "revenue": {
      "total": 120450,
      "growth": 15.8,
      "trend": "up"
    },
    "transactions": {
      "total": 6217,
      "recent": 412
    }
  }
  ```

## Frontend Implementation

The dashboard metrics are displayed in the `EcommerceMetrics` component which:
- Fetches metrics data from the API endpoint
- Displays user counts, booking counts, revenue, and transaction data
- Shows growth trends with up/down indicators
- Includes fallback metrics in case the API fails
- Provides error handling and retry functionality

## Testing the API

You can test the API endpoint by running:
```
cd back-end
node tests/testDashboardAPI.js
```
