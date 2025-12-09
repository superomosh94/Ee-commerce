const db = require('../config/db');

// Helper to get or create cart for user
async function getOrCreateCart(userId) {
    let [carts] = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (carts.length === 0) {
        await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
        [carts] = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    }
    return carts[0];
}

exports.addToCart = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { product_id } = req.body;
    const userId = req.session.user.id;

    try {
        const cart = await getOrCreateCart(userId);

        // Check if item exists in cart
        const [items] = await db.query(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cart.id, product_id]
        );

        if (items.length > 0) {
            // Update quantity
            await db.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?',
                [items[0].id]
            );
        } else {
            // Insert new item
            await db.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cart.id, product_id, 1]
            );
        }

        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding to cart');
    }
};

exports.viewCart = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    try {
        const cart = await getOrCreateCart(userId);

        const [items] = await db.query(`
      SELECT ci.*, p.name, p.price, p.image_url 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cart.id]);

        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity;
        });

        res.render('cart', {
            title: 'Shopping Cart',
            items: items,
            total: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error viewing cart');
    }
};

exports.removeFromCart = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { item_id } = req.body;

    try {
        await db.query('DELETE FROM cart_items WHERE id = ?', [item_id]);
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing from cart');
    }
};
