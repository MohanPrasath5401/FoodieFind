const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (existing)
app.use('/api/auth', require('./routes/authRoutes'));

// Restaurant routes (this is the new line you are adding)
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// This line from the original starter project is no longer needed.
// You are building restaurant routes instead of task routes.
//app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// Public route for handling contact form submissions
app.use('/api/contact', require('./routes/contactRoutes'));


// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app;