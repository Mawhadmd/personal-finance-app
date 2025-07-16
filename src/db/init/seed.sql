-- User table
CREATE TABLE "users" (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  balance NUMERIC(12,2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'USD',
  field VARCHAR(50),
  refresh_token VARCHAR(255),
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verification_code VARCHAR(6),
  ai_eval TEXT DEFAULT NULL,
  latest_ai_eval TIMESTAMP DEFAULT NULL
);

-- Income table
CREATE TABLE "income" (
  income_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "users" (user_id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category VARCHAR(100),
  method VARCHAR(50),
  description TEXT
);

-- Expenses table
CREATE TABLE "expenses" (
  expense_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "users" (user_id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category VARCHAR(50),
  description TEXT,
  method VARCHAR(50)
);

-- verification_codes table
CREATE TABLE verification_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "users" (user_id) ON DELETE CASCADE,
  code VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  email VARCHAR(100) NOT NULL
);

-- CustomCategory table 
CREATE TABLE custom_category (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "users" (user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample users
INSERT INTO "users" (email, password, name, balance, currency, field)
VALUES
('john@example.com', 'hashedpass123', 'John Doe', 5000.00, 'USD', 'Engineering'),
('jane@example.com', 'hashedpass456', 'Jane Smith', 3000.00, 'EUR', 'Marketing');

-- Insert sample income 
INSERT INTO "income" (user_id, amount, date, category, method, description)
VALUES
(1, 2000.00, '2025-07-01', 'Salary', 'Bank Transfer', 'Monthly salary'),
(2, 500.00, '2025-07-03', 'Freelance', 'PayPal', 'Side project payment');

-- Insert sample expenses
INSERT INTO "expenses" (user_id, amount, date, category, description, method)
VALUES
(1, 150.00, '2025-07-05', 'Food', 'Groceries shopping', 'Credit Card'),
(2, 100.00, '2025-07-06', 'Transport', 'Taxi ride', 'Cash');
