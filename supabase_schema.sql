-- 1. Enums and Extensions
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'BRL',
  CONSTRAINT full_name_length CHECK (char_length(full_name) >= 2)
);

-- 3. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users, -- NULL for system categories
  name TEXT NOT NULL,
  icon TEXT NOT NULL, -- Emoji or Lucide icon name
  color TEXT NOT NULL, -- Hex code
  is_system BOOLEAN DEFAULT false -- True if provided by app, false if user-created
);

-- 4. Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category_id UUID REFERENCES categories NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type transaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Users can see system categories OR their own categories
CREATE POLICY "Categories viewable by user" ON categories
  FOR SELECT USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id AND is_system = false);

-- Transactions: Strict user isolation
CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert some default categories
INSERT INTO categories (name, icon, color, is_system) VALUES
('Alimentação', '🍴', '#FF9500', true),
('Transporte', '🚗', '#007AFF', true),
('Compras', '🛍️', '#FF2D55', true),
('Salário', '💰', '#34C759', true),
('Lazer', '🎮', '#5856D6', true),
('Saúde', '🏥', '#FF3B30', true),
('Educação', '📚', '#AF52DE', true);
