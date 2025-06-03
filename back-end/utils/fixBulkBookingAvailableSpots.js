const mongoose = require('mongoose');
require('dotenv').config();

// Fix any bulk booking chunks with incorrect availableSpots calculation
async function fixBulkBookingAvailableSpots() {
  console.log('🔧 Fixing Bulk Booking Available Spots...\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkwise');
    console.log('✅ Connected to MongoDB');

    const BulkBookingChunk = require('../models/bulkbooking');
    
    // Get all bulk booking chunks
    const chunks = await BulkBookingChunk.find();
    
    console.log(`📊 Found ${chunks.length} bulk booking chunks to check...\n`);
    
    let fixedCount = 0;
    
    for (const chunk of chunks) {
      const correctAvailableSpots = chunk.totalSpots - chunk.usedSpots;
      
      if (chunk.availableSpots !== correctAvailableSpots) {
        console.log(`🔧 Fixing chunk: ${chunk.parkingName} - ${chunk.chunkName}`);
        console.log(`  Before: availableSpots = ${chunk.availableSpots}`);
        console.log(`  After:  availableSpots = ${correctAvailableSpots}`);
        
        chunk.availableSpots = correctAvailableSpots;
        
        // Update status based on usage
        if (chunk.usedSpots >= chunk.totalSpots) {
          chunk.status = 'Full';
        } else if (new Date(chunk.validTo) < new Date()) {
          chunk.status = 'Expired';
        } else {
          chunk.status = 'Active';
        }
        
        await chunk.save();
        fixedCount++;
        console.log(`  ✅ Fixed and saved\n`);
      } else {
        console.log(`✅ Chunk OK: ${chunk.parkingName} - ${chunk.chunkName} (${chunk.availableSpots} available)`);
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} bulk booking chunks`);
    
    // Verify the fix
    console.log('\n🔍 Verification:');
    const updatedChunks = await BulkBookingChunk.find();
    const totalPurchased = updatedChunks.reduce((sum, chunk) => sum + chunk.totalSpots, 0);
    const totalAvailable = updatedChunks.reduce((sum, chunk) => sum + chunk.availableSpots, 0);
    const totalUsed = updatedChunks.reduce((sum, chunk) => sum + chunk.usedSpots, 0);
    
    console.log(`Total Purchased Spots: ${totalPurchased}`);
    console.log(`Total Used Spots: ${totalUsed}`);
    console.log(`Total Available Spots: ${totalAvailable}`);
    console.log(`Calculation Check: ${totalPurchased - totalUsed} = ${totalAvailable} ${totalPurchased - totalUsed === totalAvailable ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixBulkBookingAvailableSpots();
