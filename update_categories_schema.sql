-- Esse script adiciona a coluna user_id à tabela de categorias e configura as políticas de segurança.
-- Execute isso no seu Editor SQL do Supabase.

-- 1. Adicionar coluna user_id se ela ainda não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'categories' AND COLUMN_NAME = 'user_id') THEN
        ALTER TABLE categories ADD COLUMN user_id UUID REFERENCES auth.users;
    END IF;
END $$;

-- 2. Habilitar RLS se não estiver habilitado
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Categories viewable by user" ON categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
DROP POLICY IF EXISTS "Users can update own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Users can create own categories" ON categories;

-- 4. Criar novas políticas de segurança
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Categories viewable by user' AND tablename = 'categories') THEN
        CREATE POLICY "Categories viewable by user" ON categories
          FOR SELECT USING (is_system = true OR auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own categories' AND tablename = 'categories') THEN
        CREATE POLICY "Users can insert own categories" ON categories
          FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own categories' AND tablename = 'categories') THEN
        CREATE POLICY "Users can update own categories" ON categories
          FOR UPDATE USING (auth.uid() = user_id AND is_system = false);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own categories' AND tablename = 'categories') THEN
        CREATE POLICY "Users can delete own categories" ON categories
          FOR DELETE USING (auth.uid() = user_id AND is_system = false);
    END IF;
END $$;
