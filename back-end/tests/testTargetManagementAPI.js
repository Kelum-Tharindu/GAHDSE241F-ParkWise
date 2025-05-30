// Test script for target management API
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your server runs on a different port
const API_ENDPOINT = '/dashboard/target-management';

// Add auth token if needed for protected routes
const AUTH_TOKEN = process.env.AUTH_TOKEN; // Set this in your environment or replace with actual token
const config = AUTH_TOKEN ? {
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
} : {};

// Target data for testing
const testTarget = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  targetAmount: 50000 // $50,000
};

// Updated target amount for testing the edit functionality
const updatedTargetAmount = 75000; // $75,000

// Function to log responses in a readable format
const logResponse = (response) => {
  console.log('\nStatus:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Test functions
const runTests = async () => {
  try {
    console.log('\n=== Testing Target Management API ===\n');
    
    // 1. Get all targets
    console.log('1. Getting all targets...');
    const getAllResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINT}`, config);
    logResponse(getAllResponse);
    
    // 2. Set a new target
    console.log('\n2. Setting a new target...');
    const setResponse = await axios.post(`${API_BASE_URL}${API_ENDPOINT}`, testTarget, config);
    logResponse(setResponse);
    
    // 3. Get the specific target
    console.log(`\n3. Getting target for ${testTarget.year}/${testTarget.month}...`);
    const getTargetResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINT}/${testTarget.year}/${testTarget.month}`, config);
    logResponse(getTargetResponse);
    
    // 4. Update the target
    console.log(`\n4. Updating target for ${testTarget.year}/${testTarget.month}...`);
    const updateResponse = await axios.put(
      `${API_BASE_URL}${API_ENDPOINT}/${testTarget.year}/${testTarget.month}`,
      { targetAmount: updatedTargetAmount },
      config
    );
    logResponse(updateResponse);
    
    // 5. Verify the update
    console.log(`\n5. Verifying update for ${testTarget.year}/${testTarget.month}...`);
    const verifyUpdateResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINT}/${testTarget.year}/${testTarget.month}`, config);
    logResponse(verifyUpdateResponse);
    
    // 6. Delete the target
    console.log('\n6. Deleting the target...');
    const deleteConfig = {
      ...config,
      data: {
        year: testTarget.year,
        month: testTarget.month
      }
    };
    const deleteResponse = await axios.delete(`${API_BASE_URL}${API_ENDPOINT}`, deleteConfig);
    logResponse(deleteResponse);
    
    // 7. Verify deletion
    console.log('\n7. Verifying deletion...');
    try {
      const finalResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINT}/${testTarget.year}/${testTarget.month}`, config);
      logResponse(finalResponse);
      console.log('\nWarning: Target was not properly deleted!');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('\nSuccess: Target was properly deleted (received 404 error as expected)');
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
      } else {
        throw error;
      }
    }
    
    console.log('\n=== All tests completed successfully ===\n');
  } catch (error) {
    console.error('\nTest failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    process.exit(1); // Exit with error code
  }
};

// Check if script is being run directly
if (require.main === module) {
  // Run the tests
  runTests();
} else {
  // Export the functions for use in other scripts
  module.exports = { runTests };
}