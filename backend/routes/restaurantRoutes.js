// backend/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');

// --- MODIFIED ---
// Import both 'protect' and the new 'admin' middleware
const { protect, admin } = require('../middleware/authMiddleware');

// Define the routes and apply correct middleware
router.route('/')
    // Any authenticated user can get the list of restaurants
    .get(protect, getRestaurants)
    // Only an admin can create a new restaurant
    .post(protect, admin, createRestaurant);

router.route('/:id')
    // Any authenticated user can get details of a single restaurant
    .get(protect, getRestaurantById)
    // Only an admin can update a restaurant
    .put(protect, admin, updateRestaurant)
    // Only an admin can delete a restaurant
    .delete(protect, admin, deleteRestaurant);

module.exports = router;