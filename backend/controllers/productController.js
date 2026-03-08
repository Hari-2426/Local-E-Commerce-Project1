const db = require('../config/db');

exports.getProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

exports.addProduct = async (req, res) => {
    const { name, price, category, description, image } = req.body;
    const priceNum = Number(price);

    if (isNaN(priceNum)) {
        return res.status(400).json({ message: 'Invalid price' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO products (name, price, category, description, image) VALUES (?, ?, ?, ?, ?)',
            [name, priceNum, category, description, image]
        );
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, price, category, description, image } = req.body;
    const id = req.params.id || req.body.id;

    if (!id) {
        return res.status(400).json({ message: 'Product id is required' });
    }

    const priceNum = Number(price);

    if (price !== undefined && isNaN(priceNum)) {
        return res.status(400).json({ message: 'Invalid price' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE products SET name = ?, price = ?, category = ?, description = ?, image = ? WHERE id = ?',
            [name, priceNum, category, description, image, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};
