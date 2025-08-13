// backend/controllers/contactController.js
const Contact = require('../models/Contact');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const contactMessage = new Contact({
            name,
            email,
            message
        });

        await contactMessage.save();
        res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Server error while sending message.' });
    }
};

module.exports = { createContactMessage };