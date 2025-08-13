// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { createContactMessage } = require('../controllers/contactController');

// This route is public and does not need protection middleware
router.route('/').post(createContactMessage);

module.exports = router;