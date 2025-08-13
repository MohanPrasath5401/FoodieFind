// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Import the 'path' module for robust path handling
const User = require('../models/User');


dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Helper function to connect to the database
const connectDB = async () => {
    // Now this will find the MONGO_URI because we specified the path above
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI not found in .env file! Please check the path and file content.');
        return;
    }
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully for script execution.');
    }
};

// Helper function to disconnect
const disconnectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('Database connection closed.');
    }
};

const createAdmin = async () => {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) return; // Stop if connection failed

    const adminEmail = 'admin@restaurant.com';
    const adminPassword = 'adminpassword123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user with this email already exists.');
      return;
    }

    // The User model's pre-save hook will automatically hash this password
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    // Ensure disconnection happens
    await disconnectDB();
  }
};

// Run the function
createAdmin();