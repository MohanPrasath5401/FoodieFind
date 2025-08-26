// backend/controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// Create a restaurant
const createRestaurant = async (req, res) => {
    try {
        const { name, address, cuisine, menu } = req.body;
        if (!name || !address || !cuisine) {
            return res.status(400).json({ message: 'Name, address, and cuisine are required' });
        }
        // Validate menu if provided
        if (menu && (!Array.isArray(menu) || menu.some(item => !item.name || !item.price))) {
            return res.status(400).json({ message: 'Menu must be an array of items with name and price' });
        }
        const restaurant = new Restaurant({ name, address, cuisine, menu: menu || [], user: req.user.id });
        const createdRestaurant = await restaurant.save();
        res.status(201).json(createdRestaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ message: 'Failed to create restaurant' });
    }
};

// Get ALL restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
};

// Get a single restaurant by ID
const getRestaurantById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Failed to fetch restaurant' });
    }
};

// Update a restaurant (admin-only)
const updateRestaurant = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const { name, address, cuisine, menu } = req.body;
        // Validate inputs
        if (name && typeof name !== 'string') {
            return res.status(400).json({ message: 'Name must be a string' });
        }
        if (address && typeof address !== 'string') {
            return res.status(400).json({ message: 'Address must be a string' });
        }
        if (cuisine && typeof cuisine !== 'string') {
            return res.status(400).json({ message: 'Cuisine must be a string' });
        }
        if (menu && (!Array.isArray(menu) || menu.some(item => !item.name || !item.price))) {
            return res.status(400).json({ message: 'Menu must be an array of items with name and price' });
        }
        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.cuisine = cuisine || restaurant.cuisine;
        restaurant.menu = menu || restaurant.menu;
        const updatedRestaurant = await restaurant.save();
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ message: 'Failed to update restaurant' });
    }
};

// Delete a restaurant (admin-only)
const deleteRestaurant = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ message: 'Restaurant removed' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ message: 'Failed to delete restaurant' });
    }
};

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};