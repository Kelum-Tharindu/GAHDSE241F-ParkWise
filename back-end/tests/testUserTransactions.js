const axios = require('axios');
require('dotenv').config();

async function testTransactionsByUserId() {
  try {
    // Replace with an actual user ID from your database
    const testUserId = '64f07db4f00163c3fccb0bd7'; // Sample user ID - replace with a real one

    // First, get a token by logging in
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    });

    const token = loginResponse.data.token;
    
    if (!token) {
      console.error('Failed to get authentication token');
      return;
    }

    console.log('✅ Authentication successful');

    // Now test the user transactions endpoint
    const response = await axios.get(`http://localhost:5000/api/transactions/user/${testUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ API Response Status:', response.status);
    console.log('✅ Number of transactions:', response.data.transactions.length);
    console.log('✅ Transaction Summary:', response.data.summary);
    
    if (response.data.transactions.length > 0) {
      console.log('\n✅ Sample Transaction:');
      console.log(JSON.stringify(response.data.transactions[0], null, 2));
    } else {
      console.log('\n⚠️ No transactions found for this user');
    }
    
  } catch (error) {
    console.error('❌ Error testing transactions endpoint:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
  }
}

testTransactionsByUserId();
