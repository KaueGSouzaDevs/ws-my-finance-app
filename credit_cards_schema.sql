-- Módulo de Cartões de Crédito
-- Execute este script no SQL Editor do Supabase

-- 1. Tabela de Cartões de Crédito
CREATE TABLE IF NOT EXISTS credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL,
  closing_day INTEGER NOT NULL CHECK (closing_day >= 1 AND closing_day <= 31),
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Atualizar tabela de transações para suportar cartões
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'transactions' AND COLUMN_NAME = 'credit_card_id') THEN
        ALTER TABLE transactions ADD COLUMN credit_card_id UUID REFERENCES credit_cards ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Habilitar RLS
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para credit_cards
CREATE POLICY "Users can manage own credit cards" ON credit_cards
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Atualizar políticas de transações (já devem estar corretas, mas garante o isolamento)
-- A política existente para transactions já cobre o user_id, que deve ser mantido mesmo em compras no cartão.
