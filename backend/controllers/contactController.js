// backend/controllers/contactController.js
const Contact = require('../models/Contact');
const validator = require('validator'); // Add validator package

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (typeof name !== 'string' || name.length > 100) {
            return res.status(400).json({ message: 'Name must be a string and less than 100 characters' });
        }
        if (typeof message !== 'string' || message.length > 1000) {
            return res.status(400).json({ message: 'Message must be a string and less than 1000 characters' });
        }
        const contactMessage = new Contact({ name, email, message });
        await contactMessage.save();
        res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

module.exports = { createContactMessage };