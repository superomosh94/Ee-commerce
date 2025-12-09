const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const isAdmin = require('../middleware/isAdmin');

// Protect all admin routes
router.use(isAdmin);

router.get('/dashboard', adminController.getDashboard);

router.get('/add-product', productController.addProductPage);
router.post('/add-product', productController.addProduct);

router.get('/edit-product/:id', adminController.getEditProduct);
router.post('/edit-product/:id', adminController.postEditProduct);

router.post('/delete-product', adminController.deleteProduct);

module.exports = router;
