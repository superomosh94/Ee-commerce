const db = require('../config/db');

exports.checkoutPage = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.session.user.id;
    try {
        // Get cart items to calculate total
        const [cartItems] = await db.query(`
      SELECT ci.*, p.price 
      FROM cart_items ci 
      JOIN carts c ON ci.cart_id = c.id
      JOIN products p ON ci.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);

        if (cartItems.length === 0) return res.redirect('/cart');

        let total = 0;
        cartItems.forEach(item => total += item.price * item.quantity);

        // Get pickup stations
        const [stations] = await db.query('SELECT * FROM pickup_stations');

        res.render('checkout', {
            title: 'Checkout',
            total: total,
            stations: stations,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { title: 'Error', message: 'Checkout Error' });
    }
};

exports.placeOrder = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.session.user.id;
    const { pickup_station_id, total_amount } = req.body;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, pickup_station_id, total_amount, status) VALUES (?, ?, ?, ?)',
            [userId, pickup_station_id, total_amount, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Get Cart Items
        const [cartItems] = await connection.query(`
        SELECT ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = ?
    `, [userId]);

        // 3. Move items to Order Items
        for (const item of cartItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.price, item.quantity]
            );
        }

        // 4. Clear Cart
        const [cart] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);

        await connection.commit();

        res.redirect(`/orders/${orderId}`); // We'll need an order confirmation/tracking page

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).send('Order placement failed');
    } finally {
        if (connection) connection.release();
    }
};

exports.getOrder = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const orderId = req.params.id;

    try {
        const [orders] = await db.query(`
            SELECT o.*, ps.name as station_name, ps.address as station_address 
            FROM orders o
            LEFT JOIN pickup_stations ps ON o.pickup_station_id = ps.id
            WHERE o.id = ? AND o.user_id = ?
        `, [orderId, req.session.user.id]);

        if (orders.length === 0) return res.status(404).send('Order not found');

        const [items] = await db.query(`
            SELECT oi.*, p.name 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);

        res.render('order-tracking', {
            title: 'Order Status',
            order: orders[0],
            items: items
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading order');
    }
};
