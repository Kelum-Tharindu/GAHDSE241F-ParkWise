// Test script for Parking Payment API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Mock user ID for testing
const TEST_USER_ID = '64a5f8b2e3c4d5e6f7890123'; // Replace with actual user ID from your database

async function testParkingPaymentAPI() {
    try {
        console.log('🧪 Testing Parking Payment API...\n');

        // Test 1: Get parking payment summary for user
        console.log('Test 1: Getting parking payment summary for user');
        try {
            const response = await axios.get(`${BASE_URL}/parking-payments/user/${TEST_USER_ID}`, {
                headers: {
                    'Authorization': 'Bearer your-jwt-token-here', // Replace with actual token
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ User payment summary:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log('❌ User payment summary failed:', error.response?.data || error.message);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Get all parking payments (admin)
        console.log('Test 2: Getting all parking payments (admin)');
        try {
            const response = await axios.get(`${BASE_URL}/parking-payments/all`, {
                headers: {
                    'Authorization': 'Bearer your-admin-jwt-token-here', // Replace with actual admin token
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ All payments:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log('❌ All payments failed:', error.response?.data || error.message);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Test with invalid user ID
        console.log('Test 3: Testing with invalid user ID');
        try {
            const response = await axios.get(`${BASE_URL}/parking-payments/user/invalid-id`, {
                headers: {
                    'Authorization': 'Bearer your-jwt-token-here', // Replace with actual token
                    'Content-Type': 'application/json'
                }
            });
            console.log('❌ Should have failed with invalid ID');
        } catch (error) {
            console.log('✅ Correctly failed with invalid ID:', error.response?.data || error.message);
        }

        console.log('\n🎉 API testing completed!');

    } catch (error) {
        console.error('💥 Test setup error:', error.message);
    }
}

// Instructions for manual testing
console.log(`
📋 MANUAL TESTING INSTRUCTIONS:
===============================

1. Start your backend server:
   cd back-end && npm start

2. Update this script with:
   - Real user ID from your database
   - Valid JWT tokens for authentication

3. Run this test:
   node tests/testParkingPaymentAPI.js

4. API Endpoints available:
   - GET /api/parking-payments/user/:userId
   - GET /api/parking-payments/all
   - GET /api/parking-payments/details/:slotId
   - PUT /api/parking-payments/usage/:slotId

5. Expected Response Format:
   {
     "slots": [...],
     "summary": {
       "totalSpent": number,
       "totalSlots": number,
       "activePayments": number,
       "pendingPayments": number,
       "overduePayments": number,
       "averageUsage": number
     }
   }

`);

// Run tests
testParkingPaymentAPI();
