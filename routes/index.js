const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Home page (Product Catalog)
router.get('/', async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    res.render('index', {
      title: 'Home',
      products: products
    });
  } catch (error) {
    console.error(error);
    res.render('index', {
      title: 'Home',
      products: [],
      error: 'Failed to load products'
    });
  }
});

router.get('/product/:id', productController.getProduct);

// Admin Routes (Moved to routes/admin.js)


module.exports = router;
