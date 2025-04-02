CREATE DATABASE elestudiante;
USE elestudiante;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Should be stored encrypted
    role ENUM('Customer', 'Administrator') DEFAULT 'Customer'
);

CREATE TABLE orders (
    order_id INT (10) PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_Details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


INSERT INTO users (name, email, password, role) VALUES
('Esteban', 'esteban85@gmail.com', '232234', 'Customer'),
('Alejandro', 'alejo96@gmail.com', 'dseww223', 'Customer'),
('Cesar', 'hulk58@gmail.com', '988we', 'Customer'),
('David', 'david85@gmail.com', '857747', 'Customer');

INSERT INTO products (name, description, price) VALUES
('Tacos', '5 tacos de carnitas y salsa verde', 120),
('Hamburguesa', 'Hamburguesa con queso y papas', 160),
('New york', 'Corte de carne con verduras hervidas', 400),
('Michelada', 'Cerveza preparada, con limon y clamato', 150),
('Copa de Bacardi', 'Bacardi con Coca Cola', 100);

INSERT INTO orders (user_id, order_date, total) VALUES
(5, '2024-01-01', 560),
(4, '2024-01-01', 380),
(3, '2024-01-01', 380),
(2, '2019-01-01', 550);

INSERT INTO order_Details (order_id, product_id, quantity, unit_price) VALUES
(5, 2, 1, 160),
(5, 3, 1, 400),
(4, 1, 1, 120),
(4, 2, 1, 160),
(4, 5, 1, 100);

INSERT INTO reservations (user_id, reservation_date, reservation_time) VALUES
(5, '2025-01-25', '14:30:00'),
(3, '2025-01-14', '14:30:00'),
(4, '2025-04-25', '14:30:00'),
(2, '2025-05-12', '14:30:00'),
(5, '2025-07-02', '14:30:00');





SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_Details;
SELECT * FROM reservations;


