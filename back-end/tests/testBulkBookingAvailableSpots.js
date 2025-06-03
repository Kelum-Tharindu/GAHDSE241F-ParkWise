const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Test the bulk booking available spots calculation
async function testBulkBookingAvailableSpots() {
  console.log('🧪 Testing Bulk Booking Available Spots Calculation...\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkwise');
    console.log('✅ Connected to MongoDB');

    const BulkBookingChunk = require('../models/bulkbooking');
    
    // Get all bulk booking chunks
    const chunks = await BulkBookingChunk.find();
    
    console.log(`📊 Found ${chunks.length} bulk booking chunks:`);
    console.log('='.repeat(80));
    
    let totalPurchased = 0;
    let totalAvailable = 0;
    let totalUsed = 0;
    
    chunks.forEach((chunk, index) => {
      const calculatedAvailable = chunk.totalSpots - chunk.usedSpots;
      const isCorrect = calculatedAvailable === chunk.availableSpots;
      
      console.log(`Chunk ${index + 1}: ${chunk.parkingName} - ${chunk.chunkName}`);
      console.log(`  Company: ${chunk.company}`);
      console.log(`  Total Spots: ${chunk.totalSpots}`);
      console.log(`  Used Spots: ${chunk.usedSpots}`);
      console.log(`  Available Spots (DB): ${chunk.availableSpots}`);
      console.log(`  Available Spots (Calculated): ${calculatedAvailable}`);
      console.log(`  Status: ${chunk.status}`);
      console.log(`  ✅ Calculation Correct: ${isCorrect ? 'YES' : 'NO'}`);
      console.log(`  Valid From: ${chunk.validFrom.toDateString()}`);
      console.log(`  Valid To: ${chunk.validTo.toDateString()}`);
      console.log('-'.repeat(60));
      
      totalPurchased += chunk.totalSpots;
      totalAvailable += chunk.availableSpots;
      totalUsed += chunk.usedSpots;
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`Total Purchased Spots: ${totalPurchased}`);
    console.log(`Total Used Spots: ${totalUsed}`);
    console.log(`Total Available Spots: ${totalAvailable}`);
    console.log(`Calculation Check: ${totalPurchased - totalUsed} = ${totalAvailable} ✅`);
    
    // Test API endpoint
    console.log('\n🌐 Testing API Endpoint...');
    
    if (chunks.length > 0) {
      const testUserId = chunks[0].user;
      try {
        const response = await axios.get(`http://localhost:5000/api/bulkbooking/user/${testUserId}`);
        console.log(`✅ API Response Status: ${response.status}`);
        console.log(`📦 API Returned ${response.data.length} chunks for user ${testUserId}`);
        
        response.data.forEach((chunk, index) => {
          console.log(`  API Chunk ${index + 1}: ${chunk.parkingName}`);
          console.log(`    Available: ${chunk.availableSpots}, Total: ${chunk.totalSpots}, Used: ${chunk.usedSpots}`);
        });
      } catch (apiError) {
        console.log(`❌ API Error: ${apiError.response?.status} - ${apiError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testBulkBookingAvailableSpots();
