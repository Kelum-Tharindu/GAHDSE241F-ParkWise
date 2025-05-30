// Test MongoDB Connection
require('dotenv').config();
const mongoose = require('mongoose');

const testMongoConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${process.env.MONGO_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connection successful!');
    console.log(`Connected to: ${mongoose.connection.host}`);
    console.log(`Database name: ${mongoose.connection.name}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection failed!');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    
    // Provide specific guidance based on error type
    if (error.name === 'MongoNetworkError') {
      console.log('\nThis appears to be a network connectivity issue:');
      console.log('1. Check your internet connection');
      console.log('2. Verify MongoDB Atlas IP whitelist settings');
      console.log('3. Check if your MongoDB Atlas cluster is running');
      console.log('4. Try using a VPN if you\'re on a restricted network');
    } else if (error.name === 'MongoServerSelectionError') {
      console.log('\nServer selection error:');
      console.log('1. Your MongoDB Atlas IP whitelist probably doesn\'t include your current IP');
      console.log('2. Visit MongoDB Atlas dashboard -> Network Access to add your current IP');
      console.log(`3. Your current public IP might be different from your local network IP`);
    } else if (error.message.includes('Authentication failed')) {
      console.log('\nAuthentication error:');
      console.log('1. Check your username and password in the connection string');
      console.log('2. Verify you\'re using the correct database user');
    }
    
    console.log('\nSuggested solutions:');
    console.log('1. Update your MongoDB Atlas IP whitelist to allow your current IP');
    console.log('2. For development, you can temporarily allow access from anywhere (0.0.0.0/0)');
    console.log('3. Check your .env file to ensure MONGO_URI is correct');
    console.log('4. Try using a local MongoDB instance for development:');
    console.log('   - Update your .env file with: MONGO_URI=mongodb://localhost:27017/parkwise');
  } finally {
    // Close the connection if it was established
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    }
  }
};

// Run the test
testMongoConnection();
