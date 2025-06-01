CREATE DATABASE IF NOT EXISTS todoapp;
USE todoapp;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Index for better query performance
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_completed (completed)
);

-- Insert sample user for testing
INSERT INTO users (username, email, password_hash) VALUES 
('testuser', 'test@example.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFGKFtFDHuEbv8t3nBjjrWGHJPFKv7x6');
-- Password is 'password123' (we'll use BCrypt hashing in Spring Boot)

-- Insert sample tasks for testing
INSERT INTO tasks (title, description, user_id, completed) VALUES 
('Buy books', 'Buy books for the next school year', 1, FALSE),
('Clean home', 'Need to clean the bed room', 1, FALSE),
('Takehome assignment', 'Finish the real-time assignment', 1, FALSE),
('Play Cricket', 'Plan the soft ball cricket match on next Sunday', 1, FALSE),
('Help Saman', 'Saman need help with his software project', 1, FALSE);