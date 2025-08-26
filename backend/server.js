// Debug: show current directory and check .env file
console.log('Current directory:', __dirname);
const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('.env file exists:', fs.existsSync(envPath));
console.log('.env file path:', envPath);

// Read and display .env file content (mask sensitive info)
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env file content:');
  // Mask password in MONGO_URI for security
  const maskedContent = envContent.replace(/:([^@]+)@/, ':****@');
  console.log(maskedContent);
  
  // Check each line of the .env file
  const lines = envContent.split('\n');
  console.log('.env file lines:');
  lines.forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      console.log(`  Line ${index + 1}: ${line.trim()}`);
    }
  });
}

// Load environment variables
console.log('Loading environment variables...');
require('dotenv').config();
console.log('DEBUG - MONGO_URI exists in server.js:', !!process.env.MONGO_URI);

// Check specific environment variables
console.log('DEBUG - process.env.MONGO_URI:', process.env.MONGO_URI ? 'EXISTS' : 'MISSING');
console.log('DEBUG - process.env.NODE_ENV:', process.env.NODE_ENV || 'MISSING');
console.log('DEBUG - process.env.JWT_SECRET:', process.env.JWT_SECRET ? 'EXISTS' : 'MISSING');

// Continue with the rest of your server code
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Your routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// If the file is run directly, start the server
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;