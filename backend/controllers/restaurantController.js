// backend/controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');

// Create a restaurant. (No changes, correctly assigns to the logged-in user, who will be an admin)
const createRestaurant = async (req, res) => {
    try {
        const { name, address, cuisine, menu } = req.body;
        if (!name || !address || !cuisine) {
            return res.status(400).json({ message: 'Name, address, and cuisine are required' });
        }
        const restaurant = new Restaurant({ name, address, cuisine, menu: menu || [], user: req.user.id });
        const createdRestaurant = await restaurant.save();
        res.status(201).json(createdRestaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- MODIFIED ---
// Get ALL restaurants. Any logged-in user can view them.
const getRestaurants = async (req, res) => {
    try {
        // Find ALL restaurants, not just those for a specific user
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- MODIFIED ---
// Get a single restaurant by ID. Any logged-in user can view it.
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // REMOVED user ownership check. Any logged-in user can see any restaurant.
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// --- MODIFIED ---
// Update a restaurant. This is now an admin-only action.
const updateRestaurant = async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // REMOVED user ownership check. The 'admin' middleware handles authorization.
        const { name, address, cuisine, menu } = req.body;
        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.cuisine = cuisine || restaurant.cuisine;
        restaurant.menu = menu || restaurant.menu;
        const updatedRestaurant = await restaurant.save();
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- MODIFIED ---
// Delete a restaurant. This is now an admin-only action.
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // REMOVED user ownership check. The 'admin' middleware handles authorization.
        await restaurant.deleteOne();
        res.status(200).json({ message: 'Restaurant removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};