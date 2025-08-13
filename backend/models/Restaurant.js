// backend/models/Restaurant.js
const mongoose = require('mongoose');

// Define a simple sub-document schema for menu items
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  }
}, {_id: false}); // Using _id: false for subdocuments is optional but can be cleaner

const restaurantSchema = new mongoose.Schema({
  // Link to the user who created this restaurant entry
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This creates the reference to the User model
  },
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  cuisine: {
    type: String,
    required: [true, 'Please add a cuisine type']
  },
  // Embed the menu items directly into the restaurant document
  menu: [menuItemSchema]
}, {
  // Automatically create 'createdAt' and 'updatedAt' fields
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);