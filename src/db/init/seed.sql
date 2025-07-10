\c mydb;

-- User table
CREATE TABLE "User" (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  Balance NUMERIC(12,2) DEFAULT 0.00,
  Currency VARCHAR(10) DEFAULT 'USD',
  Field VARCHAR(50)
);

-- Income table
CREATE TABLE "Income" (
  income_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "User"(user_id),
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL,
  source VARCHAR(100),
  description TEXT
);

-- Expenses table
CREATE TABLE "Expenses" (
  expense_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "User"(user_id),
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(50),
  description TEXT,
  Method VARCHAR(50)
);

-- Insert sample users
INSERT INTO "User" (email, password, name, Balance, Currency, Field)
VALUES
('john@example.com', 'hashedpass123', 'John Doe', 5000.00, 'USD', 'Engineering'),
('jane@example.com', 'hashedpass456', 'Jane Smith', 3000.00, 'EUR', 'Marketing');

-- Insert sample income
INSERT INTO "Income" (user_id, amount, date, source, description)
VALUES
(1, 2000.00, '2025-07-01', 'Salary', 'Monthly salary'),
(2, 500.00, '2025-07-03', 'Freelance', 'Side project payment');

-- Insert sample expenses
INSERT INTO "Expenses" (user_id, amount, date, category, description, Method)
VALUES
(1, 150.00, '2025-07-05', 'Food', 'Groceries shopping', 'Credit Card'),
(2, 100.00, '2025-07-06', 'Transport', 'Taxi ride', 'Cash');
