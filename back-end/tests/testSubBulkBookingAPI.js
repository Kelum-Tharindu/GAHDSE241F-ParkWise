const mongoose = require('mongoose');
const axios = require('axios');

// Test configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
    username: 'testcoordinator2',
    password: 'Test123!',
    email: 'testuser2@test.com',
    role: 'Parking Coordinator'
};
const TEST_CUSTOMER_ID = '507f1f77bcf86cd799439012'; // Mock Customer ID

// Test data
let authCookies = '';
let testSubBulkBookingId = '';
let testBulkBookingId = '';
let testUserId = '';

async function runSubBulkBookingTests() {
    console.log('🚀 Starting Sub Bulk Booking API Tests...\n');

    try {        // Test 1: Check server connectivity
        console.log('📡 Test 1: Server Connectivity');
        try {
            const response = await axios.get(`http://localhost:5000/`);
            console.log('✅ Server is running');
        } catch (error) {
            console.log('❌ Server connectivity failed:', error.message);
            console.log('🔧 Please ensure the backend server is running on port 5000');
            return;
        }        // Test 2: Authentication (Real login)
        console.log('\n🔐 Test 2: Authentication');
        try {
            const loginResponse = await axios.post(
                `${API_BASE_URL}/auth/login`,
                {
                    username: TEST_USER.username,
                    password: TEST_USER.password
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            // Extract cookies from response
            if (loginResponse.headers['set-cookie']) {
                authCookies = loginResponse.headers['set-cookie'].join('; ');
                console.log('✅ Authentication successful');
                console.log(`   - Role: ${loginResponse.data.role}`);
                
                // Set default axios config to include cookies
                axios.defaults.headers.common['Cookie'] = authCookies;
                axios.defaults.withCredentials = true;
            } else {
                console.log('❌ No authentication cookies received');
                return;
            }
        } catch (error) {
            console.log('❌ Authentication failed:', error.response?.data?.message || error.message);
            return;
        }        // Test 3: Get available bulk bookings for assignment
        console.log('\n📋 Test 3: Get Available Bulk Bookings');
        try {
            // First, we need to get the actual user ID from login
            const userResponse = await axios.get(`${API_BASE_URL}/users/profile`);
            testUserId = userResponse.data._id;
            console.log(`   - Using User ID: ${testUserId}`);
            
            const response = await axios.get(
                `${API_BASE_URL}/sub-bulk-booking/available/${testUserId}`
            );
            console.log('✅ Available bulk bookings retrieved');
            console.log(`   - Found ${response.data.length} available bulk bookings`);
            
            if (response.data.length > 0) {
                testBulkBookingId = response.data[0]._id;
                console.log(`   - Using bulk booking ID: ${testBulkBookingId}`);
            }
        } catch (error) {
            console.log('❌ Failed to get available bulk bookings:', error.response?.data?.message || error.message);
        }

        // Test 4: Create a new sub bulk booking
        console.log('\n➕ Test 4: Create Sub Bulk Booking');
        if (testBulkBookingId) {
            try {                const createData = {
                    owner: testUserId,
                    customer: TEST_CUSTOMER_ID,
                    bulkBooking: testBulkBookingId,
                    spotsAssigned: 2,
                    startDate: new Date('2024-12-01'),
                    endDate: new Date('2024-12-31'),
                    status: 'active'
                };

                const response = await axios.post(
                    `${API_BASE_URL}/sub-bulk-booking`,
                    createData,
                    {
                        headers: { 
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                testSubBulkBookingId = response.data._id;
                console.log('✅ Sub bulk booking created successfully');
                console.log(`   - Assignment ID: ${testSubBulkBookingId}`);
                console.log(`   - Spots assigned: ${response.data.spotsAssigned}`);
            } catch (error) {
                console.log('❌ Failed to create sub bulk booking:', error.response?.data?.message || error.message);
            }
        } else {
            console.log('⚠️  Skipping - No bulk booking available for testing');
        }

        // Test 5: Get sub bulk bookings by owner
        console.log('\n📊 Test 5: Get Sub Bulk Bookings by Owner');
        try {
            const response = await axios.get(
                `${API_BASE_URL}/sub-bulk-booking/owner/${TEST_USER_ID}`,
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );
            console.log('✅ Owner sub bulk bookings retrieved');
            console.log(`   - Found ${response.data.length} assignments`);
            
            if (response.data.length > 0) {
                const assignment = response.data[0];
                console.log(`   - Customer: ${assignment.customer?.name || 'Unknown'}`);
                console.log(`   - Spots: ${assignment.spotsAssigned}`);
                console.log(`   - Status: ${assignment.status}`);
            }
        } catch (error) {
            console.log('❌ Failed to get owner assignments:', error.response?.data?.message || error.message);
        }

        // Test 6: Update sub bulk booking
        console.log('\n✏️  Test 6: Update Sub Bulk Booking');
        if (testSubBulkBookingId) {
            try {
                const updateData = {
                    spotsAssigned: 3,
                    status: 'active'
                };

                const response = await axios.put(
                    `${API_BASE_URL}/sub-bulk-booking/${testSubBulkBookingId}`,
                    updateData,
                    {
                        headers: { 
                            Authorization: `Bearer ${authToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                console.log('✅ Sub bulk booking updated successfully');
                console.log(`   - New spots assigned: ${response.data.spotsAssigned}`);
            } catch (error) {
                console.log('❌ Failed to update sub bulk booking:', error.response?.data?.message || error.message);
            }
        } else {
            console.log('⚠️  Skipping - No sub bulk booking to update');
        }

        // Test 7: Get sub bulk bookings by customer
        console.log('\n👤 Test 7: Get Sub Bulk Bookings by Customer');
        try {
            const response = await axios.get(
                `${API_BASE_URL}/sub-bulk-booking/customer/${TEST_CUSTOMER_ID}`,
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );
            console.log('✅ Customer sub bulk bookings retrieved');
            console.log(`   - Found ${response.data.length} assignments for customer`);
        } catch (error) {
            console.log('❌ Failed to get customer assignments:', error.response?.data?.message || error.message);
        }

        // Test 8: Delete sub bulk booking
        console.log('\n🗑️  Test 8: Delete Sub Bulk Booking');
        if (testSubBulkBookingId) {
            try {
                const response = await axios.delete(
                    `${API_BASE_URL}/sub-bulk-booking/${testSubBulkBookingId}`,
                    {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }
                );
                
                console.log('✅ Sub bulk booking deleted successfully');
            } catch (error) {
                console.log('❌ Failed to delete sub bulk booking:', error.response?.data?.message || error.message);
            }
        } else {
            console.log('⚠️  Skipping - No sub bulk booking to delete');
        }

        console.log('\n🎉 Sub Bulk Booking API Tests Completed!');
        console.log('\n📝 Test Summary:');
        console.log('   - Server connectivity: ✅');
        console.log('   - Authentication: ✅');
        console.log('   - Get available bulk bookings: Tested');
        console.log('   - Create sub bulk booking: Tested');
        console.log('   - Get owner assignments: Tested');
        console.log('   - Update assignment: Tested');
        console.log('   - Get customer assignments: Tested');
        console.log('   - Delete assignment: Tested');

    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
    }
}

// Install axios if not already installed
try {
    require('axios');
} catch (error) {
    console.log('📦 Installing axios for testing...');
    require('child_process').execSync('npm install axios', { stdio: 'inherit' });
    console.log('✅ Axios installed successfully');
}

// Run the tests
runSubBulkBookingTests();
