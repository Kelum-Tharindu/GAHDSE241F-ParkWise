# ParkWise Dashboard API

## Dashboard Metrics API

### Get Dashboard Metrics
- **URL**: `/api/dashboard/metrics`
- **Method**: `GET`
- **Description**: Returns metrics data for the admin dashboard including user counts, booking counts, revenue, and transaction data with growth percentages.
- **Response Format**:
  ```json
  {
    "userCount": 3782,
    "bookingCount": 5359,
    "revenue": 120450,
    "transactions": [
      {
        "id": "6497ab12e812b0f3",
        "name": "John Doe",
        "amount": 85,
        "date": "2025-05-25",
        "status": "completed"
      },
      {
        "id": "8a97b622f0e3c1d4",
        "name": "Jane Smith",
        "amount": 120,
        "date": "2025-05-24",
        "status": "pending"
      }
    ]
  }
  ```

## Monthly Bookings API

### Get Monthly Bookings
- **URL**: `/api/dashboard/monthly-bookings`
- **Method**: `GET`
- **Description**: Returns the number of bookings for each month of the current year.
- **Response Format**:
  ```json
  {
    "year": 2025,
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "data": [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112]
  }
  ```

## Frontend Implementation

### Dashboard Metrics Component
The dashboard metrics are displayed in the `EcommerceMetrics` component which:
- Fetches metrics data from the `/api/dashboard/metrics` endpoint
- Displays user counts, booking counts, revenue, and transaction data
- Provides loading states, error handling, and retry functionality
- Includes fallback metrics in case the API fails

### Monthly Bookings Chart Component
The monthly booking statistics are displayed in the `MonthlySalesChart` component which:
- Fetches monthly booking data from the `/api/dashboard/monthly-bookings` endpoint
- Displays a bar chart showing booking counts for each month
- Highlights the month with the highest bookings
- Shows total bookings and highest month statistics
- Provides loading states, error handling, and retry functionality
- Includes fallback data in case the API fails

## Testing the API

You can test the API endpoints by running:
```
cd back-end
node tests/testDashboardAPI.js
```

## Frontend Services

The frontend uses the following services to interact with the API:
- `dashboardService.ts` - For fetching dashboard metrics
- `bookingAnalyticsService.ts` - For fetching monthly booking data

Both services include fallback data mechanisms to ensure the UI always has data to display, even if the API is unavailable.
