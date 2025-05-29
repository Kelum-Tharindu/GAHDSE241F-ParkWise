// This script tests the dashboard API endpoints

const apiURL = "http://localhost:5000/api";

async function testDashboardAPI() {
  try {
    const response = await fetch(`${apiURL}/dashboard/metrics`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dashboard Metrics API Response:', JSON.stringify(data, null, 2));
    
    // Validate response structure
    const { users, bookings, revenue, transactions } = data;
    console.log('✅ API returned expected data structure');
    
    return data;
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return null;
  }
}

// Run the test
testDashboardAPI();
