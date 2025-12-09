const db = require('../config/db');
const productController = require('./productController');

exports.getDashboard = async (req, res) => {
    try {
        const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { title: 'Error', message: 'Server Error' });
    }
};

exports.getEditProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).send('Product not found');
        }

        res.render('admin/edit-product', {
            title: 'Edit Product',
            product: products[0],
            error: null,
            success: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.postEditProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, price, stock, description, image_url, category_id } = req.body;

    try {
        await db.query(`
      UPDATE products 
      SET name = ?, price = ?, stock = ?, description = ?, image_url = ?, category_id = ?
      WHERE id = ?
    `, [name, price, stock, description, image_url, category_id, productId]);

        // Re-fetch to show updated data
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);

        res.render('admin/edit-product', {
            title: 'Edit Product',
            product: products[0],
            error: null,
            success: 'Product updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.render('admin/edit-product', {
            title: 'Edit Product',
            product: req.body, // keep user input
            error: 'Failed to update product',
            success: null
        });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.body.product_id;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [productId]);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting product');
    }
};
