-- Seed data for E-commerce
-- Insert sample users
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@example.com', '$2b$10$ju6Akc2NtVAca6tuhkrQseiGJL0Lya38t8UlhfgTMCA5SKHoxRSHW', 'Admin User', 'admin'),
('john_doe', 'john@example.com', '$2b$10$ju6Akc2NtVAca6tuhkrQseiGJL0Lya38t8UlhfgTMCA5SKHoxRSHW', 'John Doe', 'user');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Gadgets and devices'),
('Fashion', 'Clothing and accessories'),
('Home & Garden', 'Furniture and decor'),
('Books', 'Reads for everyone');

-- Insert products
INSERT INTO products (category_id, name, description, price, image_url, stock) VALUES
(1, 'Smartphone X', 'Latest model with high-res camera', 999.00, 'https://placehold.co/400x300/3498db/ffffff?text=Smartphone', 50),
(1, 'Wireless Headphones', 'Noise cancelling headphones', 199.99, 'https://placehold.co/400x300/e74c3c/ffffff?text=Headphones', 100),
(2, 'Designer T-Shirt', '100% Cotton, comfortable fit', 29.99, 'https://placehold.co/400x300/2ecc71/ffffff?text=T-Shirt', 200),
(3, 'Modern Lamp', 'LED desk lamp with adjustable brightness', 45.50, 'https://placehold.co/400x300/f1c40f/ffffff?text=Lamp', 30),
(4, 'The Great Novel', 'Bestselling fiction book', 14.95, 'https://placehold.co/400x300/9b59b6/ffffff?text=Book', 500);

-- Insert pickup stations
INSERT INTO pickup_stations (name, address, latitude, longitude) VALUES
('Central Station Pickup', '123 Main St, City Center', 40.7128, -74.0060),
('Westside Mall Locker', '456 West Ave, Mall Plaza', 40.7200, -74.0100),
('Northbound Point', '789 North Rd, Business District', 40.7300, -73.9950);
