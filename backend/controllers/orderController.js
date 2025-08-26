// backend/controllers/orderController.js
const Order = require('../models/Order');
const mongoose = require('mongoose');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items are required and must be a non-empty array' });
        }
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
            return res.status(400).json({ message: 'Shipping address must include street and city' });
        }
        if (!paymentMethod || typeof paymentMethod !== 'string') {
            return res.status(400).json({ message: 'Payment method is required and must be a string' });
        }
        if (typeof totalPrice !== 'number' || totalPrice <= 0) {
            return res.status(400).json({ message: 'Total price must be a positive number' });
        }
        // Validate orderItems structure
        for (const item of orderItems) {
            if (!item.name || !item.price || typeof item.price !== 'number' || item.price <= 0) {
                return res.status(400).json({ message: 'Each order item must have a name and a positive price' });
            }
        }
        // Calculate totalPrice on server to prevent tampering
        const calculatedTotal = orderItems.reduce((sum, item) => sum + item.price, 0);
        if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
            return res.status(400).json({ message: 'Total price does not match order items' });
        }
        if (!mongoose.isValidObjectId(req.user._id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.user._id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
};

module.exports = { addOrderItems, getOrderById, getMyOrders };