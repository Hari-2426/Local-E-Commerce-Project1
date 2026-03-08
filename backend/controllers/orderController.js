const db = require('../config/db');

exports.placeOrder = async (req, res) => {
    const { items, total } = req.body;
    const userId = req.user.id;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create Order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total) VALUES (?, ?)',
            [userId, total]
        );
        const orderId = orderResult.insertId;

        // 2. Add Order Items
        for (const item of items) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, 1, item.price]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error placing order', error });
    } finally {
        connection.release();
    }
};

exports.getOrderHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Fetch items for each order (simplified for demo)
        for (const order of orders) {
            const [items] = await db.execute(
                'SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
                [order.id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history', error });
    }
};
