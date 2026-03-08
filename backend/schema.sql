-- Database Schema for LocalShop

CREATE DATABASE IF NOT EXISTS localshop_db;
USE localshop_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed Initial Products
INSERT INTO products (name, price, category, description, image) VALUES
('Premium Wireless Headphones', 199.99, 'electronics', 'Immersive sound quality with industry-leading noise cancellation.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'),
('Minimalist Smart Watch', 149.00, 'electronics', 'Stay connected and track your fitness goals with elegance.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'),
('Leather Weekend Bag', 125.00, 'fashion', 'Handcrafted genuine leather bag for your short trips.', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80'),
('Performance Running Shoes', 89.50, 'fashion', 'Breathable and lightweight shoes designed for speed.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'),
('Glass Coffee Brewer', 45.00, 'home', 'Perfect pour-over coffee brewer for modern kitchens.', 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=500&q=80'),
('Pure Essential Oils Set', 34.99, 'health', 'Organic therapeutic grade essential oils for relaxation.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80');
