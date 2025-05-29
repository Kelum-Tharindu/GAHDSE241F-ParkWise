import axios from 'axios';

// Function to test the dashboard metrics API
async function testDashboardAPI() {
  try {
    console.log('Testing dashboard metrics API...');
    const response = await axios.get('http://localhost:5000/api/dashboard/metrics');
    
    console.log('API Response:', response.data);
    
    // Check if the response has the expected structure
    const { users, bookings, revenue, transactions } = response.data;
    
    console.log('Users metrics:', users);
    console.log('Bookings metrics:', bookings);
    console.log('Revenue metrics:', revenue);
    console.log('Transactions metrics:', transactions);
    
    console.log('API test completed successfully!');
    return response.data;
  } catch (error) {
    console.error('Error testing dashboard API:', error.message);
    if (error.response) {
      console.error('API error response:', error.response.data);
    }
    throw error;
  }
}

export { testDashboardAPI };
