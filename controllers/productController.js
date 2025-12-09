const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);

        // In a real app, we might handle rendering in the router, 
        // but for this structure, we can return data or render here.
        // Let's return data to be used by the route handler or render directly if this is the route handler.
        // For now, let's assume this is called by the route.
        return products;
    } catch (error) {
        throw error;
    }
};

exports.getProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [productId]);

        if (products.length === 0) {
            return res.status(404).render('404', { title: 'Product Not Found' });
        }

        res.render('product-detail', {
            title: products[0].name,
            product: products[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { title: 'Error', message: 'Server Error' });
    }
};

exports.addProductPage = (req, res) => {
    res.render('admin/add-product', { title: 'Add Product', error: null, success: null });
};

exports.addProduct = async (req, res) => {
    const { name, description, price, category_id, image_url, stock } = req.body;

    // Basic validation could go here

    try {
        await db.query(`
      INSERT INTO products (name, description, price, category_id, image_url, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, price, category_id, image_url, stock]);

        res.render('admin/add-product', {
            title: 'Add Product',
            error: null,
            success: 'Product added successfully!'
        });
    } catch (error) {
        console.error(error);
        res.render('admin/add-product', {
            title: 'Add Product',
            error: 'Failed to add product',
            success: null
        });
    }
};
