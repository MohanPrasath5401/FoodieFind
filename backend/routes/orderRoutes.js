// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController.js');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders); // This MUST be before '/:id'
router.route('/:id').get(protect, getOrderById);

module.exports = router;