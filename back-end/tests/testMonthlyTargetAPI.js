// Testing the monthly target API endpoint

const axios = require('axios');
const mongoose = require('mongoose');
const Others = require('../models/otherModel');
const Transaction = require('../models/transactionModel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to test the API endpoint
const testMonthlyTargetAPI = async () => {
  try {
    console.log('Testing Monthly Target API...');
    
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Create sample data if needed
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // 1. Check if we already have a monthly target for the current month
    let others = await Others.findOne({});
    if (!others) {
      // Create new Others document with monthly target
      others = await Others.create({
        monthlyTargets: [{
          year: currentYear,
          month: currentMonth,
          targetAmount: 20000 // $20,000 default
        }]
      });
      console.log('Created new Others document with monthly target');
    } else {
      // Check if we have a target for the current month
      const targetExists = others.monthlyTargets.some(
        target => target.year === currentYear && target.month === currentMonth
      );
      
      if (!targetExists) {
        // Add a new monthly target
        others.monthlyTargets.push({
          year: currentYear,
          month: currentMonth,
          targetAmount: 20000 // $20,000 default
        });
        await others.save();
        console.log('Added new monthly target to existing Others document');
      }
    }
    
    // 2. Create some sample transactions for testing
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const existingTransactions = await Transaction.find({
      createdAt: { $gte: startOfMonth },
      type: { $in: ['billing', 'booking'] }
    });
    
    if (existingTransactions.length === 0) {
      // Create sample transactions
      await Transaction.create([
        {
          userId: mongoose.Types.ObjectId(),
          amount: 2500,
          status: 'completed',
          type: 'billing',
          createdAt: new Date(currentYear, currentMonth, 5)
        },
        {
          userId: mongoose.Types.ObjectId(),
          amount: 1800,
          status: 'completed',
          type: 'booking',
          createdAt: new Date(currentYear, currentMonth, 10)
        },
        {
          userId: mongoose.Types.ObjectId(),
          amount: 3200,
          status: 'completed',
          type: 'booking',
          createdAt: new Date(currentYear, currentMonth, 15)
        },
        {
          userId: mongoose.Types.ObjectId(),
          amount: 500,
          status: 'completed',
          type: 'billing',
          createdAt: new Date()  // Today
        }
      ]);
      console.log('Created sample transactions for testing');
    }
    
    // 3. Call the API endpoint
    const response = await axios.get('http://localhost:3000/api/dashboard/monthly-target');
    
    // 4. Print the response
    console.log('\nAPI Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // 5. Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }
    try {
      await mongoose.disconnect();
    } catch (err) {
      // Ignore disconnection errors
    }
    process.exit(1);
  }
};

// Run the test
testMonthlyTargetAPI();
