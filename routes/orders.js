const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/checkout', orderController.checkoutPage);
router.post('/checkout', orderController.placeOrder);
router.get('/orders/:id', orderController.getOrder);

module.exports = router;
