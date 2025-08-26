const mongoose = require('mongoose');

// DEBUG: Check if environment variables are loaded
console.log('DEBUG - MONGO_URI exists in db.js:', !!process.env.MONGO_URI);

// Set strictQuery to true for stricter schema validation
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    // Validate MONGO_URI environment variable
    if (!process.env.MONGO_URI) {
      console.error('MongoDB connection error: MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    // Connect to MongoDB with modern options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB');
});

// Handle process termination to close connection gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;