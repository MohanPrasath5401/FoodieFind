// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // We fetch the user here, so their 'role' is available in req.user
            req.user = await User.findById(decoded.id).select('-password'); 
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- NEW FUNCTION ---
// Middleware to check if the user has the 'admin' role.
// This should always be used AFTER the 'protect' middleware.
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/controller.
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// --- EXPORT THE NEW FUNCTION ---
module.exports = { protect, admin };